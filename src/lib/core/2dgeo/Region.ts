import { BBox, Position } from "geojson";
import { BBoxMinMax } from "./BBoxMinMax";

/** 
 *  https://github.com/d3/d3-geo/blob/main/src/path/string.js
 */
export class Region {

  private d: number = 0;
  private _name: string = '';
  private _path: string = '';
  private _center: Position = [0,0];
  private _a:Position[] = [];
  private _minMax: BBox = [0, 0, 0, 0];
  private _m:BBoxMinMax = new BBoxMinMax();

  constructor(geometry: any, minMax:any) {

    //
    let coordinates = geometry.coordinates;
    this._minMax = minMax;
    for (let i=0;i<coordinates.length;++i) {
      let coordinate = coordinates[i];
      for (let i2=0;i2<coordinate.length;++i2) {
        let xy = coordinate[i2];
        for (let i3=0;i3<xy.length;++i3) {
          const x = xy[i3][0];
          const y = -xy[i3][1]; // reverse
          this.addPath(x, y);
        }
        this._path += "Z";
      }
    }
    this._m.pushArray(this._a);
    this._m.calaulte();
    this._center = [(this._m.minMax[0] + this._m.minMax[2]) / 2, (this._m.minMax[1] + this._m.minMax[3]) / 2];
  }

  private addPath(x: number, y: number) {

    function interpolator(a:Number, b:Number, t:Number) {
      return +a * (1 - +t) + +b * +t;
    }

    x = (x - this._minMax[0]) / (this._minMax[2]-this._minMax[0]);
    y = (y - this._minMax[1]) / (this._minMax[3]-this._minMax[1]);
    x = interpolator(0, 600, x);
    y = interpolator(0, 400, y);
    this._a.push([x, y]);
    switch (this.d) {
      case 0: {
        this._path += `M${x},${y}`;
        this.d = 1;
        break;
      }
      case 1: {
        this._path += `L${x},${y}`;
        break;
      }
    }
  }

  public get path() {
    return this._path;
  }

  public get center() {
    return this._center;
  }

  public get name() {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }
}