#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
uniform bool useTexture; // 텍스처 사용 여부를 결정하는 uniform

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  if (useTexture) {
    outColor = texture(u_image, v_texCoord);
  } else {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
}