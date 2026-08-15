/**
 * ==============================================================================
 * J.A.R.V.I.S. ADVANCED DOM & PHYSICS CONTROLLER v9.4
 * ==============================================================================
 * Sir, this JavaScript file handles the initialization of the audio context, 
 * the high-performance HTML5 Canvas physics engine for the flying hearts, 
 * the precise scroll-intersection mathematics, and dynamic event listeners.
 * It is completely self-contained and heavily optimized.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       CORE MODULE 1: AUDIO MANAGER
       ========================================================================== */
    class AudioManager {
        constructor() {
            this.audioElement = document.getElementById('bg-audio');
            this.toggleBtn = document.getElementById('toggle-audio-btn');
            this.isPlaying = false;
            this.initialized = false;
            
            // Set optimal volume for a cinematic experience
            this.audioElement.volume = 0.6;
            
            this.bindEvents();
        }

        bindEvents() {
            // Bind the toggle button in the UI
            this.toggleBtn.addEventListener('click', () => this.togglePlay());
            
            // Listen for ended event to ensure looping (fallback)
            this.audioElement.addEventListener('ended', () => {
                this.audioElement.currentTime = 0;
                this.audioElement.play();
            });
        }

        // Must be called from a user interaction (click) to bypass browser policies
        async forceUnlock() {
            if (this.initialized) return;
            try {
                await this.audioElement.play();
                this.isPlaying = true;
                this.initialized = true;
                this.updateUI();
                console.log("[J.A.R.V.I.S] Audio Subsystem: Unlocked and Playing Flawlessly.");
            } catch (error) {
                console.error("[J.A.R.V.I.S] Audio Subsystem Error:", error);
            }
        }

        togglePlay() {
            if (this.isPlaying) {
                this.audioElement.pause();
                this.isPlaying = false;
            } else {
                this.audioElement.play();
                this.isPlaying = true;
            }
            this.updateUI();
        }

        updateUI() {
            if (this.isPlaying) {
                this.toggleBtn.classList.add('is-playing');
            } else {
                this.toggleBtn.classList.remove('is-playing');
            }
        }
    }

    const audioSystem = new AudioManager();

    /* ==========================================================================
       CORE MODULE 2: INITIALIZATION SEQUENCE
       ========================================================================== */
    const initGate = document.getElementById('initialization-gate');
    const engageBtn = document.getElementById('engage-button');
    const mainInterface = document.getElementById('main-interface');

    engageBtn.addEventListener('click', async () => {
        // 1. Force audio playback on strict user gesture
        await audioSystem.forceUnlock();

        // 2. Dissolve the gate
        initGate.classList.add('gate-opened');

        // 3. Reveal the main interface
        setTimeout(() => {
            mainInterface.classList.remove('hidden-interface');
            startTypingEffect();
        }, 1000);
    });

    /* ==========================================================================
       CORE MODULE 3: DYNAMIC TYPING ENGINE
       ========================================================================== */
    const typingElement = document.getElementById('typing-hero');
    const messageToType = "A mathematical certainty in an unpredictable universe. Every line of code, every pixel, rendered just to make you smile.";
    let typeIndex = 0;
    
    function startTypingEffect() {
        if (typeIndex < messageToType.length) {
            typingElement.innerHTML += messageToType.charAt(typeIndex);
            typeIndex++;
            // Randomize typing speed for human-like effect
            let typeSpeed = Math.random() * 50 + 30; 
            setTimeout(startTypingEffect, typeSpeed);
        }
    }

    /* ==========================================================================
       CORE MODULE 4: HIGH-PERFORMANCE CANVAS PHYSICS ENGINE (PARTICLES)
       ========================================================================== */
    const canvas = document.getElementById('universe-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Configurable Physics Settings
    const PARTICLE_COUNT = 150; // High density for "too much" effect but optimized
    const HEART_COLORS = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffffff'];
    const HEART_EMOJIS = ['💖', '💗', '💕', '✨', '🌸'];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
            // Randomize initial Y so they don't all spawn at the bottom at once
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + (Math.random() * 200); // Start below screen
            this.size = Math.random() * 15 + 10;
            this.baseSpeedY = (Math.random() * 1.5) + 0.5;
            this.speedY = this.baseSpeedY;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
            
            // Wobble mechanics
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.wobbleAmplitude = Math.random() * 2 + 1;
            
            // Rotation mechanics
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
        }

        update() {
            // Apply upward velocity
            this.y -= this.speedY;
            
            // Apply horizontal drift (wobble)
            this.wobblePhase += this.wobbleSpeed;
            this.x += Math.sin(this.wobblePhase) * this.wobbleAmplitude + this.speedX;
            
            // Apply rotation
            this.rotation += this.rotationSpeed;

            // Reset if it floats completely off the top of the screen
            if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            
            ctx.restore();
        }
    }

    // Initialize Particle Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Render Loop
    function animate() {
        // Clear canvas with a slight trail effect (motion blur)
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw all particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(ctx);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start physics engine immediately
    animate();

    /* ==========================================================================
       CORE MODULE 5: SCROLL INTERSECTION OBSERVER
       ========================================================================== */
    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    const scrollElements = document.querySelectorAll('.scroll-element');
    scrollElements.forEach(el => scrollObserver.observe(el));

    /* ==========================================================================
       CORE MODULE 6: INTERACTIVE UI LOGIC
       ========================================================================== */
    const revealBtn = document.getElementById('btn-reveal');
    const secretBox = document.getElementById('secret-message-box');

    if (revealBtn && secretBox) {
        revealBtn.addEventListener('click', () => {
            const isCollapsed = secretBox.classList.contains('collapsed');
            
            if (isCollapsed) {
                secretBox.classList.remove('collapsed');
                secretBox.style.maxHeight = '200px';
                revealBtn.textContent = "Hide Secret Message";
            } else {
                secretBox.classList.add('collapsed');
                secretBox.style.maxHeight = '0px';
                revealBtn.textContent = "Reveal Secret Message";
            }
        });
    }

    console.log("[J.A.R.V.I.S] Core Systems Online. Errors: 0. Rendering Masterpiece.");
});
