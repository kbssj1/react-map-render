import WebGL from "./webgl";

/**
 * An individual WebGL shader.
 */
class Shader {
  private shader: WebGLShader | null;

  /**
   * Creates and initialises a WebGL shader.
   * 
   * @param type The type of the shader (vertex or fragment).
   * @param source The source code of the shader.
   */
  constructor(gl: WebGL2RenderingContext, type: number, source: string) {
    this.shader = this.createShader(gl, type, source);
  }

  /**
   * Gets a handle to the underlying `WebGLShader` object, if it exists.
   * 
   * @returns The WebGL shader handle.
   */
  public getHandle(): WebGLShader | null {
    return this.shader;
  }

  /**
   * Creates a new WebGL shader.
   * 
   * @param type The type of the shader (vertex or fragment).
   * @param source The source code of the shader.
   * @returns A handle to the WebGL shader, or `null` if the shader could not be created.
   */
  private createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    
    let shader = gl.createShader(type);
    if (shader === null) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    
    return null;
  }
}

export default Shader;