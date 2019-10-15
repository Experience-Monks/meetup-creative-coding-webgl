import {
  Scene,
  Mesh,
  SphereBufferGeometry,
  ShaderMaterial,
  PerspectiveCamera,
  RGBAFormat,
  RepeatWrapping,
  Vector3,
  WebGLRenderTarget
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createCanvas } from '../../utils';

const TEXTURE_SIZE = 128;
const DEBUG_CANVAS = true;

export default class ParticlesNormal {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, 1, 0.01, 100);
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(new Vector3());
    this.renderTarget = new WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE, {
      format: RGBAFormat,
      stencilBuffer: false
    });
    this.renderTarget.texture.wrapS = RepeatWrapping;
    this.renderTarget.texture.wrapT = RepeatWrapping;
    this.needsUpdate = true;

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    this.mesh = new Mesh(
      new SphereBufferGeometry(1, 32, 32),
      new ShaderMaterial({
        vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
          }
        `
      })
    );
    this.scene.add(this.mesh);

    const { canvas, ctx } = createCanvas(TEXTURE_SIZE, TEXTURE_SIZE);
    const { canvas: canvasFlipped, ctx: ctxFlipped } = createCanvas(
      TEXTURE_SIZE,
      TEXTURE_SIZE
    );
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasFlipped = canvasFlipped;
    this.ctxFlipped = ctxFlipped;

    this.pixelBuffer = new Uint8Array(
      this.renderTarget.width * this.renderTarget.height * 4
    );
    this.imageData = this.ctxFlipped.createImageData(
      this.canvas.width,
      this.canvas.height
    );

    Object.assign(canvas.style, {
      top: '0px',
      left: '80px',
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
      width: `${TEXTURE_SIZE / 2}px`,
      height: `${TEXTURE_SIZE / 2}px`
    });

    Object.assign(canvasFlipped.style, {
      top: '0px',
      left: `${80 + TEXTURE_SIZE / 2}px`,
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
      width: `${TEXTURE_SIZE / 2}px`,
      height: `${TEXTURE_SIZE / 2}px`
    });

    if (DEBUG_CANVAS) {
      document.body.appendChild(canvas);
      document.body.appendChild(canvasFlipped);
    }
  }

  render(camera) {
    // if (this.needsUpdate) {
    this.renderer.setRenderTarget(this.renderTarget);
    this.camera.rotation.copy(camera);
    this.renderer.render(this.scene, this.camera);

    if (DEBUG_CANVAS) {
      this.renderer.readRenderTargetPixels(
        this.renderTarget,
        0,
        0,
        this.renderTarget.width,
        this.renderTarget.height,
        this.pixelBuffer
      );
      this.imageData.data.set(this.pixelBuffer);
      this.ctxFlipped.putImageData(this.imageData, 0, 0);
      this.ctx.save();
      this.ctx.scale(1, -1);
      this.ctx.drawImage(
        this.canvasFlipped,
        0,
        -this.canvas.height,
        this.canvas.width,
        this.canvas.height
      );
      this.ctx.restore();
    }
    this.renderer.setRenderTarget(null);
    // }
    this.needsUpdate = false;
  }
}
