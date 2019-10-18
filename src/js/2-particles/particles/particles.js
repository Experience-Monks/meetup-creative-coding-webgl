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
import { vertexShader, fragmentShader } from './shader.glsl';

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
      vertexShader,
      fragmentShader
    });

    gui.add(material.uniforms.lightDirection.value, 'x', -1, 1).name('light x');
    gui.add(material.uniforms.lightDirection.value, 'y', -1, 1).name('light y');
    gui.add(material.uniforms.lightDirection.value, 'z', -1, 1).name('light z');

    this.mesh = new Points(geometry, material);
  }
}
