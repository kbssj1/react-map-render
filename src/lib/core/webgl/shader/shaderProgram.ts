import Shader from "./shader";
import WebGL from "../webgl";

/**
 * A WebGL shader program, consisting of a vertex shader and a fragment shader.
 */
class ShaderProgram {
  private vertexShader: Shader;
  private fragmentShader: Shader;
  private program: WebGLProgram | null;

  /**
   * Creates and initialises a shader program from its two constituent shaders.
   * 
   * @param vertexShader The vertex shader.
   * @param fragmentShader The fragment shader.
   */
  constructor(vertexShader: Shader, fragmentShader: Shader) {
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
    let program = WebGL.gl.createProgram();
    if (program === null) return null;

    WebGL.gl.attachShader(program, this.vertexShader.getHandle()!);
    WebGL.gl.attachShader(program, this.fragmentShader.getHandle()!);
    WebGL.gl.linkProgram(program);

    let success = WebGL.gl.getProgramParameter(program, WebGL.gl.LINK_STATUS);
    if (success) return program;

    console.error(WebGL.gl.getProgramInfoLog(program));
    WebGL.gl.deleteProgram(program);

    return null;
  }

  /**
   * Gets a handle to the underlying WebGL program.
   * 
   * @returns A handle to the program.
   */
  public getHandle(): WebGLProgram | null {
    return this.program;
  }
}

export default ShaderProgram;