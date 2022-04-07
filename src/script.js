import "./css/style.min.css"
import gsap from "gsap"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "dat.gui"
/**
 * Debug
 */
const gui = new dat.GUI({
  hideable: true,
  // closed: true,
})
// gui.hide()

/**
 * Params
 */

const parameters = {
  materialColor: "#ffeded",
}
gui.addColor(parameters, "materialColor").onChange(() => {
  particlesMaterial.color.set(parameters.materialColor)
  material.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
})
/**
 * Meshes
 */
const objectsDistance = 5
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 3), material)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
const mesh4 = new THREE.Mesh(new THREE.TetrahedronGeometry(1, 0), material)
// Spacing out the meshes
mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2
mesh4.position.y = -objectsDistance * 3

// Debug meshes
// Mesh1
// gui.add(mesh1.scale, "x", 0.01, 1, 0.01)
// gui.add(mesh1.scale, "y", 0.4, 1, 0.01)
// gui.add(mesh1.scale, "z", 0.01, 1, 0.01)

scene.add(mesh1, mesh2, mesh3, mesh4)

const sectionMeshes = [mesh1, mesh2, mesh3, mesh4]

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
  // x
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10
  // y
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length
  // z
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */

const sun = new THREE.DirectionalLight("#ffffff", 1)
sun.position.set(1, 1, 0)
scene.add(sun)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
// Camera Group NOTE: We put the camera into its own group since it is constantly rotating in tick(), but when we click it we want it to rotate quickly for a set amount of time with gsap. Putting it into a group allows us to attain that feature.
const cameraGroup = new THREE.Group()

scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.z = 6

cameraGroup.add(camera)

scene.add(cameraGroup)

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  if (sizes.width < 995) {
    console.log(sizes.width, sizes.height)
    // Placing them from left to right
    mesh1.position.x = 0
    mesh2.position.x = 0
    mesh3.position.x = 0
    mesh4.position.x = 0
  } else {
    mesh1.position.x = 2
    mesh2.position.x = -2
    mesh3.position.x = 2
    mesh4.position.x = -2
  }

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Moving meshes to proper place depending on size
// Placing them from left to right
if (sizes.width < 995) {
  mesh1.position.x = 0
  mesh2.position.x = 0
  mesh3.position.x = 0
  mesh4.position.x = 0
} else {
  mesh1.position.x = 2
  mesh2.position.x = -2
  mesh3.position.x = 2
  mesh4.position.x = -2
}

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
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", () => {
  scrollY = window.scrollY

  const newSection = Math.round(scrollY / sizes.height)

  if (newSection != currentSection) {
    currentSection = newSection

    // gsap.to(sectionMeshes[currentSection].rotation, {
    //   duration: 1.5,
    //   ease: "power2.inOut",
    //   x: "+=6",
    //   y: "+=3",
    //   z: "+=1.5",
    // })
  }
})
/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
}
const mouse = new THREE.Vector2()

window.addEventListener("click", () => {
  if (currentIntersect) {
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    })
    // switch (currentIntersect.object) {
    //   case mesh1:
    //     console.log("click on object 1")
    //     break

    //   case mesh2:
    //     console.log("click on object 2")
    //     break
    //   case mesh3:
    //     console.log("click on object 3")
    //     break
    //   case mesh4:
    //     console.log("click on object 4")
    //     break
    // }
  }
})
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5

  mouse.x = (e.clientX / sizes.width) * 2 - 1
  mouse.y = (e.clientY / sizes.height) * 2 - 1
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
// Game loop
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance

  const parallaxX = cursor.x * 0.5
  const parallaxY = -cursor.y * 0.5
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

  // Animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  // Raycast from mouse
  raycaster.setFromCamera(mouse, camera)
  const objects = [mesh1, mesh2, mesh3, mesh4]
  const intersects = raycaster.intersectObjects(objects)
  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter")
    }
    currentIntersect = intersects[0]
  } else {
    if (currentIntersect) {
      // console.log("mouse leave")
    }

    currentIntersect = null
  }
  // Animate particles
  particles.rotation.y = 0.02 * elapsedTime
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
// Circle cursor
// const $bigBall = document.querySelector(".cursor__ball--big")
// const $smallBall = document.querySelector(".cursor__ball--small")
// const $hoverables = document.querySelectorAll(".hoverable")

// // Listeners
// document.body.addEventListener("mousemove", onMouseMove)
// for (let i = 0; i < $hoverables.length; i++) {
//   $hoverables[i].addEventListener("mouseenter", onMouseHover)
//   $hoverables[i].addEventListener("mouseleave", onMouseHoverOut)
// }

// // Move the cursor
// function onMouseMove(e) {
//   gsap.to($bigBall, { duration: 0.17, x: e.pageX - 15, y: e.pageY - 15 })
//   gsap.to($smallBall, { duration: 0.1, x: e.pageX - 5, y: e.pageY - 7 })
// }

// // Hover an element
// function onMouseHover() {
//   gsap.to($bigBall, { duration: 0.3, scale: 4 })
// }
// function onMouseHoverOut() {
//   gsap.to($bigBall, { duration: 0.3, scale: 1 })
// }
