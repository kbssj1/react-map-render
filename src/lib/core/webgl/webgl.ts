import Shader from "./shader";
import ShaderProgram from "./shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import { BufferAndAttribute, BufferInfo } from "./bufferAndAttribute";
import { Mat4 } from "../math/mat4";
import { Vec3 } from "../math/vec3";

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

  public constructor(canvas: HTMLCanvasElement, image:HTMLImageElement) {
    this.gl = canvas.getContext("webgl2")!;
    let gl = this.gl;
    this.canvas = canvas;
    
    let vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    let webglProgram:WebGLProgram = new ShaderProgram(this.gl, vertexShader, fragmentShader).getHandle();
    let array:Arrays = {
      position : [           
        0, 0,
        100, 0,
        0, 200,
        0, 200,
        100, 0,
        100, 200], 
      texcoords: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,1.0, 0.0, 1.0, 1.0,]};
      
    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    let ba:BufferAndAttribute = new BufferAndAttribute(this.gl, webglProgram, array, image);

    // lookup uniforms
    var imageLocation = gl.getUniformLocation(webglProgram, "u_image");
    var matrixLocation = gl.getUniformLocation(webglProgram, "u_matrix");

    this.resizeCanvasToDisplaySize(gl.canvas, 1);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(webglProgram);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    var matrix:Mat4 = new Mat4([2 / this.canvas.clientWidth, 0, 0, 0, 0, -2 / this.canvas.clientHeight, 0, 0, 0, 0, 2 / 400, 0, -1, 1, 0, 1]);
    matrix.translate(new Vec3([100, 50, 0]));
    matrix.rotate(Math.PI * 0.1, new Vec3([0, 0, 1]));

    // Pass in the canvas resolution so we can convert from
    gl.uniform1i(imageLocation, 0);
    gl.uniformMatrix4fv(matrixLocation, false, matrix.array());

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0; 
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

      /**
   * Resize a canvas to match the size its displayed.
   * @param {HTMLCanvasElement} canvas The canvas to resize.
   * @param {number} [multiplier] amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   */
    private resizeCanvasToDisplaySize(canvas:any, multiplier:number) {
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