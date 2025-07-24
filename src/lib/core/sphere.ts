import Base3DClass from "./base3DClass";
import { Vec3 } from "./math/vec3";
import Mesh from "./mesh";

class Sphere extends Base3DClass {

  private _mesh: Mesh;

  constructor() {
    super(new Vec3(), "Sphere");
    this._mesh = new Mesh();
    const { positions, normals, indices } = this.createSphere(5, 20, 20);
    //
    this._mesh.positions = new Float32Array(positions);
    this._mesh.normal = new Float32Array(normals);
    this._mesh.indices = new Int16Array(indices);
  }

  private createSphere(radius:number, latBands:number, longBands:number) {
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
  
export default Sphere;