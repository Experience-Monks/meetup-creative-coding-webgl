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

const renderer = new WebGLRenderer({ antialias: true });
renderer.debug.checkShaderErrors = true;

renderer.setScissorTest(true);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
scene.add(
  new GridHelper(10, 10),
  new AxesHelper(),
  new CameraHelper(cameras.main)
);

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
  controls.main.enabled = !guiController.cameraDebug;
  controls.main.update();

  if (guiController.cameraDebug) {
    renderScene(cameras.dev, 0, 0, 1, 1);
    renderScene(cameras.main, 0, 0, 0.25, 0.25);
  } else {
    renderScene(cameras.main, 0, 0, 1, 1);
  }

  renderStats.update(renderer);
}

function onResize() {
  // Update camera projections
  cameras.dev.aspect = window.innerWidth / window.innerHeight;
  cameras.dev.updateProjectionMatrix();
  // Set frame buffer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

update();
