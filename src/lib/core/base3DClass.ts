import { Vec3 } from "./math/vec3";
import { Mat4 } from "./math/mat4";

abstract class Base3dClass {

    private _localPosition : Vec3 = new Vec3()
    private _localRotation : Vec3 = new Vec3()
    private _scale: Vec3 = new Vec3()
    /** Recalculate only when position, rotation, scale changes, not every frame */
    private _dirtyFlag: boolean = true;

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
        if (!this._localPosition.equals(position)){
            this._localPosition = position;
            this._dirtyFlag = true;
        }
    }

    public get localRotation() : Vec3{
        return this._localRotation
    }

    public set localRotation(rotation: Vec3) {
        if (!this._localRotation.equals(rotation)){
            this._localRotation = rotation;
            this._dirtyFlag = true;
        }
    }

    public get scale() : Vec3{
        return this._scale
    }

    public set scale(scale: Vec3) {
        if (!this._scale.equals(scale)){
            this._scale = scale;
            this._dirtyFlag = true;
        }
    }

    public get dirtyFlag() : boolean {
        return this._dirtyFlag;
    }

    public set dirtyFlag(flag: boolean) {
        this._dirtyFlag = flag;
    }
}
  
export default Base3dClass;