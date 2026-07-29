import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initThreeScene, threeData } from './three-scene.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize 3D Background
initThreeScene();

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Hover effects for cursor
const hoverElements = document.querySelectorAll('a, .btn, .project-card, .edu-card, .timeline-content, .cert-card');
hoverElements.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorOutline.style.backgroundColor = 'transparent';
  });
});

// SCROLLYTELLING LOGIC
// Wait a tick for Three.js to initialize
setTimeout(() => {
  const { camera, specialNodes } = threeData;
  if (!camera || specialNodes.length < 6) return;

  const sections = [
    document.querySelector('#hero'),
    document.querySelector('#about'),
    document.querySelector('#skills'),
    document.querySelector('#experience'),
    document.querySelector('#projects'),
    document.querySelector('#certifications'),
    document.querySelector('#contact')
  ];

  // Default reset: hide and scale down
  gsap.set(sections, { autoAlpha: 0, scale: 0.5 });
  
  // Option B: Dynamic Staggered Placement
  // Set distinct quadrants for each section so they pop up in different parts of the screen!
  const layout = [
    { xPercent: 0, yPercent: -50, left: '10%', top: '50%' },     // Hero: Left Center
    { xPercent: 0, yPercent: -100, left: '10%', top: '85%' },    // About: Bottom Left
    { xPercent: -100, yPercent: 0, left: '90%', top: '15%' },    // Skills: Top Right
    { xPercent: -50, yPercent: -100, left: '50%', top: '90%' },  // Experience: Bottom Center
    { xPercent: -50, yPercent: 0, left: '50%', top: '10%' },     // Projects: Top Center
    { xPercent: -100, yPercent: -100, left: '90%', top: '85%' }, // Certifications: Bottom Right
    { xPercent: -50, yPercent: -50, left: '50%', top: '50%' }    // Contact: Dead Center
  ];

  sections.forEach((el, index) => {
    if (layout[index]) {
      gsap.set(el, layout[index]);
    }
  });
  
  // Create a master timeline linked to the scroll container
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth scrubbing
    }
  });

  // Helper to get camera target position (slightly backed off from the node)
  const getCamPos = (node) => {
    return {
      x: node.x,
      y: node.y,
      z: node.z + 200 // Camera stops 200 units in front of the node
    };
  };

  // Initial State: Hero Section is visible at Node 0
  camera.position.copy(getCamPos(specialNodes[0]));
  gsap.set(sections[0], { autoAlpha: 1, scale: 1 });

  // Build the flight path
  for (let i = 0; i < sections.length - 1; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];
    const nextNode = specialNodes[i + 1];
    const nextCamPos = getCamPos(nextNode);

    // 1. Fade out current section and shrink its 3D box
    tl.to(currentSection, {
      autoAlpha: 0,
      scale: 1.5, // Zooms past the camera
      duration: 1,
      ease: 'power2.in'
    }, `stage${i}`);

    // 2. Move camera to the next node
    tl.to(camera.position, {
      x: nextCamPos.x,
      y: nextCamPos.y,
      z: nextCamPos.z,
      duration: 3,
      ease: 'power1.inOut'
    }, `stage${i}`);
    
    // Also rotate camera slightly for a cool banking effect during flight
    tl.to(camera.rotation, {
      z: (Math.random() - 0.5) * 0.5,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    }, `stage${i}`);

    // 3. Fade in next section once camera arrives AND expand its 3D box
    tl.to(nextSection, {
      autoAlpha: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.5)'
    }, `stage${i}+=2.5`);
  }

}, 100);

// Navbar Scroll Effect (Simplified)
const navbar = document.querySelector('.navbar');
navbar.style.background = 'rgba(10, 10, 15, 0.5)';
