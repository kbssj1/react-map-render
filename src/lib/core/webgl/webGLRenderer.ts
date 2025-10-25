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
    this.camera = new Camera(new Vec3([0, 10, 0]), "camera");
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
      } else if (scene.getObject(i) instanceof DirectionalLighting) {
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
      // this.camera.localPosition.x += position.x;
      // this.camera.localPosition.y += position.y;
      // this.camera.localPosition.z += position.z;
    };

    const zoom = (delta: number) => {
      this.camera.cameraDistance += delta;
      if (this.camera.cameraDistance < 0.0) this.camera.cameraDistance = 0.0;
    };

    const rotate = (dx:number, dy: number) => {
      // this.camera.localRotation.x += (dx/100);
      // this.camera.localRotation.y += (dy/100);
      this.camera.yaw   -= (dx/100);
      this.camera.pitch += (dy/100);
    } 

    this.inputs.listen(zoom, move, rotate);
  }

  private setUniforms(object:ToDrawObject, modelMatrix:Mat4, mvp:Mat4) {
    const gl = this.gl;
    // lookup uniforms
    const mvpMatrixLocation = gl.getUniformLocation(object.program, "u_mvp");
    const modelMatrixLocation = gl.getUniformLocation(object.program, "u_modelMatrix");
    const directionLightingColor = gl.getUniformLocation(object.program, "u_direct_light_color");
    const directionLightingDirection = gl.getUniformLocation(object.program, "u_direct_light_direction");
    const u_image0Location = gl.getUniformLocation(object.program, "u_image");
    const u_image0Location2 = gl.getUniformLocation(object.program, "u_emissiveImage");

    // uniform
    gl.uniformMatrix4fv(mvpMatrixLocation, false, mvp.array());
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.array());
    gl.uniform3fv(directionLightingColor, this.environment.directionalLighting.color.xyz);
    gl.uniform3fv(directionLightingDirection, this.environment.directionalLighting.direction.xyz);
    gl.uniform1i(u_image0Location, 0);
    gl.uniform1i(u_image0Location2, 1);
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

    // view Matrix
    this.camera.pitch = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, this.camera.pitch));
    let radius = this.camera.cameraDistance;
    let eye = new Vec3([
      this.camera.localPosition.x + radius * Math.cos(this.camera.pitch) * Math.sin(this.camera.yaw),
      this.camera.localPosition.y + radius * Math.sin(this.camera.pitch),
      this.camera.localPosition.z + radius * Math.cos(this.camera.pitch) * Math.cos(this.camera.yaw)
    ]);
    let up = new Vec3([0, 1, 0]);
    let viewMatrix = Mat4.lookAt(eye, new Vec3([0, 0, 0]), up);

    // projectionMatrix
    let projectionMatrix:Mat4 = new Mat4().setIdentity();
    projectionMatrix = projectionMatrix.perspective(60 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 2000);

    for (let i=0;i<objs.length;++i) {
      gl.useProgram(objs[i].program);
      gl.bindVertexArray(objs[i].vertexArray);
      this.buffersAndAttributes.setBuffersAndAttributes(gl, objs[i].object, objs[i].bufferInfo, objs[i].program);

      // Model matrix
      let modelMatrix = new Mat4().setIdentity();
      if (objs[i].object.dirtyFlag) {
        modelMatrix.translate(objs[i].object.localPosition);
        modelMatrix.scale(objs[i].object.scale);
        // modelMatrix.rotate(-90 * Math.PI / 180, objs[i].object.localRotation);
        objs[i].object.dirtyFlag = false;
      }
      // mvp
      let mv = viewMatrix.multiply(modelMatrix);
      let mvp = projectionMatrix.multiply(mv);

      //
      this.setUniforms(objs[i], modelMatrix, mvp);

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