import * as gltf from './gltf';

class GltfLoader {

  constructor() {
  
  }

  public async loadModel() {
    const response = await fetch("http://localhost:3000/Duck.gltf");
    const gltf = await response.json() as gltf.GlTf;

    
  }

}

export default GltfLoader;