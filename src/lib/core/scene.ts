import Object from "./object";

class Scene {

    private objects: Object[] = []; 

    constructor() {
  
    }

    public add(obj : Object) {
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