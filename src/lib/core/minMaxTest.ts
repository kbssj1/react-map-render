import { BBox, Position } from "geojson";

export class MinMaxTest {
  private _minMax: BBox = [1000, 1000, -1000, -1000];
  private a:any = [];

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
          this.a.push({x:x, y:y});
        }
      }
    }
  }

  public calaulte() {
    for (let i=0;i<this.a.length;++i) {
      this._minMax[0] = Math.min(this._minMax[0], this.a[i].x);
      this._minMax[1] = Math.min(this._minMax[1], this.a[i].y);
      this._minMax[2] = Math.max(this._minMax[2], this.a[i].x);
      this._minMax[3] = Math.max(this._minMax[3], this.a[i].y);
    }
  }

  public get minMax() {
    return this._minMax;
  }
}