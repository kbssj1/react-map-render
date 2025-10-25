#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texCoord;
in vec3 a_normal;
in vec4 a_color;

// A matrix to transform the positions by
uniform mat4 u_mvp;
uniform mat4 u_modelMatrix;

//
out vec2 v_texCoord;
out vec4 v_color;
out vec3 v_position;
out vec3 v_normal;

//
void main() {
  gl_Position = u_mvp * a_position;

  v_texCoord = a_texCoord;
  v_color = a_color;

  v_normal = mat3(transpose(inverse(u_modelMatrix))) * a_normal;
}