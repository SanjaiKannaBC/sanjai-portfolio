import * as THREE from 'three';

export let threeData = {
  camera: null,
  scene: null,
  renderer: null,
  specialNodes: [],
  particleMesh: null,
  lineMesh: null
};

export function initThreeScene() {
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) return;

  // 1. Scene Setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.001);

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Massive Data Background (Many Nodes)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 8000; // Increased massively
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  const color1 = new THREE.Color(0x3b82f6); // blue
  const color2 = new THREE.Color(0x8b5cf6); // purple
  const color3 = new THREE.Color(0x2dd4bf); // teal

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Huge volume
    posArray[i] = (Math.random() - 0.5) * 4000;
    posArray[i + 1] = (Math.random() - 0.5) * 4000;
    posArray[i + 2] = (Math.random() - 0.5) * 4000;

    // Random colors between 3 themes
    let mix = Math.random();
    let finalColor = color1.clone();
    if (mix > 0.6) finalColor.lerp(color2, Math.random());
    else if (mix > 0.3) finalColor.lerp(color3, Math.random());
    
    colorsArray[i] = finalColor.r;
    colorsArray[i + 1] = finalColor.g;
    colorsArray[i + 2] = finalColor.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.6,
  });

  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);

  // 5. Connective Background Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.05
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const lineCount = 1000; 
  const linePositions = new Float32Array(lineCount * 3);
  for (let i = 0; i < lineCount * 3; i++) {
    linePositions[i] = (Math.random() - 0.5) * 4000;
  }
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  // 6. Subtle Glowing Nodes for Sections
  // Instead of clunky wireframe spheres, we use slightly larger, glowing particles 
  // that blend seamlessly into the background network.
  const specialNodePositions = [
    new THREE.Vector3(0, 0, 800),         // Hero
    new THREE.Vector3(800, 400, 200),     // About
    new THREE.Vector3(-600, -300, -300),  // Skills
    new THREE.Vector3(400, -500, -900),   // Experience
    new THREE.Vector3(-800, 600, -1500),  // Projects
    new THREE.Vector3(500, 300, -2200),   // Certifications
    new THREE.Vector3(0, 0, -3000)        // Contact
  ];

  threeData.specialNodes = specialNodePositions;
  threeData.camera = camera;
  threeData.scene = scene;
  threeData.renderer = renderer;

  // 7. Mouse Interaction (Heavy Parallax & Node Reaction)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // 8. Animation Loop
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Mouse movement strongly influences the entire network rotation
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Smooth interpolation for mouse movement
    particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
    particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);
    
    lineMesh.rotation.y += 0.05 * (targetX - lineMesh.rotation.y);
    lineMesh.rotation.x += 0.05 * (targetY - lineMesh.rotation.x);

    // Also add a slow constant rotation so it feels alive
    particleMesh.rotation.z = elapsedTime * 0.02;
    lineMesh.rotation.z = elapsedTime * -0.01;

    // Apply slight bobbing to the target nodes virtually
    for (let i = 0; i < specialNodePositions.length; i++) {
      specialNodePositions[i].y = specialNodePositions[i].y + Math.sin(elapsedTime * 2 + i) * 0.5;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  // 9. Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
