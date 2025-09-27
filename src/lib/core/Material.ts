import { Vec3 } from "./math/vec3";
import { gltfModel } from "./loader/gltfLoader";

type Nullable<T> = T | null;

class Material {

  private _texCoord: number[] = [];
  public color:Nullable<Vec3> = null;
  public image:Nullable<HTMLImageElement> = null;
  public emissiveImage:Nullable<HTMLImageElement> = null;

  constructor(gltfModel? : gltfModel, color?: Vec3) {
    if (gltfModel) {
      let texCoord = gltfModel.meshes[0].texCoord!.data;
      this.texCoord = texCoord;
      this.image = gltfModel.materials[0].image;
      this.emissiveImage = gltfModel.materials[0].emissiveImage;
    }
    if (color) {
      this.color = color;
    }
  }

  get texCoord() : number[] {
    return this._texCoord;
  }

  set texCoord(texCoord: Float32Array | Int16Array) {
    for (let i=0;i<texCoord.length;++i) {
      this._texCoord.push(texCoord[i]);
    }
  }
}
  
export default Material;