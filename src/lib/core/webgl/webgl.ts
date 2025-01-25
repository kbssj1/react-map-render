import Shader from "./shader/shader";
import ShaderProgram from "./shader/shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";
import webglUtils from "./utils";

/**
 * The main WebGL class.
 */
class WebGL {
  private canvas: HTMLCanvasElement;
  private static ctx: WebGL2RenderingContext;
  private static frame: number;
  private lastFrameTimestamp: number;
  private shaderProgram: ShaderProgram;

  public constructor(canvas: HTMLCanvasElement) {
    WebGL.ctx = canvas.getContext("webgl2")!;
    this.canvas = canvas;
    
    /*
    WebGL.frame = 0;

    this.lastFrameTimestamp = performance.now();

    WebGL.ctx.enable(WebGL.ctx.CULL_FACE);
    WebGL.ctx.cullFace(WebGL.ctx.BACK);
    WebGL.ctx.enable(WebGL.ctx.DEPTH_TEST);

    // fix texture orientation
    // https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/
    WebGL.ctx.pixelStorei(WebGL.ctx.UNPACK_FLIP_Y_WEBGL, true);
    */
    let vertexShader = new Shader(WebGL.ctx.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = new Shader(WebGL.ctx.FRAGMENT_SHADER, FRAGMENT_SHADER);
    this.shaderProgram = new ShaderProgram(vertexShader, fragmentShader);

    // Test
    // look up where the vertex data needs to go.
    if (this.shaderProgram.getHandle())
    {
      var positionAttributeLocation = WebGL.gl.getAttribLocation(this.shaderProgram.getHandle(), "a_position");
      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = WebGL.gl.createBuffer();
      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      WebGL.gl.bindBuffer(WebGL.gl.ARRAY_BUFFER, positionBuffer);
      var positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
      ];
      WebGL.gl.bufferData(WebGL.gl.ARRAY_BUFFER, new Float32Array(positions), WebGL.gl.STATIC_DRAW);
      // Create a vertex array object (attribute state)
      var vao = WebGL.gl.createVertexArray();
      // and make it the one we're currently working with
      WebGL.gl.bindVertexArray(vao);
      // Turn on the attribute
      WebGL.gl.enableVertexAttribArray(positionAttributeLocation);
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 2;          // 2 components per iteration
      var type = WebGL.gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      WebGL.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
      webglUtils.resizeCanvasToDisplaySize(WebGL.gl.canvas);
      // Tell WebGL how to convert from clip space to pixels
      WebGL.gl.viewport(0, 0, WebGL.gl.canvas.width, WebGL.gl.canvas.height);
      // Clear the canvas
      WebGL.gl.clearColor(0, 0, 0, 0);
      WebGL.gl.clear(WebGL.gl.COLOR_BUFFER_BIT);
      // Tell it to use our program (pair of shaders)
      WebGL.gl.useProgram(this.shaderProgram.getHandle());
      // Bind the attribute/buffer set we want.
      WebGL.gl.bindVertexArray(vao);
      // draw
      var primitiveType = WebGL.gl.TRIANGLES;
      var offset = 0;
      var count = 3;
      WebGL.gl.drawArrays(primitiveType, offset, count);
    }

    // this.update = this.update.bind(this);
  }

  /**
   * Starts the main loop, initialising components then rendering frames.
   */
  public WebGl() {
    this.lastFrameTimestamp = performance.now();
    window.requestAnimationFrame(this.update);
  }

  /**
   * One frame of the main loop, updating components and input.
   * 
   * @param elapsed The time elapsed since the program started.
   */
  private update(elapsed: number) {
    let deltaTime = (elapsed - this.lastFrameTimestamp) / 1000;
    this.lastFrameTimestamp = elapsed;
    this.render();
    WebGL.frame++;
    window.requestAnimationFrame(this.update);
  }

  /**
   * Renders the scene.
   */
  private render() {
    WebGL.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    WebGL.ctx.clear(WebGL.ctx.COLOR_BUFFER_BIT | WebGL.ctx.DEPTH_BUFFER_BIT);
  }

  public static get gl(): WebGL2RenderingContext {
    if (WebGL.ctx === null) {
      throw new Error("Error");
    }

    return WebGL.ctx;
  }

  public static get currentFrame(): number {
    return WebGL.frame;
  }
}

export default WebGL;