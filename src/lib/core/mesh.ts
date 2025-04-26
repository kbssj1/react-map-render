import { Vec3 } from "./math/vec3";
import Object from "./object";

class Mesh extends Object {

    private positions: Vec3[] = [];
    private _indices: number[] = [];

    constructor() {
      super(new Vec3(), "Object");
    }

    public addPosition(position : Vec3) {
      this.positions.push(position);
    }

    public setPosition(positions: Vec3[]) {
      this.positions = positions;
    }

    public getPositions() {
      return this.positions;
    }

    get indices() : number[]{
      return this._indices;
    }

    set indices(indices: number[]) {
      this._indices = indices;
    }

    get arrayPositions() : number[] {
      let array = [];
      for (let i=0;i<this.positions.length;++i) {
        array.push(this.positions[i].x);
        array.push(this.positions[i].y);
        array.push(this.positions[i].z);
      }
      return array;
    }
}
  
export default Mesh;