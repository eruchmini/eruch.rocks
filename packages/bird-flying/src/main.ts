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
