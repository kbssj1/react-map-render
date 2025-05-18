#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
uniform bool useTexture; // 텍스처 사용 여부를 결정하는 uniform
uniform bool useColor; 

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = clamp(texture(u_image, v_texCoord) * v_color, 0.0, 1.0);
}