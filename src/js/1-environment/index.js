import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  GridHelper,
  AxesHelper,
  Vector3,
  CameraHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { renderStats } from '../stats';
import { guiController } from '../gui';

// Setup the webgl renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.debug.checkShaderErrors = true;

renderer.setScissorTest(true);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create two cameras
// One for developing, the other for the final view
const cameras = {
  dev: new PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ),
  main: new PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
};

// Set initial camera positions
cameras.dev.position.set(20, 10, 20);
cameras.dev.lookAt(new Vector3());

cameras.main.position.set(0, 10, 20);
cameras.main.lookAt(new Vector3());

// Create two sets of orbit controls
// One for developing, the other for user control
const controls = {
  dev: new OrbitControls(cameras.dev, renderer.domElement),
  main: new OrbitControls(cameras.main, renderer.domElement)
};
controls.main.enableDamping = true;

// Create our scene graph
const scene = new Scene();

// Add some debug helpers
scene.add(
  new GridHelper(10, 10),
  new AxesHelper(),
  new CameraHelper(cameras.main)
);

// Render the scene with viewport coords
function renderScene(camera, left, bottom, width, height) {
  left *= window.innerWidth;
  bottom *= window.innerHeight;
  width *= window.innerWidth;
  height *= window.innerHeight;

  renderer.setViewport(left, bottom, width, height);
  renderer.setScissor(left, bottom, width, height);

  renderer.render(scene, camera);
}

function update() {
  requestAnimationFrame(update);
  // Enable main camera controls when not in dev mode
  controls.main.enabled = !guiController.cameraDebug;
  controls.main.update();

  // Handle scene rendering
  if (guiController.cameraDebug) {
    renderScene(cameras.dev, 0, 0, 1, 1);
    renderScene(cameras.main, 0, 0, 0.25, 0.25);
  } else {
    renderScene(cameras.main, 0, 0, 1, 1);
  }

  // Update render stats
  renderStats.update(renderer);
}

function onResize() {
  // Update camera projections
  cameras.dev.aspect = window.innerWidth / window.innerHeight;
  cameras.dev.updateProjectionMatrix();
  // Set webgl context size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

// Begin render loop
update();
