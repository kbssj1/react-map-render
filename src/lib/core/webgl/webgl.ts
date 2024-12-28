import Shader from "./shader/shader";
import ShaderProgram from "./shader/shaderProgram";
import VERTEX_SHADER from "./shader/vertex.glsl";
import FRAGMENT_SHADER from "./shader/fragment.glsl";

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
    WebGL.frame = 0;

    this.canvas = canvas;
    this.lastFrameTimestamp = performance.now();

    WebGL.ctx.enable(WebGL.ctx.CULL_FACE);
    WebGL.ctx.cullFace(WebGL.ctx.BACK);
    WebGL.ctx.enable(WebGL.ctx.DEPTH_TEST);

    // fix texture orientation
    // https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/
    WebGL.ctx.pixelStorei(WebGL.ctx.UNPACK_FLIP_Y_WEBGL, true);

    let vertexShader = new Shader(0, VERTEX_SHADER);
    let fragmentShader = new Shader(1, FRAGMENT_SHADER);
    this.shaderProgram = new ShaderProgram(vertexShader, fragmentShader);

    this.update = this.update.bind(this);
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