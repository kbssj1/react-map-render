import { Vec3 } from "./math/vec3";

type Nullable<T> = T | null;

class Material {

  private TexCoord: number[] = [];
  public color:Nullable<Vec3> = null;
  public image:HTMLImageElement;
  public emissiveImage:HTMLImageElement;

  constructor(color:Nullable<Vec3>, image:HTMLImageElement, emissiveImage:HTMLImageElement) {
    this.color = color;
    this.image = image;
    this.emissiveImage = emissiveImage;
  }

  get texCoord() : number[] {
    return this.TexCoord;
  }

  set texCoord(texCoord: Float32Array | Int16Array) {
    for (let i=0;i<texCoord.length;++i) {
      this.TexCoord.push(texCoord[i]);
    }
  }
}
  
export default Material;