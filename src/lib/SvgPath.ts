import { Position } from "geojson";

/** 
 *  https://github.com/d3/d3-geo/blob/main/src/path/string.js
 */
export class SvgPath {

  private d: number = 0;
  private pathStr: string = '';
  private _center: Position = [0,0];

  constructor(geometry: any) {

    let coordinates = geometry.coordinates;
    for (let i=0;i<coordinates.length;++i) {
      let coordinate = coordinates[i];
      for (let i2=0;i2<coordinate.length;++i2) {
        let xy = coordinate[i2];
        for (let i3=0;i3<xy.length;++i3) {
          this.addPath(xy[i3][0], xy[i3][1]);
        }
        this.pathStr += "Z";
      }
    }
  }

  private addPath(x: number, y: number) {

    function interpolator(a:Number, b:Number, t:Number) {
      return +a * (1 - +t) + +b * +t;
    }

    // const k = 10000;
    const max = 127.5;
    const min = 126.5;

    x = (x - min) / (max-min);
    y = (y - 37) / (37 - 36);
    x = interpolator(0, 1000, x);
    y = interpolator(0, 700, y);
    // y = (y - min) / (max-min);
    // x *= 0.1;
    // y *= 0.1;
    this._center = [x, y];
    switch (this.d) {
      case 0: {
        this.pathStr += `M${x},${y}`;
        this.d = 1;
        break;
      }
      case 1: {
        this.pathStr += `L${x},${y}`;
        break;
      }
    }
  }

  public get path() {
    return this.pathStr;
  }

  public get center() {
    return this._center;
  }
}