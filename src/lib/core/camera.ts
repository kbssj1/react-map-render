import Base3DClass from "./base3DClass";


class Camera extends Base3DClass {
  public yaw:number = 0;
  public pitch:number = 0;
  public cameraDistance:number = 1;
}
  
export type cameraType = "orbit" | "fly";
export default Camera;