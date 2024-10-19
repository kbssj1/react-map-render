/**
 * The main TSGL class.
 */
class WebGl {
  private canvas: HTMLCanvasElement;
  private static ctx: WebGL2RenderingContext;
  private static frame: number;
  private lastFrameTimestamp: number;

  public constructor(canvas: HTMLCanvasElement) {
    WebGl.ctx = canvas.getContext("webgl2")!;
    WebGl.frame = 0;

    this.canvas = canvas;
    this.lastFrameTimestamp = performance.now();

    WebGl.ctx.enable(WebGl.ctx.CULL_FACE);
    WebGl.ctx.cullFace(WebGl.ctx.BACK);
    WebGl.ctx.enable(WebGl.ctx.DEPTH_TEST);

    // fix texture orientation
    // https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/
    WebGl.ctx.pixelStorei(WebGl.ctx.UNPACK_FLIP_Y_WEBGL, true);

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
    WebGl.frame++;
    window.requestAnimationFrame(this.update);
  }

  /**
   * Renders the scene.
   */
  private render() {
    WebGl.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    WebGl.ctx.clear(WebGl.ctx.COLOR_BUFFER_BIT | WebGl.ctx.DEPTH_BUFFER_BIT);
  }

  public static get gl(): WebGL2RenderingContext {
    if (WebGl.ctx === null) {
      throw new Error("Error");
    }

    return WebGl.ctx;
  }

  public static get currentFrame(): number {
    return WebGl.frame;
  }
}

export default WebGl;