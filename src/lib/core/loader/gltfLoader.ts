import * as gltf from './gltf';

export interface Buffer {
  data: Float32Array | Int16Array;
  size: number;
  type: string;
  componentType: BufferType;
  glBuffer: WebGLBuffer;
}

export enum BufferType {
  Float = 5126,
  Short = 5123,
}

class GltfLoader {

  constructor() {
  
  }

  public async loadModel(url:string) {
    const response = await fetch(url);
    const gltf = await response.json() as gltf.GlTf;
    const buffers = await Promise.all(
      gltf.buffers!.map(async (b) => await this.getBuffer(url, b.uri!)
    ));
   
    const scene = gltf.scenes![gltf.scene || 0];
    // const meshes = gltf.meshes!.map(m => this.loadMesh(gltf, m, buffers));
    const meshes = await Promise.all(
      gltf.meshes!.map(m => this.loadMesh(gltf, m, buffers))
    );
    
    return meshes;
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

  private async loadMesh (gltf: gltf.GlTf, mesh: gltf.Mesh, buffers: ArrayBuffer[]) {
    let elementCount = 0;
    let indexBuffer;
    if (mesh.primitives[0].indices !== undefined) {
        const indexAccessor = gltf.accessors![mesh.primitives[0].indices!];
        indexBuffer = this.readBufferFromFile(gltf, buffers, indexAccessor);

        elementCount = indexBuffer.data.length;
    } else {

    }

    return {
      elementCount,
      indices: indexBuffer,
      positions: this.getBufferFromName(gltf, buffers, mesh, 'POSITION'),
    };
  }

  private getBufferFromName (gltf: gltf.GlTf, buffers: ArrayBuffer[], mesh: gltf.Mesh, name: string) {
    if (mesh.primitives[0].attributes[name] === undefined) {
        return null;
    }

    const accessor = this.getAccessor(gltf, mesh, name);
    const bufferData = this.readBufferFromFile(gltf, buffers, accessor);

    return bufferData;
  };

  private readBufferFromFile (gltf: gltf.GlTf, buffers: ArrayBuffer[], accessor: gltf.Accessor) {
    type accessorType = {
      [key: string]: number;
    };
    const accessorSizes : accessorType= {
      'SCALAR': 1,
      'VEC2': 2,
      'VEC3': 3,
      'VEC4': 4,
      'MAT2': 4,
      'MAT3': 9,
      'MAT4': 16
    };

    const bufferView = gltf.bufferViews![accessor.bufferView as number];
    const size = accessorSizes[accessor.type];
    const componentType = accessor.componentType as BufferType;
    const type = accessor.type;

    const data = componentType == BufferType.Float
        ? new Float32Array(buffers[bufferView.buffer], (accessor.byteOffset || 0) + (bufferView.byteOffset || 0), accessor.count * size)
        : new Int16Array(buffers[bufferView.buffer], (accessor.byteOffset || 0) + (bufferView.byteOffset || 0), accessor.count * size);

    return {
        size,
        data,
        type,
        componentType,
    } as Buffer;
  }

  private getAccessor (gltf: gltf.GlTf, mesh: gltf.Mesh, attributeName: string) {
    const attribute = mesh.primitives[0].attributes[attributeName];
    return gltf.accessors![attribute];
  };

};

export default GltfLoader;