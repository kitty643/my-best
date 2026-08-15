document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dynamic Particle System (Canvas) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 2.5 + 1;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = Math.random() > 0.5 ? '#ff758c' : '#9b51e0';
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles (keep low count for mobile smooth GPU performance)
    const particleCount = window.innerWidth < 600 ? 30 : 55;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- 2. Interactive Tap Sparkle Burst ---
    const burstContainer = document.getElementById('burst-container');
    window.addEventListener('click', (e) => {
        createSparkleBurst(e.clientX, e.clientY);
    });

    function createSparkleBurst(x, y) {
        for (let i = 0; i < 6; i++) {
            const el = document.createElement('div');
            el.innerHTML = '✨';
            el.style.position = 'absolute';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.fontSize = (Math.random() * 14 + 10) + 'px';
            el.style.pointerEvents = 'none';
            el.style.transition = 'all 0.8s ease-out';
            burstContainer.appendChild(el);

            const destX = x + (Math.random() - 0.5) * 100;
            const destY = y + (Math.random() - 0.5) * 100 - 30;

            requestAnimationFrame(() => {
                el.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0)`;
                el.style.opacity = '0';
            });

            setTimeout(() => el.remove(), 800);
        }
    }

    // --- 3. Audio & Start Gateway ---
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const bgMusic = document.getElementById('bg-music');
    const audioControl = document.getElementById('audio-control');
    const musicToggle = document.getElementById('music-toggle');

    startBtn.addEventListener('click', () => {
        bgMusic.play().catch(err => console.log("Audio autoplay prevented:", err));
        startScreen.classList.add('fade-out');
        audioControl.classList.remove('hidden');
    });

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        }
    });

    // --- 4. Photo Journey (Preloading & Captions) ---
    const captions = [
        "Herda herdai maya basyo...",
        "Timro yo pyaaro muskuraahat...",
        "Kati sundar kura haru...",
        "Timro sabai bhanda pyaro smile!",
        "Quiet moments, pure elegance.",
        "Always bringing light wherever you go.",
        "Every single view is breathtaking.",
        "Yo moments haru sadhai khas chhan.",
        "Timro style, timro vibe... unbeatable!",
        "Pure grace in every single look.",
        "Ekdamai pyari Aakriti ❤️",
        "Sparkles everywhere you go ✨",
        "Simple, sweet, and mesmerizing.",
        "Timile garda din nai ramro hunchha.",
        "Mero sabai bhanda pyari Princess 👑"
    ];

    // Preload all 15 images into browser cache to eliminate lag
    const preloadedImages = [];
    for (let i = 1; i <= 15; i++) {
        const img = new Image();
        img.src = `image${i}.jpg`;
        preloadedImages.push(img);
    }

    let currentIndex = 1;
    const journeyImg = document.getElementById('journey-img');
    const photoCaption = document.getElementById('photo-caption');
    const photoCounter = document.getElementById('photo-counter');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function renderPhoto(index) {
        journeyImg.style.opacity = '0.3';
        journeyImg.style.transform = 'scale(0.96)';

        setTimeout(() => {
            journeyImg.src = `image${index}.jpg`;
            
            // Fallback error handler if image name missing
            journeyImg.onerror = () => {
                journeyImg.src = `image1.jpg`; // Fallback to image1
            };

            photoCaption.textContent = captions[index - 1] || "Aakriti ✨";
            const formattedIndex = index < 10 ? `0${index}` : index;
            photoCounter.textContent = `${formattedIndex} / 15`;
            progressBarFill.style.width = `${(index / 15) * 100}%`;

            journeyImg.style.opacity = '1';
            journeyImg.style.transform = 'scale(1)';
        }, 250);
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex >= 15 ? 1 : currentIndex + 1;
        renderPhoto(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex <= 1 ? 15 : currentIndex - 1;
        renderPhoto(currentIndex);
    });

    // Touch Swipe Support for Mobile
    const swipeArea = document.getElementById('swipe-area');
    let touchStartX = 0;
    let touchEndX = 0;

    swipeArea.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    swipeArea.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 40) {
            nextBtn.click();
        } else if (touchEndX > touchStartX + 40) {
            prevBtn.click();
        }
    }

    // --- 5. Little Things Popup Notes ---
    const thingCards = document.querySelectorAll('.thing-card');
    const popup = document.getElementById('thing-note-popup');
    const popupText = document.getElementById('note-popup-text');

    thingCards.forEach(card => {
        card.addEventListener('click', () => {
            const note = card.getAttribute('data-note');
            popupText.textContent = note;
            popup.classList.remove('hidden');

            // Bounce animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = 'scale(1)', 200);
        });
    });

    // --- 6. Playroom Interactions ---
    
    // Food Question
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const foodResponse = document.getElementById('food-response');

    btnYes.addEventListener('click', () => {
        foodResponse.textContent = "Yay! Timi dherai ramro chhau! 🥰 Full stomach, happy mind!";
        btnYes.style.transform = "scale(1.05)";
    });

    let noClickCount = 0;
    btnNo.addEventListener('click', () => {
        noClickCount++;
        if (noClickCount === 1) {
            foodResponse.textContent = "Ehh Kali 😭 feri socha na...";
            btnNo.textContent = "Feri Socha 🥺";
        } else {
            foodResponse.textContent = "Huss hunxa! Timi nai khau sabai! ❤️";
            btnNo.textContent = "Okay fine 💕";
        }
    });

    // Photo Question Buttons
    const photoOptBtns = document.querySelectorAll('.photo-opt-btn');
    const photoResponse = document.getElementById('photo-response');

    photoOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const reply = btn.getAttribute('data-reply');
            photoResponse.textContent = reply;
        });
    });

    // Love Meter Typing Analyzer
    const loveInput = document.getElementById('love-input');
    const meterFill = document.getElementById('meter-fill');
    const reactionEmoji = document.getElementById('reaction-emoji');
    const reactionText = document.getElementById('reaction-text');

    loveInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const len = val.length;

        let fillPct = Math.min(len * 6, 100);
        meterFill.style.width = fillPct + '%';

        if (len === 0) {
            reactionEmoji.textContent = '💭';
            reactionText.textContent = 'Type something sweet...';
        } else if (len < 8) {
            reactionEmoji.textContent = '🥺';
            reactionText.textContent = 'Aali ali matrai? Feri lekha na!';
        } else if (len < 20) {
            reactionEmoji.textContent = '💖';
            reactionText.textContent = 'Aww, dherai maya! Keeping it growing...';
        } else {
            reactionEmoji.textContent = '👑';
            reactionText.textContent = 'Infinite Maya! Mero Princess sab bhanda pyari!';
            meterFill.style.width = '100%';
        }
    });

    // --- 7. Secret Envelope ---
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
    });

    // --- 8. Intersection Observer for Scroll Reveals ---
    const observeElements = document.querySelectorAll('.observe-me');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    observeElements.forEach(el => observer.observe(el));

    // --- 9. Cinematic Finale Sequence ---
    const finaleSection = document.getElementById('finale');
    const finaleSteps = document.querySelectorAll('.finale-step');
    let finaleTriggered = false;

    const finaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !finaleTriggered) {
                finaleTriggered = true;
                runFinale();
            }
        });
    }, { threshold: 0.4 });

    finaleObserver.observe(finaleSection);

    function runFinale() {
        // Step 1: Wait...
        finaleSteps[0].classList.add('active');

        setTimeout(() => {
            finaleSteps[0].classList.remove('active');

            setTimeout(() => {
                // Step 2: Aakriti, euta kura bhanna birsechu...
                finaleSteps[1].classList.add('active');

                setTimeout(() => {
                    finaleSteps[1].classList.remove('active');

                    setTimeout(() => {
                        // Step 3: Reveal Best Photo & Final Message
                        finaleSteps[2].classList.add('active');
                        createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
                    }, 1200);

                }, 3000);

            }, 1000);

        }, 2800);
    }
});
