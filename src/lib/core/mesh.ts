import { Vec3 } from "./math/vec3";
import Object from "./object";

class Mesh extends Object {

    private positions: Vec3[] = [];
    private indices: number[] = [];

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

    public getIndices() : number[] {
      return this.indices;
    }

    public setIndices(indices: number[]) {
      for (let i=0;i<indices.length;++i) {
        this.indices.push(indices[i]);
      }
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