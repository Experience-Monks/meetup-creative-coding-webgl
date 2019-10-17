import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  ShaderMaterial,
  WebGLRenderTarget,
  Vector2,
  LinearFilter,
  NearestFilter,
  RGBFormat,
  Scene,
  OrthographicCamera
} from 'three';
import { gui } from '../gui';

// https://github.com/mikolalysenko/a-big-triangle

export default class PostProcessing {
  constructor(renderer, width, height) {
    this.renderer = renderer;

    const pixelRatio = renderer.getPixelRatio();

    const geometry = new BufferGeometry();
    const attribute = new BufferAttribute(
      new Float32Array([-1, -1, 0, -1, 4, 0, 4, -1, 0]),
      3
    );
    geometry.addAttribute('position', attribute);
    geometry.setIndex([0, 2, 1]);

    this.renderTarget = new WebGLRenderTarget(
      width * pixelRatio,
      height * pixelRatio,
      {
        minFilter: LinearFilter,
        magFilter: NearestFilter,
        format: RGBFormat,
        stencilBuffer: false
      }
    );

    const material = new ShaderMaterial({
      uniforms: {
        textureMap: {
          type: 't',
          value: this.renderTarget.texture
        },
        resolution: {
          value: new Vector2(this.renderTarget.width, this.renderTarget.height)
        },
        time: {
          value: 0
        },
        noiseSpeed: { value: 0.18 },
        noiseAmount: { value: 0.1 }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
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
      `
    });

    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.mesh = new Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    this.scene.add(this.mesh);

    gui
      .add(this.mesh.material.uniforms.noiseAmount, 'value', 0, 1)
      .name('noiseAmount');
    gui
      .add(this.mesh.material.uniforms.noiseSpeed, 'value', 0, 1)
      .name('noiseSpeed');
  }

  resize(width, height) {
    const pixelRatio = this.renderer.getPixelRatio();
    this.renderTarget.setSize(width * pixelRatio, height * pixelRatio);
    this.mesh.material.uniforms.resolution.value.x = width * pixelRatio;
    this.mesh.material.uniforms.resolution.value.y = height * pixelRatio;
  }

  render(scene, camera, delta) {
    this.mesh.material.uniforms.time.value += delta;
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }
}
