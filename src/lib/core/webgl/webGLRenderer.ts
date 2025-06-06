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

export interface Arrays {
  position: number[],
  normal:number[],
  rotation: Vec3,
  indices: number[],
  texcoords: number[],
  color: Nullable<Vec3>,
  image: HTMLImageElement
}

type Nullable<T> = T | null;
export interface BufferInfo {
  positionBuffer: Nullable<WebGLBuffer>,
  indexBuffer: Nullable<WebGLBuffer>,
  colorBuffer: Nullable<WebGLBuffer>,
  normalBuffer: Nullable<WebGLBuffer>,
  texCoordBuffer: Nullable<WebGLBuffer>
}

class ToDrawObject {
  public array:Arrays
  public localPosition:Vec3
  public program:WebGLProgram
  public vertexArray:WebGLVertexArrayObject
  public bufferInfo:BufferInfo

  constructor(array: Arrays, localPosition: Vec3, program: WebGLProgram, vertexArray:WebGLVertexArrayObject, bufferInfo: BufferInfo) {
    this.array = array;
    this.localPosition = localPosition;
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

  public constructor(canvas: HTMLCanvasElement, scene:Scene) {
    this.gl = canvas.getContext("webgl2")!;
    let gl = this.gl;
    this.canvas = canvas;
    //
    this.toDrawObjects = [];
    this.camera = new Camera(new Vec3([0, 0, 0]), "camera");
    this.inputs = new Inputs(this.canvas);
    this.createInputs();
    let directionalLighting:DirectionalLighting = new DirectionalLighting(new Vec3([0,0,0]), new Vec3([0, 0, 0]));
    
    for (let i=0;i<scene.getObjectLength();++i) {
      if (scene.getObject(i) instanceof Object) {
        let object = (scene.getObject(i) as Object);
        let array:Arrays = {
          position : object.mesh.arrayPositions,
          normal: object.mesh.arrayNormal,
          rotation : object.mesh.localRotation,
          indices: object.mesh.indices,
          texcoords: object.material.texCoord,
          color: object.material.color,
          image: object.material.image
        };
        let webglProgram:WebGLProgram = this.createProgram();
        let vao = gl.createVertexArray();  
        if (vao) {
          let bufferInfo = this.createBufferInfoFromArrays(array);
          this.toDrawObjects.push(new ToDrawObject(array, object.localPosition, webglProgram, vao, bufferInfo));
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

  private createBufferInfoFromArrays(array:Arrays) : BufferInfo {
    let gl = this.gl;
    let positionBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();
    let texCoordBuffer = gl.createBuffer();
    let normalBuffer = gl.createBuffer();
    let bufferInfo:BufferInfo = {
      positionBuffer : positionBuffer,
      indexBuffer : indexBuffer,
      colorBuffer : colorBuffer,
      texCoordBuffer : texCoordBuffer,
      normalBuffer: normalBuffer
    };
    
    return bufferInfo;
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

  private setBuffersAndAttributes(array:Arrays, bufferInfo: BufferInfo, program: WebGLProgram) {
    let gl = this.gl;
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

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
    var size = 3;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;       
    var offset = 0;        
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    if (array.texcoords.length > 0)
    {
      let texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array.texcoords), gl.STATIC_DRAW);

      gl.enableVertexAttribArray(texCoordAttributeLocation);

      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);
  
      // Create a texture.
      var texture = gl.createTexture();
  
      // make unit 0 the active texture uint
      // (ie, the unit all other texture commands will affect
      gl.activeTexture(gl.TEXTURE0 + 0);
  
      // Bind it to texture unit 0' 2D bind point
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
      // Set the parameters so we don't need mips and so we're not filtering
      // and we don't repeat at the edges
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
      // Upload the image into the texture.
      var mipLevel = 0;               // the largest mip
      var internalFormat = gl.RGBA;   // format we want in the texture
      var srcFormat = gl.RGBA;        // format of data we are supplying
      var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
      
      gl.texImage2D(gl.TEXTURE_2D,
                    mipLevel,
                    internalFormat,
                    srcFormat,
                    srcType,
                    array.image);
    }

    if (array.color) 
    {
      let colorArray:number[] = [];
      for (let i=0;i<array.position.length/3;++i) {
        colorArray.push(array.color.x);
        colorArray.push(array.color.y);
        colorArray.push(array.color.z);
      }
      let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(colorAttributeLocation);

      let size = 3;    
      let type = gl.FLOAT;   
      let normalize = false; 
      let stride = 0;        
      let offset = 0;      
      gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
    }

    if (array.normal.length > 0) 
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array.normal), gl.STATIC_DRAW);
      let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  
      // Turn on the attribute
      gl.enableVertexAttribArray(normalAttributeLocation);
      var size = 3;          
      var type = gl.FLOAT;   
      var normalize = false; 
      var stride = 0;       
      var offset = 0;        
      gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset);
    }
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
      this.setBuffersAndAttributes(objs[i].array, objs[i].bufferInfo, objs[i].program);

      // lookup uniforms
      const imageLocation = gl.getUniformLocation(objs[i].program, "u_image");
      const matrixLocation = gl.getUniformLocation(objs[i].program, "u_matrix");
      const directionLightingColor = gl.getUniformLocation(objs[i].program, "u_direct_light_color");
      const directionLightingDirection = gl.getUniformLocation(objs[i].program, "u_direct_light_direction");

      //
      let projectionMatrix:Mat4 = Mat4.identity;
      projectionMatrix = projectionMatrix.perspective(60 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000);
      let cameraMatrix = Mat4.lookAt(this.camera.localPosition, objs[i].localPosition);
      let viewMatrix = cameraMatrix.inverse();
      let viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
      viewProjectionMatrix.translate(objs[i].localPosition);
      viewProjectionMatrix.scale(new Vec3([3, 3, 3]));
      viewProjectionMatrix.rotate(40 * (Math.PI / 180), new Vec3([1, 0, 0]));

      // uniform
      gl.uniform1i(imageLocation, 0);
      gl.uniformMatrix4fv(matrixLocation, false, viewProjectionMatrix.array());
      gl.uniform3fv(directionLightingColor, this.environment.directionalLighting.color.xyz);
      gl.uniform3fv(directionLightingDirection, this.environment.directionalLighting.direction.xyz);

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