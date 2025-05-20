import { Vec3 } from "./math/vec3";
import Base3DClass from "./base3DClass";

class Mesh extends Base3DClass {

    private _positions: Vec3[] = [];
    private _indices: number[] = [];

    constructor() {
      super(new Vec3(), "Object");
    }

    public addPosition(position : Vec3) {
      this._positions.push(position);
    }

    public set positions(positions: Float32Array | Int16Array) {
      for (let i=0;i<positions.length;i+=3) {
        this._positions.push(new Vec3([positions[i] * 10, positions[i+1] * 10, positions[i+2] * 10]));
      }
    }

    public get positions() {
      return this.positions;
    }

    public get indices() : number[] {
      return this._indices;
    }

    public set indices(indices: Float32Array | Int16Array) {
      for (let i=0;i<indices.length;++i) {
        this._indices.push(indices[i]);
      }
    }

    get arrayPositions() : number[] {
      let array = [];
      for (let i=0;i<this.positions.length;++i) {
        array.push(this._positions[i].x);
        array.push(this._positions[i].y);
        array.push(this._positions[i].z);
      }
      return array;
    }
}
  
export default Mesh;