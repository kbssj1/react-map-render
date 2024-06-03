/** 
 *  https://github.com/d3/d3-geo/blob/main/src/path/string.js
 */
export class SvgPath {

  private d: number = 0;
  private pathStr: string = '';

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
    x *= 10;
    y *= 10;
    x = Math.round(x);
    y = Math.round(y);
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
}