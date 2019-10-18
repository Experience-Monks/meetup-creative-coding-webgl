import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  GridHelper,
  AxesHelper,
  Vector3,
  Vector2,
  CameraHelper,
  Group
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { renderStats } from '../stats';
import { guiController, gui } from '../gui';
import Particles from '../2-particles/particles/particles';
import ParticlesNormal from '../2-particles/particles/particles-normal';
import graphicsMode, { GRAPHICS_HIGH } from './profiler';

// Max render buffer size
const USE_FULLSCREEN = false;
const MAX_FRAME_BUFFER_SIZE = new Vector2(1280, 720);
// Caculate square root
const BASE_SIZE = Math.sqrt(MAX_FRAME_BUFFER_SIZE.x * MAX_FRAME_BUFFER_SIZE.y);
const MAX_SIZE = BASE_SIZE * BASE_SIZE;

guiController.graphics = graphicsMode();
gui.add(guiController, 'graphics');

// Calculate the render size based on the max dimension
function calculateRendererSize(windowWidth, windowHeight) {
  let width = windowWidth;
  let height = windowHeight;
  if (USE_FULLSCREEN) {
    return {
      width,
      height
    };
  }
  if (windowWidth * windowHeight > MAX_SIZE) {
    const ratio = height / width;
    width = BASE_SIZE;
    height = Math.floor(BASE_SIZE * ratio);
    const newSize = width * height;
    const scalar = Math.sqrt(MAX_SIZE / newSize);
    width = Math.floor(width * scalar);
    height = Math.floor(height * scalar);
  }
  return {
    width,
    height
  };
}

const renderer = new WebGLRenderer({
  antialias: graphicsMode() === GRAPHICS_HIGH
});
renderer.debug.checkShaderErrors = true;

renderer.setScissorTest(true);

let renderSize = calculateRendererSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(renderSize.width, renderSize.height);
document.body.appendChild(renderer.domElement);

const cameras = {
  dev: new PerspectiveCamera(
    65,
    renderSize.width / renderSize.height,
    0.1,
    1000
  ),
  main: new PerspectiveCamera(
    65,
    renderSize.width / renderSize.height,
    0.1,
    1000
  )
};

cameras.dev.position.set(20, 10, 20);
cameras.dev.lookAt(new Vector3());

cameras.main.position.set(0, 10, 20);
cameras.main.lookAt(new Vector3());

const controls = {
  dev: new OrbitControls(cameras.dev, renderer.domElement),
  main: new OrbitControls(cameras.main, renderer.domElement)
};
controls.main.enableDamping = true;

const scene = new Scene();

// Add some debug helpers
const gridHelper = new GridHelper(10, 10);
const axesHelper = new AxesHelper();
const cameraHelper = new CameraHelper(cameras.main);
const helpers = new Group();
helpers.add(gridHelper, axesHelper, cameraHelper);
scene.add(helpers);

// Create particle classes
const particlesNormal = new ParticlesNormal(renderer);
const totalParticles = graphicsMode() === GRAPHICS_HIGH ? 5000 : 2500;
const particles = new Particles(
  totalParticles,
  particlesNormal,
  renderer.getPixelRatio()
);
scene.add(particles.mesh);

function renderScene(camera, left, bottom, width, height) {
  left *= renderSize.width;
  bottom *= renderSize.height;
  width *= renderSize.width;
  height *= renderSize.height;

  renderer.setViewport(left, bottom, width, height);
  renderer.setScissor(left, bottom, width, height);

  renderer.render(scene, camera);
}

function update() {
  requestAnimationFrame(update);

  const activeCamera = guiController.cameraDebug ? cameras.dev : cameras.main;

  controls.main.enabled = !guiController.cameraDebug;
  helpers.visible = guiController.cameraDebug;
  controls.main.update();

  // Render particle normal texture
  particlesNormal.render(activeCamera);

  if (guiController.cameraDebug) {
    renderScene(cameras.dev, 0, 0, 1, 1);
    renderScene(cameras.main, 0, 0, 0.25, 0.25);
  } else {
    renderScene(cameras.main, 0, 0, 1, 1);
  }

  renderStats.update(renderer);
}

function onResize() {
  // Set new render size
  renderSize = calculateRendererSize(window.innerWidth, window.innerHeight);
  renderer.setSize(renderSize.width, renderSize.height);

  // Scale to window
  renderer.domElement.style.width = `${window.innerWidth}px`;
  renderer.domElement.style.height = `${window.innerHeight}px`;

  // Update camera projection
  cameras.dev.aspect = renderSize.width / renderSize.height;
  cameras.main.aspect = cameras.dev.aspect;
  cameras.dev.updateProjectionMatrix();
  cameras.main.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

onResize();
update();
