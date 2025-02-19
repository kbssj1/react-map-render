#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texCoord;

// Used to pass the texture coordinates to the fragment shader
out vec2 v_texCoord;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;

  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points.
  v_texCoord = a_texCoord;
}