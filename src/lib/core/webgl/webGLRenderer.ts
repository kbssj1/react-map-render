import Shader from "./shader";
import ShaderProgram from "./shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import { Mat4 } from "../math/mat4";
import { Vec3 } from "../math/vec3";
import Object from "../object";
import Scene from "../scene";
import Camera from "../camera";
import Inputs from "../inputs";
import DirectionalLighting from "../directionalLighting";
import Environment from "../environment";
import BuffersAndAttributes from "./BuffersAndAttributes";

type Nullable<T> = T | null;
export interface BufferInfo {
  positionBuffer: Nullable<WebGLBuffer>,
  indexBuffer: Nullable<WebGLBuffer>,
  colorBuffer: Nullable<WebGLBuffer>,
  normalBuffer: Nullable<WebGLBuffer>,
  texCoordBuffer: Nullable<WebGLBuffer>
}

class ToDrawObject {
  public object:Object
  public program:WebGLProgram
  public vertexArray:WebGLVertexArrayObject
  public bufferInfo:BufferInfo

  constructor(object: Object, program: WebGLProgram, vertexArray:WebGLVertexArrayObject, bufferInfo: BufferInfo) {
    this.object = object;
    this.program = program;
    this.vertexArray = vertexArray;
    this.bufferInfo = bufferInfo;
  }
}

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private toDrawObjects:ToDrawObject[] = [];
  private camera:Camera;
  private inputs:Inputs;
  private environment:Environment;
  private buffersAndAttributes:BuffersAndAttributes;

  public constructor(canvas: HTMLCanvasElement, scene:Scene) {
    this.gl = canvas.getContext("webgl2")!;
    let gl = this.gl;
    this.canvas = canvas;
    //
    this.toDrawObjects = [];
    this.camera = new Camera(new Vec3([0, 0, -2]), "camera");
    this.inputs = new Inputs(this.canvas);
    this.buffersAndAttributes = new BuffersAndAttributes();
    this.createInputs();
    let directionalLighting:DirectionalLighting = new DirectionalLighting(new Vec3([0,0,0]), new Vec3([0, 0, 0]));
    
    for (let i=0;i<scene.getObjectLength();++i) {
      if (scene.getObject(i) instanceof Object) {
        let object = (scene.getObject(i) as Object);
        let webglProgram:WebGLProgram = this.createProgram();
        let vao = gl.createVertexArray();  
        if (vao) {
          let bufferInfo = this.buffersAndAttributes.createBufferInfoFromArrays(gl);
          this.toDrawObjects.push(new ToDrawObject(object, webglProgram, vao, bufferInfo));
        }
      }
      else if (scene.getObject(i) instanceof DirectionalLighting)
      {
        directionalLighting = (scene.getObject(i) as DirectionalLighting);
      }
    }
    this.environment = new Environment(directionalLighting);
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

  private createInputs() {

    const move = (position: Vec3) => {
      this.camera.localPosition.x += position.x;
      this.camera.localPosition.y += position.y;
      this.camera.localPosition.z += position.z;
      // console.log(this.camera.localRotation);
    };

    const zoom = (delta: number) => {
      this.camera.localPosition.z += delta;
      if (this.camera.localPosition.z < 0.0) this.camera.localPosition.z = 0.0;
    };

    this.inputs.listen(zoom, move);
  }

  public draw() {
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
      this.buffersAndAttributes.setBuffersAndAttributes(gl, objs[i].object, objs[i].bufferInfo, objs[i].program);

      // lookup uniforms
      const matrixLocation = gl.getUniformLocation(objs[i].program, "u_matrix");
      const directionLightingColor = gl.getUniformLocation(objs[i].program, "u_direct_light_color");
      const directionLightingDirection = gl.getUniformLocation(objs[i].program, "u_direct_light_direction");
      const u_image0Location = gl.getUniformLocation(objs[i].program, "u_image");
      const u_image0Location2 = gl.getUniformLocation(objs[i].program, "u_emissiveImage");

      //
      let projectionMatrix:Mat4 = Mat4.identity;
      projectionMatrix = projectionMatrix.perspective(60 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000);
      let cameraMatrix = Mat4.lookAt(this.camera.localPosition, objs[i].object.localPosition);
      let viewMatrix = cameraMatrix.inverse();
      let viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
      viewProjectionMatrix.translate(objs[i].object.localPosition);
      viewProjectionMatrix.scale(new Vec3([5, 5, 5]));
      viewProjectionMatrix.rotate(-90 * Math.PI / 180, objs[i].object.localRotation);

      // uniform
      gl.uniformMatrix4fv(matrixLocation, false, viewProjectionMatrix.array());
      gl.uniform3fv(directionLightingColor, this.environment.directionalLighting.color.xyz);
      gl.uniform3fv(directionLightingDirection, this.environment.directionalLighting.direction.xyz);
      gl.uniform1i(u_image0Location, 0);
      gl.uniform1i(u_image0Location2, 1);

      // Draw the rectangle.
      var primitiveType = gl.TRIANGLES;
      var offset = 0; 
      var count = objs[i].object.mesh.arrayPositions.length / 3;

      if (objs[i].object.mesh.indices.length > 0) {
        gl.drawElements(primitiveType, objs[i].object.mesh.indices.length, gl.UNSIGNED_SHORT, offset);
      } else {
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  }
}   

export default WebGLRenderer;