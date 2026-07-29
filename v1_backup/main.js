import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initThreeScene } from './three-scene.js';

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

  // Animate the outline with a slight delay for a smooth effect
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Hover effects for cursor
const hoverElements = document.querySelectorAll('a, .btn, .project-card, .edu-card, .timeline-content');
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

// Initial Page Load Animations
const tl = gsap.timeline();

tl.from('.logo', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
  .from('.nav-item', { y: -20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, "-=0.6")
  .from('.hero-greeting', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.4")
  .from('.hero-name', { y: 30, opacity: 0, duration: 1, ease: 'power4.out' }, "-=0.6")
  .from('.hero-title', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
  .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
  .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, "-=0.6");



// ScrollTrigger Animations for Sections
const sections = document.querySelectorAll('.section');

sections.forEach((section) => {
  gsap.from(section.querySelector('.section-title'), {
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// About Section Animation
gsap.from('.about-text p', {
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 85%',
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out'
});

gsap.from('.edu-card', {
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 85%',
  },
  x: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out'
});

// Skills Section Animation
gsap.from('.skill-category', {
  scrollTrigger: {
    trigger: '.skills-section',
    start: 'top 85%',
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out'
});

// Experience Timeline Animation
gsap.from('.timeline-item', {
  scrollTrigger: {
    trigger: '.exp-section',
    start: 'top 85%',
  },
  x: -50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out'
});

// Projects Section Animation
gsap.from('.project-card', {
  scrollTrigger: {
    trigger: '.projects-section',
    start: 'top 85%',
  },
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out'
});

// Certifications Section Animation
gsap.from('.cert-card', {
  scrollTrigger: {
    trigger: '.cert-section',
    start: 'top 85%',
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out'
});

// Contact Section Animation
gsap.from('.contact-card', {
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 85%',
  },
  scale: 0.8,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'back.out(1.7)'
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.padding = '1rem 5%';
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
  } else {
    navbar.style.padding = '1.5rem 5%';
    navbar.style.background = 'rgba(10, 10, 15, 0.8)';
  }
});
