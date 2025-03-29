import { Vec3 } from "./math/vec3";

abstract class Object {

    private position : Vec3 = new Vec3()

    public name: string = "object";

    constructor(position: Vec3, name: string) {
        if (position) {
            this.position = position;
        }
        if (name) {
            this.name = name;
        }
    }
}
  
export default Object;