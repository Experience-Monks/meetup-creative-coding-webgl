import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  GridHelper,
  AxesHelper,
  Vector3,
  Vector2
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Max render buffer size
const MAX_FRAME_BUFFER_SIZE = new Vector2(640, 320);
// Caculate square root
const BASE_SIZE = Math.sqrt(MAX_FRAME_BUFFER_SIZE.x * MAX_FRAME_BUFFER_SIZE.y);
const MAX_SIZE = BASE_SIZE * BASE_SIZE;

// Debug elements
const renderSizeBase = document.querySelector('.base');
const renderSizeBaseText = renderSizeBase.querySelector('.size');
const renderSizeResized = document.querySelector('.resized');
const renderSizeResizedText = renderSizeResized.querySelector('.size');

renderSizeBase.style.width = `${MAX_FRAME_BUFFER_SIZE.x}px`;
renderSizeBase.style.height = `${MAX_FRAME_BUFFER_SIZE.y}px`;
renderSizeBaseText.innerHTML = `${MAX_FRAME_BUFFER_SIZE.x}x${MAX_FRAME_BUFFER_SIZE.y}`;

// Calculate the render size based on the max dimension
function calculateRendererSize(windowWidth, windowHeight) {
  let width = windowWidth;
  let height = windowHeight;
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

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff);
// renderer.domElement.style.border = '1px solid white';
let renderSize = calculateRendererSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(renderSize.width, renderSize.height);
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 10, 20);
camera.lookAt(new Vector3());
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const scene = new Scene();

scene.add(new GridHelper(10, 10), new AxesHelper());

function update() {
  requestAnimationFrame(update);
  controls.update();
  renderer.render(scene, camera);
}

function onResize() {
  // Update camera projection
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Set new render size
  renderSize = calculateRendererSize(window.innerWidth, window.innerHeight);
  renderer.setSize(renderSize.width, renderSize.height);

  // Scale to window
  renderer.domElement.style.width = `${window.innerWidth}px`;
  renderer.domElement.style.height = `${window.innerHeight}px`;

  // Update debug elements
  renderSizeResized.style.width = `${renderSize.width}px`;
  renderSizeResized.style.height = `${renderSize.height}px`;
  renderSizeResizedText.innerHTML = `${renderSize.width}x${renderSize.height}`;
}

window.addEventListener('resize', onResize);

onResize();
update();
