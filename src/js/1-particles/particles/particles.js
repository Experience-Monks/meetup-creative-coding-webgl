import {
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
  Points,
  Math as Math3
} from 'three';
import { spherePoint } from '../../utils';
import { gui } from '../../gui';

export default class Particles {
  constructor(totalParticles, particlesNormal, pixelRatio) {
    this.config = {
      totalParticles,
      size: {
        min: 0.1,
        max: 5
      }
    };

    this.attributes = {
      position: new BufferAttribute(
        new Float32Array(this.config.totalParticles * 3),
        3
      ),
      size: new BufferAttribute(new Float32Array(this.config.totalParticles), 1)
    };

    for (let i = 0; i < this.config.totalParticles; i++) {
      const { x, y, z } = spherePoint(
        0,
        0,
        0,
        Math.random(),
        Math.random(),
        Math3.randFloat(10, 50)
      );
      this.attributes.position.setXYZ(i, x, y, z);

      const size =
        Math3.randFloat(this.config.size.min, this.config.size.max) *
        pixelRatio;
      this.attributes.size.setX(i, size);
    }

    const geometry = new BufferGeometry();
    geometry.addAttribute('position', this.attributes.position);
    geometry.addAttribute('size', this.attributes.size);

    const material = new ShaderMaterial({
      uniforms: {
        particleSize: { value: 100 },
        lightDirection: { value: new Vector3(1, 1, 1) },
        normalMap: {
          type: 't',
          value: particlesNormal.renderTarget.texture
        }
      },
      vertexShader: `
        attribute float size;
        uniform float particleSize;
        varying vec3 vPosition;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
          gl_PointSize = size * (particleSize / length(mvPosition.xyz));
          gl_Position = projectionMatrix * mvPosition;
          vPosition = position;
        }
      `,
      fragmentShader: `
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

          vec3 normal = texture2D(normalMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)).rgb * 2.0 - 1.0;
          vec3 normal2 = normalize(vPosition);

          float intensity = max(0.2, dot(normal, lightDirection) * 0.5 + 0.5);

          float intensty2 = max(0.5, dot(normal2, lightDirection) * 0.5 + 0.5);

          vec3 color = vec3(normal2 * 0.5 + 0.5);

          color *= intensity;
          color *= intensty2;

          vec4 outgoingColor = vec4(color, 1.0);

          gl_FragColor = outgoingColor;
        }
      `
    });

    gui.add(material.uniforms.lightDirection.value, 'x', -1, 1).name('light x');
    gui.add(material.uniforms.lightDirection.value, 'y', -1, 1).name('light y');
    gui.add(material.uniforms.lightDirection.value, 'z', -1, 1).name('light z');

    this.mesh = new Points(geometry, material);
  }
}
