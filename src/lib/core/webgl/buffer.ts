import { Arrays } from "./webgl";

export interface BufferInfo {
  position: WebGLBuffer
}

export class Buffer {

  private bufferInfo: BufferInfo;
  private gl:WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, arrays: Arrays, image:HTMLImageElement) {
    this.bufferInfo = arrays;
    this.gl = gl;
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.position), gl.STATIC_DRAW);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.texcoords), gl.STATIC_DRAW);
    
  }

  public getBufferInfo(): BufferInfo {
    return this.bufferInfo;
  }

}