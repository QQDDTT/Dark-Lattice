import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

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
    
    // Fix color space and tone mapping for GLB materials
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    container.appendChild(renderer.domElement);

    // 4. Lights
    // 切换为单侧光照明逻辑 (One-sided dramatic lighting)
    
    // 基础环境光：降低到极低，仅保留最微弱的轮廓
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // 主侧向光源：创造戏剧性的明暗对比
    const mainLight = new THREE.DirectionalLight(0x3B82F6, 3.0);
    mainLight.position.set(10, 5, 5);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0x8B5CF6, 1.5);
    rimLight.position.set(-10, 0, -5); // 弱侧向补偿，增加轮廓
    scene.add(rimLight);

    // 使用 PMREMGenerator 生成拟真的环境光反射
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // 使用内置 RoomEnvironment 作为环境光来源
    const roomEnv = new RoomEnvironment(renderer);
    const envMap = pmremGenerator.fromScene(roomEnv).texture;
    scene.environment = envMap;
    // scene.background = envMap; // 如果需要背景也显示环境贴图可以开启
    pmremGenerator.dispose();

    // 5. Load Model
    const loader = new GLTFLoader();
    let model;
    let core, circel1, circel2;
    let group1, group2, group3;

    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene;
            
            // 根据规范查找具名对象
            core = model.getObjectByName('core');
            circel1 = model.getObjectByName('circel1');
            circel2 = model.getObjectByName('circel2');
            group1 = model.getObjectByName('group1');
            group2 = model.getObjectByName('group2');
            group3 = model.getObjectByName('group3');
            
            // 修复材质并确保可见性
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        // 降低环境贴图强度以配合单侧照明，保持阴影深邃
                        child.material.envMapIntensity = 0.5; 
                        child.material.metalness = 0.9;
                        child.material.roughness = 0.1;
                        child.material.needsUpdate = true;
                    }
                }
            });

            // 居中模型
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // 调整缩放
            model.scale.set(1.5, 1.5, 1.5); 
            
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
            // 应用核心动画逻辑
            if (group1) group1.rotation.y += 0.01;      // 快速
            if (group2) group2.rotation.y += 0.002;     // 慢速
            if (group3) group3.rotation.z += 0.005;     // 异轴
            
            if (circel1) circel1.rotation.y += 0.003;   // 顺时针
            if (circel2) circel2.rotation.y -= 0.003;   // 逆时针

            // 鼠标视差 (Mouse parallax) 应用于整体模型
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
