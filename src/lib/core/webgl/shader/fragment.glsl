#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
// directionalLighting
uniform vec3 u_direct_light_direction;
uniform vec3 u_direct_light_color;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

in vec4 v_color;

in vec3 v_normal;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  float light = dot(v_normal, u_direct_light_direction);

  outColor = mix(texture(u_image, v_texCoord), v_color, 0.5);
  
  outColor.rgb *= light;
}