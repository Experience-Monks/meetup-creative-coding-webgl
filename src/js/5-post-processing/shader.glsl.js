export const vertexShader = `
  void main() {
    // Screen space projection
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D textureMap; // Rendered scene texture
  uniform vec2 resolution; // Current resolution
  uniform float time; // Elapsed time

  // Noise
  uniform float noiseSpeed;
  uniform float noiseAmount;

  // Random noise
  float random(vec2 n, float offset) {
    return 0.5 - fract(sin(dot(n.xy + vec2(offset, 0.0), vec2(12.9898, 78.233)))* 43758.5453);
  }

  void main() {
    // Get uv based on frag coord
    vec2 uv = gl_FragCoord.xy / resolution;

    // Sample color from rendered scene texture
    vec4 outgoingColor = texture2D(textureMap, uv);

    // Add noise
    outgoingColor += vec4(vec3(noiseAmount * random(uv, 0.00001 * noiseSpeed * time)), 1.0);

    // Output final color
    gl_FragColor = outgoingColor;
  }
`;
