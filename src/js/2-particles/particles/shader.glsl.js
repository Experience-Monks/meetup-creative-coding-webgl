export const vertexShader = `
  attribute float size;
  uniform float particleSize;
  varying vec3 vPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
    gl_PointSize = size * (particleSize / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
    vPosition = position;
  }
`;

export const fragmentShader = `
  uniform vec3 lightDirection;
  uniform sampler2D normalMap;
  varying vec3 vPosition;

  float circle(vec2 uv, vec2 pos, float rad) {
    float d = length(pos - uv) - rad;
    return step(d, 0.0);
  }

  void main() {
    float c = circle(vec2(0.5), gl_PointCoord.xy, 0.5);
    if (c == 0.0) discard;

    vec4 outgoingColor = vec4(1.0);

    vec3 normal = texture2D(normalMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)).rgb * 2.0 - 1.0;
    vec3 normal2 = normalize(vPosition);

    float intensity = max(0.2, dot(normal, lightDirection) * 0.5 + 0.5);
    float intensty2 = max(0.5, dot(normal2, lightDirection) * 0.5 + 0.5);

    vec3 color = vec3(normal2 * 0.5 + 0.5);

    color *= intensity;
    color *= intensty2;

    outgoingColor = vec4(color, 1.0);

    gl_FragColor = outgoingColor;
  }
`;
