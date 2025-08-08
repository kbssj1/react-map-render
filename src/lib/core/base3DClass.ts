import { Vec3 } from "./math/vec3";

abstract class Base3dClass {

    private _localPosition : Vec3 = new Vec3()
    private _localRotation : Vec3 = new Vec3()
    private _scale: Vec3 = new Vec3()

    public name: string = "object";

    constructor(position: Vec3, name: string) {
        if (position) {
            this._localPosition = position;
        }
        if (name) {
            this.name = name;
        }
        this.scale = new Vec3([1, 1, 1]);
    }

    public get localPosition() : Vec3{
        return this._localPosition
    }

    public set localPosition(position: Vec3) {
        this._localPosition = position;
    }

    public get localRotation() : Vec3{
        return this._localRotation
    }

    public set localRotation(rotation: Vec3) {
        this._localRotation = rotation;
    }

    public get scale() : Vec3{
        return this._scale
    }

    public set scale(scale: Vec3) {
        this._scale = scale;
    }
}
  
export default Base3dClass;