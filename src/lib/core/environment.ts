import DirectionalLighting from "./directionalLighting";

class Environment {
  private _directionalLighting:DirectionalLighting;

  constructor(directionalLighting:DirectionalLighting) {
    this._directionalLighting = directionalLighting;
  }

  get directionalLighting() : DirectionalLighting {
    return this._directionalLighting;
  }
}
  
export default Environment;