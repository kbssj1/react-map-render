import Object from "./object";

class Scene {

    private objects: Object[] = []; 

    constructor() {
  
    }

    public add(obj : Object) {
        this.objects.push(obj);
    }
 
}
  
export default Scene;