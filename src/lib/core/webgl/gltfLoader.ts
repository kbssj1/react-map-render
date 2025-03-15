import * as gltf from './gltf';

class GltfLoader {

  constructor() {
  
  }

  public async loadModel(url:string) {
    const response = await fetch(url);
    const gltf = await response.json() as gltf.GlTf;
    const buffers = await Promise.all(
      gltf.buffers!.map(async (b) => await this.getBuffer(url, b.uri!)
    ));
    console.log(buffers);
  }

  private async getBuffer(path: string, buffer: string) {
    const EMBEDDED_DATA_REGEXP = /(.*)data:(.*?)(;base64)?,(.*)$/;
    const dir = path.split('/').slice(0, -1).join('/');
    const finalPath = EMBEDDED_DATA_REGEXP.test(buffer) ? await this.resolveEmbeddedBuffer(buffer) : `${dir}/${buffer}`;
    const response = await fetch(finalPath);
    return await response.arrayBuffer();
  };

  private async resolveEmbeddedBuffer (url: string) : Promise<string> {
    const content = url.split(',')[1]; 
    const binaryData = atob(content); 
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'application/octet-stream' }); // Crea un Blob
    return URL.createObjectURL(blob); 
  }

}

export default GltfLoader;