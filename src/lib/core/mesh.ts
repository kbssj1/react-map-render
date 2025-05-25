import { Vec3 } from "./math/vec3";
import Base3DClass from "./base3DClass";

class Mesh extends Base3DClass {

    private _positions: Vec3[] = [];
    private _normal: Vec3[] = [];
    private _indices: number[] = [];

    constructor() {
      super(new Vec3(), "Object");
    }

    public addPosition(position : Vec3) {
      this._positions.push(position);
    }

    public set positions(positions: Float32Array | Int16Array) {
      for (let i=0;i<positions.length;i+=3) {
        this._positions.push(new Vec3([positions[i], positions[i+1], positions[i+2]]));
      }
    }

    public get positions() : Vec3[]{
      return this._positions;
    }

    public get indices() : number[] {
      return this._indices;
    }

    public set indices(indices: Float32Array | Int16Array) {
      for (let i=0;i<indices.length;++i) {
        this._indices.push(indices[i]);
      }
    }

    public get normal() : Vec3[] {
      return this._normal;
    }

    public set normal(normal: Float32Array | Int16Array) {
      for (let i=0;i<normal.length;i+=3) {
        this._normal.push(new Vec3([normal[i], normal[i+1], normal[i+2]]));
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

    get arrayNormal() : number[] {
      let array = [];
      for (let i=0;i<this.normal.length;++i) {
        array.push(this._normal[i].x);
        array.push(this._normal[i].y);
        array.push(this._normal[i].z);
      }
      return array;
    }
}
  
export default Mesh;