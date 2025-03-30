import { Vec3 } from "./math/vec3";
import Object from "./object";

class Mesh extends Object {

    private positions: Vec3[] = []; 

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
}
  
export default Mesh;