interface AttributeInfo {
  attribs: {
    position: { buffer: null, },
    texcoord: { numComponents: 2, buffer: null, },
    normal: { numComponents: 3, buffer: null, },
  },
}

class Attribute {

  private attributeInfo: AttributeInfo;
  private gl:WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, program:WebGLProgram, arrays: AttributeInfo) {
    this.attributeInfo = arrays;
    this.gl = gl;

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
  }

}

export default Attribute;