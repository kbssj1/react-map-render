import { Vec3 } from "./math/vec3";

abstract class Object {

    private _position : Vec3 = new Vec3()
    private _rotation : Vec3 = new Vec3()

    public name: string = "object";

    constructor(position: Vec3, name: string) {
        if (position) {
            this.position = position;
        }
        if (name) {
            this.name = name;
        }
    }

    public get position() : Vec3{
        return this._position
    }

    public set position(position: Vec3) {
        this._position = position;
    }

    public get rotation() : Vec3{
        return this._rotation
    }

    public set rotation(rotation: Vec3) {
        this._rotation = rotation;
    }
}
  
export default Object;