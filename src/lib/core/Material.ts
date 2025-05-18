import { Vec3 } from "./math/vec3";

class Material {

  private TexCoord: number[] = [];
  public color:Vec3 = new Vec3([0.1, 0.8, 0.1]);
  public image:HTMLImageElement;

  constructor(color:Vec3, image:HTMLImageElement) {
    this.color = color;
    this.image = image;
  }

  get texCoord() : number[] {
    return this.TexCoord;
  }

  set texCoord(texCoord: number[]) {
    for (let i=0;i<texCoord.length;++i) {
      this.TexCoord.push(texCoord[i]);
    }
  }
}
  
export default Material;