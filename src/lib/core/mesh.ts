import { Vec3 } from "./math/vec3";
import Base3DClass from "./base3DClass";
import { gltfModel } from "./loader/gltfLoader";

class Mesh extends Base3DClass {

    private _positions: Vec3[] = [];
    private _normal: Vec3[] = [];
    private _indices: number[] = [];

    constructor(type: string, gltfModel: gltfModel);
    constructor(type: string);

    constructor(type?: string, gltfModel? : gltfModel) {
      super(new Vec3(), "Object");
      if (type == "gltf" && gltfModel) {
        this.positions = gltfModel.meshes[0].positions!.data;
        this.indices = gltfModel.meshes[0].indices!.data;
        this.normal = gltfModel.meshes[0].normals!.data;
      } else if (type == "sphere") {
        this.setSphereMesh();
      } else if (type == "box") {
        this.setBoxMesh(1,1,1);
      } else {
        console.error("Mesh Constructor Type Error");
      }
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

    private setSphereMesh() {
      const { positions, normals, indices } = createSphere(1, 20, 20);
      //
      this.positions = new Float32Array(positions);
      this.normal = new Float32Array(normals);
      this.indices = new Int16Array(indices);

      function createSphere(radius:number, latBands:number, longBands:number) {
        const positions = [];
        const indices = [];
        const normals = [];

        for (let lat = 0; lat <= latBands; lat++) {
          const theta = lat * Math.PI / latBands;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
      
          for (let lon = 0; lon <= longBands; lon++) {
            const phi = lon * 2 * Math.PI / longBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
      
            const x = sinTheta * cosPhi;
            const y = cosTheta;
            const z = sinTheta * sinPhi;
      
            positions.push(radius * x, radius * y, radius * z);
            normals.push(x, y, z);
          }
        }  

        for (let lat = 0; lat < latBands; ++lat) {
          for (let lon = 0; lon < longBands; ++lon) {
            const first = (lat * (longBands + 1)) + lon;
            const second = first + longBands + 1;
      
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
          }
        }
      
        return { positions, normals, indices };
      }
    }

    private setBoxMesh(width:number=1, height:number=1, depth:number=1) {
      const w = width / 2;
      const h = height / 2;
      const d = depth / 2;

      const positions = [
        -w, -h,  d,  w, -h,  d,  w,  h,  d,  -w,  h,  d,
        -w, -h, -d, -w,  h, -d,  w,  h, -d,  w, -h, -d,
        -w,  h, -d, -w,  h,  d,  w,  h,  d,  w,  h, -d,
        -w, -h, -d,  w, -h, -d,  w, -h,  d,  -w, -h,  d,
        w, -h, -d,  w,  h, -d,  w,  h,  d,  w, -h,  d,
        -w, -h, -d, -w, -h,  d, -w,  h,  d, -w,  h, -d,
      ];

      //
      const normals = [
        0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
        0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
        0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,
        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
       -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
      ];

      // 
      const indices = [
        0,1,2,   0,2,3,       
        4,5,6,   4,6,7,       
        8,9,10,  8,10,11,    
        12,13,14,12,14,15,    
        16,17,18,16,18,19,    
        20,21,22,20,22,23,   
      ];

      this.positions = new Float32Array(positions);
      this.normal = new Float32Array(normals);
      this.indices = new Int16Array(indices);
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