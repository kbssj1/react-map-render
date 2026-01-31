#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_emissiveImage;
// directionalLighting
uniform vec3 u_direct_light_direction;
uniform vec3 u_direct_light_color;

uniform bool u_useBaseTexture;
uniform bool u_useEmissiveTexture;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;
in vec4 v_color;
in vec3 v_normal;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec3 baseColor = v_color.rgb;
  if (u_useBaseTexture) {
    baseColor = texture(u_image, v_texCoord).rgb;
  }

  vec3 emissive = vec3(0.0);
  if (u_useEmissiveTexture) {
    emissive = texture(u_emissiveImage, v_texCoord).rgb;
  }

  vec3 N = normalize(v_normal);
  vec3 L = normalize(u_direct_light_direction);

  float diff = max(dot(N, L), 0.0);
  vec3 diffuse = diff * baseColor * u_direct_light_color;

  float ambient = 0.25; // 0.15~0.35 사이 추천
  vec3 finalColor = baseColor * ambient + diffuse + emissive;
  outColor = vec4(finalColor, 1.0);
}