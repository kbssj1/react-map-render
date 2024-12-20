import WebGL from "../webgl";

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
  constructor(type: number, source: string) {
    this.shader = this.createShader(type, source);
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
  private createShader(type: number, source: string): WebGLShader | null {
    
    let shader = WebGL.gl.createShader(type);
    if (shader === null) return null;
    WebGL.gl.shaderSource(shader, source);
    WebGL.gl.compileShader(shader);

    let success = WebGL.gl.getShaderParameter(shader, WebGL.gl.COMPILE_STATUS);
    if (success) return shader;

    console.error(WebGL.gl.getShaderInfoLog(shader));
    WebGL.gl.deleteShader(shader);
    
    return null;
  }
}

export default Shader;