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

  constructor(gl: WebGL2RenderingContext, arrays: AttributeInfo) {
    this.attributeInfo = arrays;
    this.gl = gl;
  }

}

export default Attribute;