import Shader from "./shader";
import ShaderProgram from "./shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import { BufferAndAttribute } from "./bufferAndAttribute";
import { Mat4 } from "../math/mat4";
import { Vec3 } from "../math/vec3";
import Mesh from "../mesh";
import Scene from "../scene";

export interface Arrays {
  position: number[],
  rotation: Vec3,
  indices: number[],
  texcoords: number[],
  color: number[],
  useTexture: number,
  useColor: number
}

type Nullable<T> = T | null;
export interface BufferInfo {
  positionBuffer: Nullable<WebGLBuffer>,
  indexBuffer: Nullable<WebGLBuffer>
}

class ToDrawObject {
  public array:Arrays;
  public matrix:Mat4;
  public program:WebGLProgram
  public vertexArray:WebGLVertexArrayObject
  public bufferInfo:BufferInfo

  constructor(array: Arrays, program: WebGLProgram, vertexArray:WebGLVertexArrayObject, bufferInfo: BufferInfo) {
    this.array = array;
    this.program = program;
    this.vertexArray = vertexArray;
    this.matrix = new Mat4();
    this.bufferInfo = bufferInfo;
  }
}

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private toDrawObjects:ToDrawObject[] = [];

  public constructor(canvas: HTMLCanvasElement, scene:Scene) {
    this.gl = canvas.getContext("webgl2")!;
    let gl = this.gl;
    this.canvas = canvas;
    //
    this.toDrawObjects = [];
    for (let i=0;i<scene.getObjectLength();++i) {
      let mesh = (scene.getObject(i) as Mesh);
      let array:Arrays = {
        position : mesh.arrayPositions, 
        rotation : mesh.rotation,
        indices: mesh.getIndices(),
        texcoords: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,1.0, 0.0, 1.0, 1.0,],
        color: [],
        useTexture: 0,
        useColor: 0
      };
      let webglProgram:WebGLProgram = this.createProgram();
      // let ba:BufferAndAttribute = new BufferAndAttribute(this.gl, webglProgram, array);
      let vao = gl.createVertexArray();  
      if (vao) {
        let bufferInfo = this.createBufferInfoFromArrays(array);
        this.toDrawObjects.push(new ToDrawObject(array, webglProgram, vao, bufferInfo));
      }
    }
    
    /*
    const objs = this.toDrawObjects;
    for (let i=0;i<objs.length;++i) {
    }
    */ 
    // 
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

  private createBufferInfoFromArrays(array:Arrays) : BufferInfo {
    let gl = this.gl;
    let positionBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();
    let bufferInfo:BufferInfo = {
      positionBuffer : positionBuffer,
      indexBuffer : indexBuffer
    };
    
    return bufferInfo;
  }

  private setBuffersAndAttributes(array:Arrays, bufferInfo: BufferInfo, program: WebGLProgram) {
    let gl = this.gl;
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array.position), gl.STATIC_DRAW);
    if (array.indices.length > 0) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indexBuffer);
      const indices = array.indices;
      gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
      );
    }

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }

  public draw(scene:Scene) {
    const gl = this.gl;
    const objs = this.toDrawObjects;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    this.resizeCanvasToDisplaySize(gl.canvas, 1);

    for (let i=0;i<objs.length;++i) {
      gl.useProgram(objs[i].program);
      gl.bindVertexArray(objs[i].vertexArray);
      this.setBuffersAndAttributes(objs[i].array, objs[i].bufferInfo, objs[i].program);

      // lookup uniforms
      const imageLocation = gl.getUniformLocation(objs[i].program, "u_image");
      const matrixLocation = gl.getUniformLocation(objs[i].program, "u_matrix");
      const useTextureLocation = gl.getUniformLocation(objs[i].program, "useTexture");
      const useColorLocation = gl.getUniformLocation(objs[i].program, "useColor");
      //
      var matrix:Mat4 = new Mat4([1, 0, 0, 0, 
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0 ,0, 0, 1]);
      matrix = matrix.perspective(60 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000);
      matrix.translate(new Vec3([0, 0, -360]));
      matrix.scale(new Vec3([5, 5, 5]));
      matrix.rotate(40 * (Math.PI / 180), new Vec3([1, 0, 0]));

      // uniform
      gl.uniform1i(imageLocation, 0);
      gl.uniformMatrix4fv(matrixLocation, false, matrix.array());
      gl.uniform1i(useTextureLocation, objs[i].array.useTexture); // 텍스처를 사용하지 않고 단색 출력
      gl.uniform1i(useColorLocation, objs[i].array.useColor);
  
      // Draw the rectangle.
      var primitiveType = gl.TRIANGLES;
      var offset = 0; 
      var count = objs[i].array.position.length / 3;

      if (objs[i].array.indices.length > 0) {
        gl.drawElements(primitiveType, objs[i].array.indices.length, gl.UNSIGNED_SHORT, offset);
      } else {
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  }
}   

export default WebGLRenderer;