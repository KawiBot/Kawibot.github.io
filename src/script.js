import "./css/cursor.min.css"
import "./css/style.min.css"
import gsap from "gsap"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TextureLoader } from "three/examples/jsm/loaders/BasisTextureLoader"
import * as dat from "dat.gui"
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector(".webgl")
// const ctx = canvas.getContext("2d")
// ctx.fillStyle = "green"
// ctx.fillRect(10, 10, 150, 100)

const container = document.querySelector(".container")
// Scene
const scene = new THREE.Scene()

// Sphere Group
// const sphereGroup = new THREE.Group();
// scene.add(sphereGroup);
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.3, 32, 16),
//   new THREE.MeshBasicMaterial({ color: 0x34e8eb })
// );
// sphereGroup.add(sphere);
// const sphere2 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.3, 32, 16),
//   new THREE.MeshBasicMaterial({ color: 0xffffff })
// );
// sphere2.position.x = -1;
// sphereGroup.add(sphere2);

// Cube Group
const cubeGroup = new THREE.Group()
scene.add(cubeGroup)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 0xbfecff })
)
cube.position.x = 3
// cube.material.opacity = 0;
cubeGroup.add(cube)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 0xa1eeff })
)
cube2.position.x = -3
cubeGroup.add(cube2)

// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1.5, 0.5, 1),
//   new THREE.MeshBasicMaterial({ color: 0xa1eeff })
// );
// cube3.position.x = 3;
// cubeGroup.add(cube3);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 5
camera.position.y = 1

scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // sphere.rotation.y = 0.5 * elapsedTime;
  // sphere.rotation.x = 0.5 * elapsedTime;
  // sphereGroup.rotation.y = Math.PI * elapsedTime;
  // sphere2.rotation.x = 0.5 * elapsedTime;

  cube.rotation.y = 1 * elapsedTime

  cube2.rotation.y = 1 * elapsedTime

  // cube3.rotation.y = 1 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// Circle cursor
const $bigBall = document.querySelector(".cursor__ball--big")
const $smallBall = document.querySelector(".cursor__ball--small")
const $hoverables = document.querySelectorAll(".hoverable")

// Listeners
document.body.addEventListener("mousemove", onMouseMove)
for (let i = 0; i < $hoverables.length; i++) {
  $hoverables[i].addEventListener("mouseenter", onMouseHover)
  $hoverables[i].addEventListener("mouseleave", onMouseHoverOut)
}

// Move the cursor
function onMouseMove(e) {
  gsap.to($bigBall, { duration: 0.17, x: e.pageX - 15, y: e.pageY - 15 })
  gsap.to($smallBall, { duration: 0.1, x: e.pageX - 5, y: e.pageY - 7 })
}

// Hover an element
function onMouseHover() {
  gsap.to($bigBall, { duration: 0.3, scale: 4 })
}
function onMouseHoverOut() {
  gsap.to($bigBall, { duration: 0.3, scale: 1 })
}
