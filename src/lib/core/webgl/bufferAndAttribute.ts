import { Arrays } from "./webGLRenderer";

export interface BufferInfo {
  position: WebGLBuffer
}

export class BufferAndAttribute {

  private bufferInfo: BufferInfo;
  private gl:WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, program:WebGLProgram, arrays: Arrays) {
    this.bufferInfo = arrays;
    this.gl = gl;
    if (program !== undefined) 
    {
      // look up where the vertex data needs to go.
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
  
      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.position), gl.STATIC_DRAW);
  
      // Turn on the attribute
      gl.enableVertexAttribArray(positionAttributeLocation);
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 3;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset);
  
      var texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.texcoords), gl.STATIC_DRAW);
      
      if (arrays.useTexture == 1)
      {
        // Turn on the attribute
        gl.enableVertexAttribArray(texCoordAttributeLocation);
        // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texCoordAttributeLocation, size, type, normalize, stride, offset);
    
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
        /*
        gl.texImage2D(gl.TEXTURE_2D,
                      mipLevel,
                      internalFormat,
                      srcFormat,
                      srcType,
                      image);
        */
      }
      if (arrays.useColor == 1) 
      {
        let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(arrays.color), gl.STATIC_DRAW);
      
        // Turn on the attribute
        gl.enableVertexAttribArray(colorAttributeLocation);
      
        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        let size = 3;          // 3 components per iteration
        let type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
        let normalize = true;  // convert from 0-255 to 0.0-1.0
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            colorAttributeLocation, size, type, normalize, stride, offset);
      }
    }
  }

  public getBufferInfo(): BufferInfo {
    return this.bufferInfo;
  }

}