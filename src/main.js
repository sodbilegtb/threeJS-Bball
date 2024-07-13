import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

const container = document.querySelector('#scene-container');

// create a Scene
const scene = new THREE.Scene();

// background color
scene.background = new THREE.Color('white');

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 3, 25);
camera.lookAt(scene.position);


// create the renderer
const renderer = new THREE.WebGLRenderer({antialias: true });

// renderer to the same size as container element
renderer.setSize(container.clientWidth, container.clientHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.append(renderer.domElement);

// add controls
const controls = new OrbitControls(camera, renderer.domElement);

// create the lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const spotlight = new THREE.PointLight(0xffffff, 1.5, 60, 2);
spotlight.position.set(0, 15, 1);
spotlight.shadow.mapSize.width = 1000;
spotlight.shadow.mapSize.height = 1000;
spotlight.castShadow = true;
spotlight.shadow.camera.near = 0.5;
spotlight.shadow.camera.far = 25;
scene.add(spotlight);

// Load textures
const loader = new THREE.TextureLoader();
const bballTexture = loader.load('./images/ball.jpg');
const tilesTexture = loader.load('./images/court.png');
const grungeTexture = loader.load('./images/dallas.png');
const board = loader.load('./images/back.png');

// create basketball
const bballMaterial = new THREE.MeshPhongMaterial({ map: bballTexture });
const ball = new THREE.Mesh(new THREE.SphereGeometry(1.5, 100, 100), bballMaterial);
ball.castShadow = true;
scene.add(ball);



// create the floor
const floorMaterial = new THREE.MeshPhongMaterial({ map: tilesTexture, color: "#cabbb5" });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(94, 80), floorMaterial);
floor.rotation.set(-Math.PI / 2, 0, 0);
floor.position.set(0, -6, -1);
floor.receiveShadow = true;
scene.add(floor);

// create the wall
const wallMaterial = new THREE.MeshPhongMaterial({ map: grungeTexture, color: "#af884f" });
const wall = new THREE.Mesh(new THREE.PlaneGeometry(94, 50), wallMaterial);
wall.rotation.set(0, 0, 0);
wall.position.set(0, 19, -41);
wall.receiveShadow = true;
scene.add(wall);

// Create backboard
const backboardMaterial = new THREE.MeshPhongMaterial({ map: board, color: "#ffffff" });
const backboard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 10), backboardMaterial);
backboard.position.set(45, 19, 0);
backboard.receiveShadow = true;
scene.add(backboard);
const backboard2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 10), backboardMaterial);
backboard2.position.set(-45, 19, 0);
backboard2.receiveShadow = true;
scene.add(backboard2);



// Creating rim with the torus geometry 
const radius = 2.35; 
const tubeRadius = 0.2; 
const radialSegments = 16; 
const tubularSegments = 100; 
const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Combine the geometry and material into a mesh
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
const torusMesh2 = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(-42.3, 17, 0);
torusMesh.rotation.x =Math.PI / 2;
torusMesh2.position.set(42.3, 17, 0);
torusMesh2.rotation.x =Math.PI / 2;
scene.add(torusMesh);
scene.add(torusMesh2);



// ball variables
let bx = -6; // starting ball x position
let by = 30; // starting ball y position
let dx = 0.003; // change in x
let dy = 0; // change in y
let g = -1.49; // gravity
let damp = 0.57; // dampening
let time = 3; // time

// animation function
function animate(now) {
  requestAnimationFrame(animate);
  controls.update();

  if (!now) now = 0;

  // Update ball position based on velocity and gravity
  ball.position.set(bx, by, 0);
  dx = (now - time) / 1000;
  time = now;
  bx += 3 * dx;
  by += 0.9 * dy;
  dy += g * dx;

  // Check if ball has reached the stopping condition
  if (bx >= 25) {
      // Set ball's position to stop at 40
      bx = 25;
      // Stop vertical movement
      dy = 0;
      // Disable further gravity effect
      g = 0;
      ball.rotation.z = 0;
  }

  // Handle collision with the ground or floor
  if (by < -4.5) {
      by = -4.5;
      if (Math.abs(dy) < -g / 9) {
          dy = 0;
          g = 0;
      } else {
          dy = -dy * damp;
      }
  }

  
  // Rotate the ball
  ball.rotation.z -= 0.03;

  // Render the scene
  renderer.render(scene, camera);
}
// handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// start the animation loop
animate();