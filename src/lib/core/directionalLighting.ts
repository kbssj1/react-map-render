import { Vec3 } from "./math/vec3";
import Base3DClass from "./base3DClass";

class DirectionalLighting extends Base3DClass {
  public color:Vec3;
  public direction:Vec3;

  constructor(color:Vec3, direction:Vec3) {
    super(new Vec3([0,0,0]),"directionalLighting");
    this.color = color;
    this.direction = direction;
  }
}
  
export default DirectionalLighting;