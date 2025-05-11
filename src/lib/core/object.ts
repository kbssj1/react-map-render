import { Vec3 } from "./math/vec3";
import Base3dClass from "./base3DClass";
import Mesh from "./mesh";
import Material from "./Material";

class Object extends Base3dClass {
  public mesh:Mesh;
  public material:Material;

  constructor(mesh:Mesh, material:Material) {
    super(new Vec3(), "Object");
    this.mesh = mesh;
    this.material = material;
  }
}
  
export default Object;