import { Arrays } from "./webgl";

export interface BufferInfo {
  position: WebGLBuffer
}

export class Buffer {

  private bufferInfo: BufferInfo;
  private gl:WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, arrays: Arrays) {
    this.bufferInfo = arrays;
    this.gl = gl;
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = arrays.position;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    if (positionBuffer) {
      this.bufferInfo = {position : positionBuffer};
    }
  }

  public getBufferInfo(): BufferInfo {
    return this.bufferInfo;
  }

}