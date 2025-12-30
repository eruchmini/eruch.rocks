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
if (positions) {
    for (let i = 0; i < positions.count; i++) {
        const y = Math.random() * 1.5 + Math.sin(i * 0.1) * 0.5;
        positions.setZ(i, y);
    }
    positions.needsUpdate = true;
    ground.geometry.computeVertexNormals();
}

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

// Create mountain boundary around the map with variation
function createMountain(x: number, z: number, width: number): THREE.Group {
    const mountain = new THREE.Group();

    // Randomize mountain characteristics for variety
    const heightVariation = Math.random() * 40 + 80; // 80-120m tall
    const widthVariation = width * (0.8 + Math.random() * 0.6); // 0.8x to 1.4x width
    const segments = Math.floor(Math.random() * 8) + 12; // 12-20 segments for variety

    // Random rock colors (browns, grays, dark earth tones)
    const rockColors = [
        0x8B7355, // Sandy brown
        0x696969, // Dim gray
        0x5C4033, // Dark brown
        0x708090, // Slate gray
        0x654321, // Dark brown
        0x778899, // Light slate gray
        0x6B5D4F  // Brownish gray
    ];
    const rockColor = rockColors[Math.floor(Math.random() * rockColors.length)];

    // Main mountain body - varied shape
    const mountainGeometry = new THREE.ConeGeometry(widthVariation / 2, heightVariation, segments);
    const mountainMaterial = new THREE.MeshStandardMaterial({
        color: rockColor,
        roughness: 0.9 + Math.random() * 0.1,
        metalness: 0
    });
    const mountainMesh = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountainMesh.position.y = heightVariation / 2;
    mountainMesh.castShadow = true;
    mountainMesh.receiveShadow = true;
    mountain.add(mountainMesh);

    // Snow cap - varying sizes and heights
    const snowCapHeight = heightVariation * (0.15 + Math.random() * 0.15); // 15-30% of mountain
    const snowCapGeometry = new THREE.ConeGeometry(widthVariation / 4, snowCapHeight, segments);
    const snowMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.6 + Math.random() * 0.3,
        metalness: 0.05 + Math.random() * 0.1
    });
    const snowCap = new THREE.Mesh(snowCapGeometry, snowMaterial);
    snowCap.position.y = heightVariation - snowCapHeight / 2;
    mountain.add(snowCap);

    // Add some random rock outcroppings for variety
    if (Math.random() > 0.5) {
        const rockSize = widthVariation * 0.15;
        const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: rockColor,
            roughness: 0.95,
            metalness: 0
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(
            (Math.random() - 0.5) * widthVariation * 0.4,
            heightVariation * (0.3 + Math.random() * 0.3),
            (Math.random() - 0.5) * widthVariation * 0.4
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        mountain.add(rock);
    }

    mountain.position.set(x, 0, z);
    return mountain;
}

// Map boundary constants
const MAP_SIZE = 250; // Half-size of the map (500x500 total)
const MOUNTAIN_HEIGHT = 100; // Increased from 30 to 100 meters
const MOUNTAIN_WIDTH = 60; // Increased to ensure no gaps
const BOUNDARY_BUFFER = 15; // Extra space before hitting invisible wall

// Create mountain ring around the map perimeter
const mountainSpacing = 45; // Reduced spacing to eliminate gaps

// North and South walls
for (let x = -MAP_SIZE; x <= MAP_SIZE; x += mountainSpacing) {
    scene.add(createMountain(x, MAP_SIZE, MOUNTAIN_WIDTH));  // North
    scene.add(createMountain(x, -MAP_SIZE, MOUNTAIN_WIDTH)); // South
}

// East and West walls (skip corners to avoid overlap)
for (let z = -MAP_SIZE + mountainSpacing; z < MAP_SIZE; z += mountainSpacing) {
    scene.add(createMountain(MAP_SIZE, z, MOUNTAIN_WIDTH));  // East
    scene.add(createMountain(-MAP_SIZE, z, MOUNTAIN_WIDTH)); // West
}

// Camera setup
camera.position.set(0, 17, -10);
camera.lookAt(bird.position);

// Game state with momentum system
const keys: Record<string, boolean> = {};
let birdYaw = 0; // Horizontal rotation (left/right)
let birdPitch = 0; // Vertical rotation (up/down)
let forwardSpeed = 0.3; // Current forward speed
const minSpeed = 0.15;
const maxSpeed = 0.8;
const cruisingSpeed = 0.3; // Natural cruising speed when flying level
const pitchSpeed = 0.025; // How fast pitch changes
const yawSpeed = 0.03; // How fast yaw changes
const pitchDecay = 0.92; // How quickly pitch returns to neutral
let wingFlap = 0;
let trailIndex = 0;
let bankingAngle = 0; // Current tilt angle when turning
let isFirstPerson = true; // Camera mode: true = first-person, false = third-person
let previousPosition = new THREE.Vector3(0, 15, 0); // Track previous position for velocity calculation

