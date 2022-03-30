import "./css/cursor.min.css"
import "./css/style.min.css"
import gsap from "gsap"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "dat.gui"
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector(".webgl")
// const ctx = canvas.getContext("2d")
// ctx.fillStyle = "green"
// ctx.fillRect(10, 10, 150, 100)
/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const donutTexture = textureLoader.load("/matcaps/8.png")
const textTexture = textureLoader.load("/matcaps/3.png")
/**
 * Objects
 */

// Cube Group
// const cubeGroup = new THREE.Group()
// scene.add(cubeGroup)

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1.5, 0.5, 1),
//   new THREE.MeshBasicMaterial({ color: 0xbfecff })
// )
// cube.position.x = 3
// // cube.material.opacity = 0;
// cubeGroup.add(cube)

// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1.5, 0.5, 1),
//   new THREE.MeshBasicMaterial({ color: 0xa1eeff })
// )
// cube2.position.x = -3
// cubeGroup.add(cube2)

// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1.5, 0.5, 1),
//   new THREE.MeshBasicMaterial({ color: 0xa1eeff })
// );
// cube3.position.x = 3;
// cubeGroup.add(cube3);

// // Floor
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(25, 25),
//   new THREE.MeshStandardMaterial({ color: "green" })
// )
// plane.rotation.x = 5
// plane.position.y = -1
// scene.add(plane)
// gui.add(plane.rotation, "x").min(0).max(15).step(0.1)

/**
 * Particles
 */
// Geometry
const particleTexture = textureLoader.load("/particles/9.png")
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true

particlesMaterial.color = new THREE.Color("#ff88cc")

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textMat = new THREE.MeshMatcapMaterial({ matcap: textTexture })

  // Text
  const textGeometry = new TextGeometry("Kawika Mendiola", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, textMat)
  scene.add(text)

  // Donuts
  // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
  // const donutMat = new THREE.MeshMatcapMaterial({ matcap: donutTexture })
  // for (let i = 0; i < 1000; i++) {
  //   const donut = new THREE.Mesh(donutGeometry, donutMat)
  //   donut.position.x = (Math.random() - 0.5) * 20
  //   donut.position.y = (Math.random() - 0.5) * 20
  //   donut.position.z = (Math.random() - 0.5) * 20
  //   donut.rotation.x = Math.random() * Math.PI
  //   donut.rotation.y = Math.random() * Math.PI
  //   const scale = Math.random()
  //   donut.scale.set(scale, scale, scale)
  //   scene.add(donut)
  // }
})
/**
 * Lights
 */

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0x404040, 1)
scene.add(ambientLight)

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

camera.position.y = 0
camera.position.z = 3.9
gui.add(camera.position, "x", 0, 10, 0.1).name("cam pos x")
gui.add(camera.position, "y", 0, 10, 0.1).name("cam pos y")
gui.add(camera.position, "z", 0, 10, 0.1).name("cam pos z")

gui.add(camera.rotation, "x", -5, 5, 0.001).name("cam rotate x")
camera.rotation.x = -1.1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
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
  // cube.rotation.y = 1 * elapsedTime

  // cube2.rotation.y = 1 * elapsedTime

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
