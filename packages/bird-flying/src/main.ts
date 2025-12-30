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
