import { Arrays } from "./webgl";

export interface AttributeInfo {
  position: number[]
}

export class Attribute {

  private attributeInfo: AttributeInfo;
  private gl:WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, program:WebGLProgram, arrays: Arrays) {
    this.gl = gl;

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }

}