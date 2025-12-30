// ABOUTME: Main entry point for the 3D bird flying game
// ABOUTME: Implements physics-based flight mechanics with Three.js rendering

import * as THREE from 'three';

// Game setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Enhanced sky with gradient
const skyColor = 0x87CEEB;
const horizonColor = 0xffffff;
scene.background = new THREE.Color(skyColor);
scene.fog = new THREE.FogExp2(0x87CEEB, 0.0015);

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfff5e1, 1.2);
directionalLight.position.set(100, 150, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);

// Add hemisphere light for better ambient lighting
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x228B22, 0.5);
scene.add(hemisphereLight);

// Create bird with improved materials
const bird = new THREE.Group();

// Bird body with better material
const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
bodyGeometry.scale(1, 0.8, 1.2);
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6B6B,
    metalness: 0.1,
    roughness: 0.6,
    emissive: 0x330000,
    emissiveIntensity: 0.1
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.castShadow = true;
bird.add(body);

// Bird head
const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF8C8C,
    metalness: 0.1,
    roughness: 0.6
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0, 0.2, 0.6);
head.castShadow = true;
bird.add(head);

// Bird eyes
const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.12, 0.25, 0.75);
bird.add(leftEye);
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(0.12, 0.25, 0.75);
bird.add(rightEye);

// Bird beak
const beakGeometry = new THREE.ConeGeometry(0.1, 0.35, 8);
const beakMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.3,
    roughness: 0.4
});
const beak = new THREE.Mesh(beakGeometry, beakMaterial);
beak.position.set(0, 0.2, 0.9);
beak.rotation.x = Math.PI / 2;
bird.add(beak);

// Enhanced wings
const wingGeometry = new THREE.BoxGeometry(1.4, 0.08, 0.7);
const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF5252,
    metalness: 0.2,
    roughness: 0.5,
    emissive: 0x330000,
    emissiveIntensity: 0.1
});
const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
leftWing.position.set(-0.8, 0, 0);
leftWing.castShadow = true;
bird.add(leftWing);

const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
rightWing.position.set(0.8, 0, 0);
rightWing.castShadow = true;
bird.add(rightWing);

// Tail feathers
const tailGeometry = new THREE.ConeGeometry(0.35, 0.7, 8);
const tailMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF5252,
    metalness: 0.2,
    roughness: 0.5
});
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(0, 0, -0.9);
tail.rotation.x = Math.PI / 2;
tail.castShadow = true;
bird.add(tail);

bird.position.set(0, 15, 0);
scene.add(bird);

// Motion trail
const trailPoints: THREE.Vector3[] = [];
const trailLength = 20;
for (let i = 0; i < trailLength; i++) {
    trailPoints.push(new THREE.Vector3(0, 15, 0));
}
const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
const trailMaterial = new THREE.LineBasicMaterial({
    color: 0xFF6B6B,
    transparent: true,
    opacity: 0.3,
    linewidth: 2
});
const trail = new THREE.Line(trailGeometry, trailMaterial);
scene.add(trail);

// Enhanced ground with visible texture
const groundGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7c2c,
    roughness: 0.85,
    metalness: 0.05
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;

// Add some variation to the ground for terrain effect
const positions = ground.geometry.attributes.position;
for (let i = 0; i < positions.count; i++) {
    const y = Math.random() * 1.5 + Math.sin(i * 0.1) * 0.5;
    positions.setZ(i, y);
}
positions.needsUpdate = true;
ground.geometry.computeVertexNormals();

scene.add(ground);

// Create enhanced clouds
function createCloud(x: number, y: number, z: number): THREE.Group {
    const cloud = new THREE.Group();
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.7,
        roughness: 1,
        metalness: 0
    });

    for (let i = 0; i < 7; i++) {
        const cloudPart = new THREE.Mesh(
            new THREE.SphereGeometry(Math.random() * 2.5 + 1.5, 16, 16),
            cloudMaterial
        );
        cloudPart.position.set(
            Math.random() * 5 - 2.5,
            Math.random() * 2 - 1,
            Math.random() * 5 - 2.5
        );
        cloud.add(cloudPart);
    }

    cloud.position.set(x, y, z);
    return cloud;
}

// Add multiple clouds at various heights
const clouds: THREE.Group[] = [];
for (let i = 0; i < 30; i++) {
    const cloud = createCloud(
        Math.random() * 300 - 150,
        Math.random() * 40 + 20,
        Math.random() * 300 - 150
    );
    clouds.push(cloud);
    scene.add(cloud);
}

// Create enhanced trees/obstacles
function createTree(x: number, z: number): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 12);
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x6B4423,
        roughness: 0.9,
        metalness: 0
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 3;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Multiple layers of foliage
    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a5f1a,
        roughness: 0.9,
        metalness: 0
    });

    for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.ConeGeometry(2.5 - i * 0.5, 3, 8);
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 5.5 + i * 1.5;
        foliage.castShadow = true;
        tree.add(foliage);
    }

    tree.position.set(x, 0, z);
    return tree;
}

// Add trees with better distribution
for (let i = 0; i < 40; i++) {
    const tree = createTree(
        Math.random() * 300 - 150,
        Math.random() * 300 - 150
    );
    scene.add(tree);
}
