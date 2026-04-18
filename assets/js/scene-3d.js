import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function initHeroScene() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    const modelPath = container.getAttribute('data-model');
    if (!modelPath) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x3B82F6, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8B5CF6, 1);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // 5. Load Model
    const loader = new GLTFLoader();
    let model;

    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Adjust scale if needed
            model.scale.set(2, 2, 2); 
            
            scene.add(model);
            console.log('3D Model loaded successfully');
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened while loading the model', error);
        }
    );

    // 6. Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    });

    // 7. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.2;
        targetY = mouseY * 0.2;

        if (model) {
            // Auto rotation
            model.rotation.y += 0.005;
            model.rotation.x += 0.002;

            // Mouse parallax
            model.rotation.y += (targetX - model.rotation.y) * 0.05;
            model.rotation.x += (targetY - model.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
    }

    animate();

    // 8. Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