// Keyboard controls
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;

    // Toggle camera mode with F key
    if (e.key === 'f' || e.key === 'F') {
        isFirstPerson = !isFirstPerson;
        console.log('Camera mode:', isFirstPerson ? 'First Person' : 'Third Person');
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with momentum-based physics
function animate(): void {
    requestAnimationFrame(animate);

    // Pitch controls (W = up, S = down)
    if (keys['w'] || keys['ArrowUp']) {
        birdPitch += pitchSpeed;
    }
    if (keys['s'] || keys['ArrowDown']) {
        birdPitch -= pitchSpeed;
    }

    // Apply pitch decay when no input (returns to level flight)
    if (!keys['w'] && !keys['ArrowUp'] && !keys['s'] && !keys['ArrowDown']) {
        birdPitch *= pitchDecay;
    }

    // Limit pitch angle
    birdPitch = Math.max(-0.8, Math.min(0.8, birdPitch));

    // Yaw controls (A = left, D = right) with banking
    if (keys['a'] || keys['ArrowLeft']) {
        birdYaw += yawSpeed;
        bankingAngle = Math.min(bankingAngle + 0.05, 0.6); // Tilt left (positive)
    } else if (keys['d'] || keys['ArrowRight']) {
        birdYaw -= yawSpeed;
        bankingAngle = Math.max(bankingAngle - 0.05, -0.6); // Tilt right (negative)
    } else {
        // Return to level when not turning
        bankingAngle *= 0.9;
    }

    // Speed mechanics based on pitch
    // Diving (negative pitch) increases speed
    // Climbing (positive pitch) decreases speed
    const pitchSpeedEffect = -birdPitch * 0.015;
    forwardSpeed += pitchSpeedEffect;

    // Air resistance - gradually return to cruising speed when flying level
    // This prevents maintaining high dive speeds indefinitely
    const speedDifference = forwardSpeed - cruisingSpeed;
    const airResistance = speedDifference * 0.02; // 2% drag toward cruising speed
    forwardSpeed -= airResistance;

    // Speed boost with space
    let currentSpeed = forwardSpeed;
    if (keys[' '] || keys['Space']) {
        currentSpeed *= 1.8;
    }

    // Clamp speed
    forwardSpeed = Math.max(minSpeed, Math.min(maxSpeed, forwardSpeed));
    currentSpeed = Math.max(minSpeed, Math.min(maxSpeed * 1.8, currentSpeed));

    // Calculate movement based on pitch and yaw
    const pitchCos = Math.cos(birdPitch);
    const pitchSin = Math.sin(birdPitch);

    // Move bird in 3D space based on orientation
    bird.position.x += Math.sin(birdYaw) * pitchCos * currentSpeed;
    bird.position.z += Math.cos(birdYaw) * pitchCos * currentSpeed;
    bird.position.y += pitchSin * currentSpeed;

    // Map boundary collision with mountain walls
    const boundaryLimit = MAP_SIZE - BOUNDARY_BUFFER;
    const distanceFromCenter = Math.sqrt(
        bird.position.x * bird.position.x +
        bird.position.z * bird.position.z
    );

    // Check if bird is near or past the boundary
    if (Math.abs(bird.position.x) > boundaryLimit || Math.abs(bird.position.z) > boundaryLimit) {
        // If too far from center, push bird back to boundary
        if (distanceFromCenter > boundaryLimit) {
            // Normalize position and push back to boundary
            const angle = Math.atan2(bird.position.z, bird.position.x);
            bird.position.x = Math.cos(angle) * boundaryLimit;
            bird.position.z = Math.sin(angle) * boundaryLimit;

            // Bounce bird away from wall if flying into it
            if (Math.cos(birdYaw - angle) > 0.5) {
                birdYaw = angle + Math.PI; // Turn around
            }
        }

        // Invisible wall at top of mountains - can't fly over them
        if (bird.position.y > MOUNTAIN_HEIGHT) {
            bird.position.y = MOUNTAIN_HEIGHT;
            birdPitch = Math.min(birdPitch, -0.1); // Force downward
        }
    }

    // Keep bird above ground with bounce
    if (bird.position.y < 2) {
        bird.position.y = 2;
        birdPitch = Math.abs(birdPitch) * 0.5; // Bounce up slightly
    }

    // Global height ceiling (for areas away from mountains)
    if (bird.position.y > 80) {
        bird.position.y = 80;
        birdPitch = Math.min(birdPitch, 0);
    }

    // Calculate actual velocity to determine visual pitch
    const actualVelocity = bird.position.clone().sub(previousPosition);
    const horizontalSpeed = Math.sqrt(actualVelocity.x * actualVelocity.x + actualVelocity.z * actualVelocity.z);
    const verticalSpeed = actualVelocity.y;

    // Calculate the actual flight path angle based on real velocity
    // This ensures the bird visually points in the direction it's actually moving
    let visualPitch = birdPitch;
    if (horizontalSpeed > 0.001) { // Avoid division by zero
        visualPitch = Math.atan2(verticalSpeed, horizontalSpeed);
    }

    // Update bird rotation with actual flight direction
    bird.rotation.y = birdYaw;
    bird.rotation.x = -visualPitch; // Use actual flight path angle
    bird.rotation.z = bankingAngle; // Enhanced banking effect when turning

    // Store current position for next frame's velocity calculation
    previousPosition.copy(bird.position);

    // Dynamic wing flapping based on speed
    wingFlap += 0.15 + currentSpeed * 0.3;
    const flapAmount = 0.25 + currentSpeed * 0.15;
    leftWing.rotation.z = Math.sin(wingFlap) * flapAmount;
    rightWing.rotation.z = -Math.sin(wingFlap) * flapAmount;

    // Update motion trail
    trailIndex = (trailIndex + 1) % trailLength;
    trailPoints[trailIndex]?.copy(bird.position);
    trail.geometry.setFromPoints(trailPoints);
    if (trail.geometry.attributes.position) {
        trail.geometry.attributes.position.needsUpdate = true;
    }

    // Camera system - toggle between first-person and third-person
    if (isFirstPerson) {
        // First-person camera positioned at bird's head
        const headOffset = new THREE.Vector3(0, 0.5, 0.6); // Position at head
        headOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), -birdPitch); // Apply pitch rotation
        headOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), birdYaw); // Apply yaw rotation

        camera.position.copy(bird.position.clone().add(headOffset));

        // Camera looks in the direction the bird is facing
        const lookDirection = new THREE.Vector3(
            Math.sin(birdYaw) * Math.cos(birdPitch),
            Math.sin(birdPitch),
            Math.cos(birdYaw) * Math.cos(birdPitch)
        );
        const lookTarget = camera.position.clone().add(lookDirection.multiplyScalar(10));
        camera.lookAt(lookTarget);
    } else {
        // Third-person camera follows bird from behind
        const cameraDistance = 10 + currentSpeed * 8;
        const cameraHeight = 3 - birdPitch * 8;
        const cameraOffset = new THREE.Vector3(
            Math.sin(birdYaw) * -cameraDistance,
            cameraHeight,
            Math.cos(birdYaw) * -cameraDistance
        );
        camera.position.lerp(bird.position.clone().add(cameraOffset), 0.08);
        camera.lookAt(bird.position);
    }

    // Move clouds slowly for parallax effect
    clouds.forEach((cloud, index) => {
        cloud.position.x += 0.008;
        cloud.position.z += Math.sin(index * 0.5) * 0.002;
        if (cloud.position.x > 150) {
            cloud.position.x = -150;
        }
    });

    // Update stats with color coding
    const speedElement = document.getElementById('speed');
    const speedValue = currentSpeed.toFixed(3);
    if (speedElement) {
        speedElement.textContent = speedValue;

        // Color code speed
        if (currentSpeed > 0.5) {
            speedElement.className = 'speed-indicator high-speed';
        } else if (currentSpeed < 0.25) {
            speedElement.className = 'speed-indicator low-speed';
        } else {
            speedElement.className = 'speed-indicator';
        }
    }

    const altitudeElement = document.getElementById('altitude');
    if (altitudeElement) {
        altitudeElement.textContent = Math.round(bird.position.y).toString();
    }

    const pitchElement = document.getElementById('pitch');
    if (pitchElement) {
        pitchElement.textContent = Math.round(birdPitch * 57.3).toString(); // Convert to degrees
    }

    const positionElement = document.getElementById('position');
    if (positionElement) {
        positionElement.textContent = `${Math.round(bird.position.x)}, ${Math.round(bird.position.z)}`;
    }

    renderer.render(scene, camera);
}

animate();
