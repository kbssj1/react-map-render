import Base3DClass from "./base3DClass";

class Scene {

    private objects: Base3DClass[] = []; 

    constructor() {
  
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