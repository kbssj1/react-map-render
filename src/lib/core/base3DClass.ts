import { Vec3 } from "./math/vec3";

abstract class Base3dClass {

    private _localPosition : Vec3 = new Vec3()
    private _rotation : Vec3 = new Vec3()

    public name: string = "object";

    constructor(position: Vec3, name: string) {
        if (position) {
            this._localPosition = position;
        }
        if (name) {
            this.name = name;
        }
    }

    public get localPosition() : Vec3{
        return this._localPosition
    }

    public set localPosition(position: Vec3) {
        this._localPosition = position;
    }

    public get rotation() : Vec3{
        return this._rotation
    }

    public set rotation(rotation: Vec3) {
        this._rotation = rotation;
    }
}
  
export default Base3dClass;