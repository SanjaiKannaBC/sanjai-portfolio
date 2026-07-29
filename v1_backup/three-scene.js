import * as THREE from 'three';
import gsap from 'gsap';

export function initThreeScene() {
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) return;

  // 1. Scene Setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.001); // Matches background color

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 400;

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent to show CSS background fallback if needed
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Data Node Particles (representing Data Science)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  const color1 = new THREE.Color(0x3b82f6); // Accent blue
  const color2 = new THREE.Color(0x8b5cf6); // Accent purple

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Distribute particles in a large sphere/volume
    posArray[i] = (Math.random() - 0.5) * 1500;     // x
    posArray[i + 1] = (Math.random() - 0.5) * 1500; // y
    posArray[i + 2] = (Math.random() - 0.5) * 1500; // z

    // Mix colors randomly
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i + 1] = mixedColor.g;
    colorsArray[i + 2] = mixedColor.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

  // Material with additive blending for glowing effect
  const particlesMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
  });

  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);

  // 5. Connecting Lines (Network Effect) for a subset of particles to simulate data connections
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.15
  });
  
  // Create a smaller geometry for lines so it doesn't drop FPS
  const lineGeometry = new THREE.BufferGeometry();
  const lineCount = 300; 
  const linePositions = new Float32Array(lineCount * 3);
  for (let i = 0; i < lineCount * 3; i++) {
    linePositions[i] = (Math.random() - 0.5) * 800;
  }
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  // We'll just draw a continuous line through random points for a techy look
  const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  // 6. Mouse Interaction
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

  // 7. Scroll Interaction (Move camera through the data)
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // 8. Animation Loop
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Smoothly interpolate target rotation based on mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    particleMesh.rotation.y += 0.002;
    particleMesh.rotation.x += 0.001;
    
    lineMesh.rotation.y -= 0.001;
    lineMesh.rotation.z -= 0.002;

    // Apply mouse parallax
    camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.05;
    
    // Apply scroll translation (fly through the particles)
    camera.position.z = 400 - (scrollY * 0.5);

    camera.lookAt(scene.position);
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
