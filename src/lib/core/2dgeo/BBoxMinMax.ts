import { BBox, Position } from "geojson";

export class BBoxMinMax {
  private _minMax: BBox = [1000, 1000, -1000, -1000];
  private a:Position[] = [];

  constructor() {

  }

  public push(geometry: any) {
    let coordinates = geometry.coordinates;
    for (let i=0;i<coordinates.length;++i) {
      let coordinate = coordinates[i];
      for (let i2=0;i2<coordinate.length;++i2) {
        let xy = coordinate[i2];
        for (let i3=0;i3<xy.length;++i3) {
          const x = xy[i3][0];
          const y = -xy[i3][1];
          this.a.push([x, y]);
        }
      }
    }
  }

  public pushArray(a:Position[]) {
    this.a = a;
  }

  public calaulte() {
    for (let i=0;i<this.a.length;++i) {
      this._minMax[0] = Math.min(this._minMax[0], this.a[i][0]);
      this._minMax[1] = Math.min(this._minMax[1], this.a[i][1]);
      this._minMax[2] = Math.max(this._minMax[2], this.a[i][0]);
      this._minMax[3] = Math.max(this._minMax[3], this.a[i][1]);
    }
  }

  public get minMax() {
    return this._minMax;
  }
}