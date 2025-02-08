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
  private static ctx: WebGL2RenderingContext;
  private shaderProgram: ShaderProgram;

  public constructor(canvas: HTMLCanvasElement, image:HTMLImageElement) {


    WebGL.ctx = canvas.getContext("webgl2")!;
    this.canvas = canvas;
    
    let vertexShader = new Shader(WebGL.ctx.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = new Shader(WebGL.ctx.FRAGMENT_SHADER, FRAGMENT_SHADER);
    this.shaderProgram = new ShaderProgram(vertexShader, fragmentShader);
    let program:WebGLProgram = this.shaderProgram.getHandle();
    // Test
    // look up where the vertex data needs to go.
    if (program)
    {
      let array:Arrays = {
        position : [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30], 
        texcoords: [0.0 , 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,1.0, 0.0, 1.0, 1.0,]};
      let buffer:Buffer = new Buffer(WebGL.ctx, array, image);
      let attribute:Attribute = new Attribute(WebGL.ctx, program, array);

      this.resizeCanvasToDisplaySize(canvas, 1);
      // Tell WebGL how to convert from clip space to pixels
      WebGL.gl.viewport(0, 0, WebGL.gl.canvas.width, WebGL.gl.canvas.height);
      // Clear the canvas
      WebGL.gl.clearColor(0, 0, 0, 0);
      WebGL.gl.clear(WebGL.gl.COLOR_BUFFER_BIT);
      // Tell it to use our program (pair of shaders)
      WebGL.gl.useProgram(this.shaderProgram.getHandle());
      // draw
      var primitiveType = WebGL.gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      WebGL.gl.drawArrays(primitiveType, offset, count);
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

  public static get gl(): WebGL2RenderingContext {
    if (WebGL.ctx === null) {
      throw new Error("Error");
    }

    return WebGL.ctx;
  }
}

export default WebGL;