import Shader from "./shader";

/**
 * A WebGL shader program, consisting of a vertex shader and a fragment shader.
 */
class ShaderProgram {
  private vertexShader: Shader;
  private fragmentShader: Shader;
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;

  /**
   * Creates and initialises a shader program from its two constituent shaders.
   * 
   * @param vertexShader The vertex shader.
   * @param fragmentShader The fragment shader.
   */
  constructor(gl: WebGL2RenderingContext, vertexShader: Shader, fragmentShader: Shader) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = this.createProgram();
  }

  /**
   * Creates and initialises the underlying `WebGLProgram` using the previously configured vertex and fragment shaders.
   * 
   * @returns A handle to the WebGL program, or `null` if the program could not be created.
   */
  private createProgram(): WebGLProgram | null {
    let program = this.gl.createProgram();
    if (program === null) return null;
    if (this.vertexShader.getHandle() && this.fragmentShader.getHandle())
    {
      this.gl.attachShader(program, this.vertexShader.getHandle());
      this.gl.attachShader(program, this.fragmentShader.getHandle());
    }
    this.gl.linkProgram(program);

    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) return program;

    console.error(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
    return null;
  }

  /**
   * Gets a handle to the underlying WebGL program.
   * 
   * @returns A handle to the program.
   */
  public getHandle(): WebGLProgram {
    return this.program;
  }
}

export default ShaderProgram;