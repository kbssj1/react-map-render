import Object from "../object";
import { BufferInfo } from "./webGLRenderer";

class BuffersAndAttributes {

  public createBufferInfoFromArrays(gl: WebGL2RenderingContext) : BufferInfo {
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

  public setBuffersAndAttributes(gl: WebGL2RenderingContext, object:Object, bufferInfo: BufferInfo, program: WebGLProgram) {
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.mesh.arrayPositions), gl.STATIC_DRAW);
    if (object.mesh.indices.length > 0) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indexBuffer);
      const indices = object.mesh.indices;
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

    if (object.material.texCoord.length > 0)
    {
      let texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.material.texCoord), gl.STATIC_DRAW);

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
                    object.material.image);
    }

    if (object.material.texCoord.length > 0 && object.material.emissiveImage) {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + 1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object.material.emissiveImage);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    if (object.mesh.normal.length > 0) 
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.mesh.arrayNormal), gl.STATIC_DRAW);
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
}
  
export default BuffersAndAttributes;