import Shader from "./shader/shader";
import ShaderProgram from "./shader/shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import { Attribute, AttributeInfo } from "./attribute";
import { Buffer, BufferInfo } from "./buffer";

export interface Arrays {
  position: number[],
  texcoords: number[]
}

/**
 * The main WebGL class.
 */
class WebGL {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private shaderProgram: ShaderProgram;

  public constructor(canvas: HTMLCanvasElement, image:HTMLImageElement) {

    this.gl = canvas.getContext("webgl2")!;
    this.canvas = canvas;
    
    let vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    this.shaderProgram = new ShaderProgram(this.gl, vertexShader, fragmentShader);
    let program:WebGLProgram = this.shaderProgram.getHandle();
    // Test
    // look up where the vertex data needs to go.
    if (program)
    {
      var resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
      var imageLocation = this.gl.getUniformLocation(program, "u_image");

      let array:Arrays = {
        position : [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30], 
        texcoords: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,1.0, 0.0, 1.0, 1.0,]};
      let buffer:Buffer = new Buffer(this.gl, array, image);
      let attribute:Attribute = new Attribute(this.gl, program, array, image);

      this.resizeCanvasToDisplaySize(canvas, 1);

      // Tell WebGL how to convert from clip space to pixels
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      // Clear the canvas
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      // Tell it to use our program (pair of shaders)
      this.gl.useProgram(this.shaderProgram.getHandle());

      //
      // Pass in the canvas resolution so we can convert from
      // pixels to clipspace in the shader
      this.gl.uniform2f(resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
      // Tell the shader to get the texture from texture unit 0
      this.gl.uniform1i(imageLocation, 0);

      // draw
      var primitiveType = this.gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }

    /**
   * Resize a canvas to match the size its displayed.
   * @param {HTMLCanvasElement} canvas The canvas to resize.
   * @param {number} [multiplier] amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   */
  private resizeCanvasToDisplaySize(canvas:HTMLCanvasElement, multiplier:number) {
      multiplier = multiplier || 1;
      const width  = canvas.clientWidth  * multiplier | 0;
      const height = canvas.clientHeight * multiplier | 0;
      if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
      }
      return false;
    }
}

export default WebGL;