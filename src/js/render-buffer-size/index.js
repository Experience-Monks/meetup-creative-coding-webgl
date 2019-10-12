import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  GridHelper,
  AxesHelper,
  Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
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

update();
