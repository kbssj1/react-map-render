import Base3DClass from "./base3DClass";
import DirectionalLighting from "./directionalLighting";
import { Vec3 } from "./math/vec3";

class Scene {

    private objects: Base3DClass[] = []; 

    constructor() {
        this.add(new DirectionalLighting(new Vec3([0.2, 1, 0.2]), new Vec3([0.5, 0.7, -1.0])));
    }

    public add(obj : Base3DClass) {
        this.objects.push(obj);
    }

    public getObject(i: number) {
        return this.objects[i];
    }

    public getObjectLength() {
        return this.objects.length;
    }
 
}
  
export default Scene;