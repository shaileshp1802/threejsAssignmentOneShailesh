import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {gsap} from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(new THREE.Color("#ffffff"), 0)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)
})

// Create a cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);

camera.position.z = 5;
camera.position.y = 0;

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 3.5);
scene.add(pointLight);
pointLight.position.y = 3
pointLight.position.z = 7


// Loading Texture
const textureLoader = new THREE.TextureLoader()

let meshTexture = textureLoader.load('./assets/bakingTextEdit.png')
let earthTexture = textureLoader.load('./assets/earth.jpg')
earthTexture.flipY = false
meshTexture.flipY = false
// texture.encoding = THREE.sRGBEncoding


const meshMaterial = new THREE.MeshPhongMaterial({
    map: meshTexture,
    flatShading: false
})
// const earthMaterial = new THREE.MeshPhongMaterial({
//     map: earthTexture,
//     flatShading: false
// })

// Loading Object
const gltfLoader = new GLTFLoader();

const group = new THREE.Group()

let mixer = null
let clips;



gltfLoader.load(
    'assets/model.glb',
    // onLoad callback
    (gltf) => {
        console.log(gltf);
        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clampWhenFinished = true
        clips = gltf.animations;
        const innerPotAction = mixer.clipAction(clips[5]);
        innerPotAction.setDuration(5)
        innerPotAction.setLoop(THREE.LoopOnce);
        innerPotAction.clampWhenFinished = true;
        innerPotAction.play();
        innerPotAction.paused = true
        tl.to(innerPotAction, { time: 3, ease: "none"}, 'start');
        tl.fromTo(camera.position, { z: 5, ease: "none"}, {z: 7}, 'start');


        const insidePotBigAction = mixer.clipAction(clips[6]);
        insidePotBigAction.setLoop(THREE.LoopOnce);
        insidePotBigAction.clampWhenFinished = true;
        insidePotBigAction.play();
        insidePotBigAction.setDuration(5);
        insidePotBigAction.paused = true
        tl.to(insidePotBigAction, { time: 1, ease: "none"}, 'start1');
        tl.to(camera.position, { z: 7.5, ease: "none"}, 'start1');



        const insidePotSmallAction = mixer.clipAction(clips[7]);
        insidePotSmallAction.setLoop(THREE.LoopOnce);
        insidePotSmallAction.clampWhenFinished = true;
        insidePotSmallAction.play();
        // insidePotSmallAction.setDuration(5);
        insidePotSmallAction.paused = true
        tl.to(insidePotSmallAction, { time: 1, ease: "none"}, 'start2');
        tl.to(camera.position, { z: 8, ease: "none"}, 'start2');

        const gearAction = mixer.clipAction(clips[3]);
        gearAction.setLoop(THREE.LoopOnce);
        gearAction.clampWhenFinished = true;
        gearAction.play();
        // gearAction.setDuration(25);
        gearAction.paused = true
        tl.to(gearAction, { time: 4, ease: "none"}, 'start3');
        tl.to(camera.position, { z: 9, y: 1, ease: "none"}, 'start3');

        const potAction = mixer.clipAction(clips[0]);
        potAction.setLoop(THREE.LoopOnce);
        potAction.clampWhenFinished = true;
        potAction.play();
        // potAction.setDuration(5);
        potAction.paused = true
        tl.to(potAction, { time: 5, ease: "none"}, 'start4');
        tl.to(camera.position, { z: 12, ease: "none"}, 'start4');

        const moonAction = mixer.clipAction(clips[1]);
        moonAction.setLoop(THREE.LoopOnce);
        moonAction.clampWhenFinished = true;
        moonAction.play();
        // moonAction.setDuration(5);
        moonAction.paused = true
        tl.to(moonAction, { time: 5, ease: "none"}, 'start5');
        tl.to(camera.position, { z: 15, ease: "none"}, 'start5');

        const moonGearAction = mixer.clipAction(clips[2]);
        moonGearAction.setLoop(THREE.LoopOnce);
        moonGearAction.clampWhenFinished = true;
        moonGearAction.play();
        // moonGearAction.setDuration(5);
        moonGearAction.paused = true
        tl.to(moonGearAction, { time: 5, ease: "none"}, 'start5');
        tl.to(camera.position, { z: 16, ease: "none"}, 'start5');

        const ConeAction = mixer.clipAction(clips[4]);
        ConeAction.setLoop(THREE.LoopOnce);
        ConeAction.clampWhenFinished = true;
        ConeAction.play();
        // ConeAction.setDuration(5);
        ConeAction.paused = true
        tl.to(ConeAction, { time: 5, ease: "none"}, 'start5');
        tl.to(camera.position, { z: 20, ease: "none"}, 'start6');

        group.add(gltf.scene);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = meshMaterial
                // child.material.map = meshTexture
                child.material.needsUpdate = true
            }
        })
        gltf.scene.scale.set(0.1, 0.1, 0.1)
    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
)


// gltfLoader.load(
//     'assets/earth.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = earthMaterial
//                 // child.material.map = earthTexture
//                 child.material.needsUpdate = true
//             }
//         })
//         mesh = gltf.scene
//         mesh.scale.set(0.12, 0.12, 0.12)
//         // group.add(gltf.scene);
//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

scene.add(group)

var tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom", // Adjust this to control the duration of the scroll effect
        // end: "+=400%", // Adjust this to control the duration of the scroll effect
        scrub: true,
        markers: true
    }
});

// Rotate the cube 360 degrees
// tl.to(group.position, { duration: 1, z: 3, ease: "none" }, 'start');
// tl.to(group.rotation, { duration: 1, y: Math.PI * 2, ease: "none" }, 'start');
// tl.to(camera.position, { duration: 1, z: 5, ease: "none" }, 'start');

const clock = new THREE.Clock()
let previousTime = 0

// Define a function to animate the cube
function animate() {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    requestAnimationFrame(animate);
    if (mixer !== null) {
        mixer.update(deltaTime)
    }

    // Rotate the cube
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Call the animate function to start the animation
animate();