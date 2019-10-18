export const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D textureMap;
  uniform vec2 resolution;
  uniform float time;

  // Noise
  uniform float noiseSpeed;
  uniform float noiseAmount;

  float random(vec2 n, float offset) {
    return 0.5 - fract(sin(dot(n.xy + vec2(offset, 0.0), vec2(12.9898, 78.233)))* 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec4 outgoingColor = texture2D(textureMap, uv);

    // Add noise
    outgoingColor += vec4(vec3(noiseAmount * random(uv, 0.00001 * noiseSpeed * time)), 1.0);

    gl_FragColor = outgoingColor;
  }
`;
