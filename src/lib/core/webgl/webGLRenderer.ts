import Shader from "./shader";
import ShaderProgram from "./shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import { BufferAndAttribute, BufferInfo } from "./bufferAndAttribute";
import { Mat4 } from "../math/mat4";
import { Vec3 } from "../math/vec3";
import Mesh from "../mesh";
import Scene from "../scene";

export interface Arrays {
  position: number[],
  texcoords: number[],
  color: number[],
  useTexture: number,
  useColor: number
}

class ToDrawObject {
  public array:Arrays;
  public matrix:Mat4;
  public program:WebGLProgram

  constructor(array: Arrays, program: WebGLProgram) {
    this.array = array;
    this.program = program;
    this.matrix = new Mat4();
  }
}

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  public constructor(canvas: HTMLCanvasElement, scene:Scene) {
    this.gl = canvas.getContext("webgl2")!;
    let gl = this.gl;
    this.canvas = canvas;

    let mesh = (scene.getObject(0) as Mesh);
    let array:Arrays = {
      position : mesh.arrayPositions, 
      texcoords: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,1.0, 0.0, 1.0, 1.0,],
      color: [],
      useTexture: 0,
      useColor: 0
    };
    let webglProgram:WebGLProgram = this.createProgram();
      
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let ba:BufferAndAttribute = new BufferAndAttribute(this.gl, webglProgram, array);

    // lookup uniforms
    const imageLocation = gl.getUniformLocation(webglProgram, "u_image");
    const matrixLocation = gl.getUniformLocation(webglProgram, "u_matrix");
    const useTextureLocation = gl.getUniformLocation(webglProgram, "useTexture");
    const useColorLocation = gl.getUniformLocation(webglProgram, "useColor");

    this.resizeCanvasToDisplaySize(gl.canvas, 1);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(webglProgram);
    //
    var matrix:Mat4 = new Mat4([1, 0, 0, 0, 
                                0, 1, 0, 0,
                                0, 0, 1, 0,
                                0 ,0, 0, 1]);
    matrix = matrix.perspective(60 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000);
    matrix.translate(new Vec3([0, 0, -360]));
    matrix.scale(new Vec3([1, 1, 1]));
    // matrix.rotate(185 * Math.PI / 180, new Vec3([1, 0, 0]));

    // uniform
    gl.uniform1i(imageLocation, 0);
    gl.uniformMatrix4fv(matrixLocation, false, matrix.array());
    gl.uniform1i(useTextureLocation, array.useTexture); // 텍스처를 사용하지 않고 단색 출력
    gl.uniform1i(useColorLocation, array.useColor);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0; 
    var count = array.position.length / 3;
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

  private createProgram() : WebGLProgram{
    let vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    let webglProgram:WebGLProgram = new ShaderProgram(this.gl, vertexShader, fragmentShader).getHandle();

    return webglProgram;
  }
}   

export default WebGLRenderer;