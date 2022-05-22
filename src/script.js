import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
import { getBrick } from './bricks';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

// Material
// const material = new THREE.ShaderMaterial({
//     uniforms: {
//         uTime: { value: 0 },
//     },
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     side: THREE.DoubleSide
// });

// // Mesh
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// group
const group = new THREE.Group();
scene.add(group);
let number = 6;
let rows = 10;

let anim = [];

let random = Array(2).fill().map(a => Array(number));

for (let i = 0; i < number; i++) {
    for (let j = 0; j < 2; j++) {
        random[j][i] = Math.random() < 0.5 ? 0 : 1;
    }
}

for (let j = 0; j < rows; j++) {
    for (let i = 0; i < number; i++) {
        const brick = getBrick(i, number, j % 2, random[j % 2][i]);
        const dupl = getBrick(i, number, j % 2, random[j % 2][i]);
        brick.position.setY(-j);
        dupl.position.setY(-j);
        group.add(brick);
        group.add(dupl);
        dupl.visible = false;

        anim.push({
            y: -j,
            row: j,
            mesh: brick,
            dupl,
            offset: j / 2 + Math.random() / 2
        });

    }
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
// Add directional light with brightness of 1
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);
// Add ambient light with brightness of 1
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

scene.add(ambientLight);
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 6, 12);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
// scene.position.set(0, 0, 30);
const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();

    group.position.y = elapsedTime * 0.5;

    anim.forEach(m => {
        // m.mesh.position.setY(m.y + elapsedTime * 0.4);
        if (m.row < 2) {
            let p = elapsedTime + m.offset;
            // m.mesh.position.setY(m.y + p * 10);
            if (p > 1) {
                m.mesh.position.setY(m.y + (2 - p) * 10 + elapsedTime * 0.5);
                m.dupl.visible = true;
            } else {
                m.mesh.position.setY(m.y + (1 - p) * 10);
                m.dupl.visible = false;
            }
        } else {
            m.dupl.visble = false;
        }
    });
    // Update uniforms
    // material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();