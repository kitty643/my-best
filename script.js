document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. BACKGROUND PARTICLES (Optimized for Memory) --- */
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 10 : 20; 
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }

    /* --- 2. AUDIO & VISUALIZER (60fps requestAnimationFrame) --- */
    const startBtn = document.getElementById('start-btn');
    const openingScreen = document.getElementById('opening');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const spinIcon = document.querySelector('.spin-icon');
    const visualizerBars = document.querySelectorAll('.bar');
    
    let isPlaying = false;
    let animationFrameId;
    let lastDrawTime = 0;

    function animateVisualizer(timestamp) {
        if (!isPlaying) return;
        
        // Limit updates to roughly 10fps for visual rhythm, keeping CPU usage near zero
        if (timestamp - lastDrawTime > 100) {
            visualizerBars.forEach(bar => {
                const height = Math.random() * 12 + 3;
                bar.style.height = `${height}px`;
            });
            lastDrawTime = timestamp;
        }
        animationFrameId = requestAnimationFrame(animateVisualizer);
    }

    function stopVisualizer() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        visualizerBars.forEach(bar => bar.style.height = '2px');
    }

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
            spinIcon.classList.remove('playing');
            stopVisualizer();
        } else {
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
                    spinIcon.classList.add('playing');
                    animationFrameId = requestAnimationFrame(animateVisualizer);
                }).catch(error => {
                    console.warn("Audio play blocked by browser. User interaction required.", error);
                    isPlaying = false; 
                });
            }
        }
        isPlaying = !isPlaying;
    }

    startBtn.addEventListener('click', () => {
        openingScreen.style.opacity = '0';
        
        setTimeout(() => {
            openingScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            bgMusic.volume = 0.5;
            toggleMusic(); 
            
            reveal();
            window.scrollTo(0, 0);
        }, 800);
    });

    playPauseBtn.addEventListener('click', toggleMusic);

    /* --- 3. SCROLL REVEAL (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // PERFORMANCE: Unobserve after revealing to save resources
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    function reveal() {
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* --- 4. PHOTO GALLERY (Images 1-6 with Next-Image Caching) --- */
    const galleryImages = [
        { src: 'image1.jpg', caption: 'Timi first time mero agadi aunda ko moment...' },
        { src: 'image2.jpg', caption: 'Yo smile le nai ta pagal banauxa malai.' },
        { src: 'image3.jpg', caption: 'Mero pyaro Bubu ❤️' },
        { src: 'image4.jpg', caption: 'Kati cute dekheki Kali.' },
        { src: 'image5.jpg', caption: 'Timro aakha haru maa dubna man lagxa.' },
        { src: 'image6.jpg', caption: 'Best day with my Princess.' }
    ];

    const gallerySlider = document.getElementById('gallery-slider');
    const photoCounter = document.getElementById('photo-counter');
    const photoCaption = document.getElementById('photo-caption');
    let currentPhotoIndex = 0;
    const imgElements = [];

    // Initialize gallery DOM
    galleryImages.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption;
        img.className = `gallery-img ${index === 0 ? 'active' : ''}`;
        
        // Priority loading for first image, lazy for the rest
        if (index === 0) img.setAttribute('fetchpriority', 'high');
        img.loading = index < 2 ? 'eager' : 'lazy'; 
        
        gallerySlider.appendChild(img);
        imgElements.push(img);
    });

    function updateGallery(newIndex) {
        imgElements[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = newIndex;
        imgElements[currentPhotoIndex].classList.add('active');
        
        // PERFORMANCE: Preload the upcoming image seamlessly in the background
        const nextIndex = (currentPhotoIndex + 1) % galleryImages.length;
        if (imgElements[nextIndex].loading === 'lazy') {
            imgElements[nextIndex].loading = 'eager'; // triggers browser to fetch if it hasn't
            const preloader = new Image();
            preloader.src = galleryImages[nextIndex].src;
        }
        
        photoCounter.innerText = `0${currentPhotoIndex + 1} / 0${galleryImages.length}`;
        photoCaption.style.opacity = 0;
        setTimeout(() => {
            photoCaption.innerText = galleryImages[currentPhotoIndex].caption;
            photoCaption.style.opacity = 1;
        }, 300);
    }

    document.getElementById('next-photo').addEventListener('click', () => {
        updateGallery((currentPhotoIndex + 1) % galleryImages.length);
    });

    document.getElementById('prev-photo').addEventListener('click', () => {
        updateGallery((currentPhotoIndex - 1 + galleryImages.length) % galleryImages.length);
    });

    // Swipe Support for mobile gallery (Passive listeners for scroll performance)
    let touchStartX = 0;
    gallerySlider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallerySlider.addEventListener('touchend', e => {
        let touchEndX = e.changedTouches[0].screenX;
        let swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance < -40) updateGallery((currentPhotoIndex + 1) % galleryImages.length);
        if (swipeDistance > 40) updateGallery((currentPhotoIndex - 1 + galleryImages.length) % galleryImages.length);
    }, { passive: true });

    /* --- 5. ENVELOPE INTERACTION --- */
    const envelope = document.getElementById('envelope');
    
    function openEnvelope() {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            document.getElementById('envelope-hint').innerText = "Read the message ❤️";
            document.getElementById('envelope-hint').style.animation = "none";
        }
    }

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
    });

    /* --- 6. DODGING "NO" BUTTON (Layout-Safe Bound Logic) --- */
    const btnNo = document.getElementById('food-no');
    const btnYes = document.getElementById('food-yes');
    const foodReaction = document.getElementById('food-reaction');
    const btnGroupFood = document.getElementById('btn-group-food');

    let moveCount = 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    function dodgeButton(e) {
        if (moveCount > 4) return; // Allows click eventually
        if (e && e.type !== 'touchstart') e.preventDefault();
        
        // Bound calculation to ensure it never causes overflow X
        const maxMoveX = isMobile ? 50 : 120;
        const maxMoveY = isMobile ? 40 : 80;

        // Force it to jump opposite to current general position to keep it centered over time
        const signX = Math.random() > 0.5 ? 1 : -1;
        const signY = Math.random() > 0.5 ? 1 : -1;
        
        const randomX = (Math.random() * maxMoveX * 0.8 + 20) * signX;
        const randomY = (Math.random() * maxMoveY * 0.8 + 20) * signY;
        
        btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
        moveCount++;
    }

    btnNo.addEventListener('mouseover', (e) => { if(!isMobile) dodgeButton(e); });
    btnNo.addEventListener('touchstart', (e) => { if(moveCount < 3) dodgeButton(e); }, {passive: true});

    btnYes.addEventListener('click', () => {
        foodReaction.innerText = "Yesss! Mero Bubu best xa ❤️";
        foodReaction.classList.remove('hidden');
        btnNo.style.transform = 'translate(0, 0)'; 
        btnNo.style.opacity = '0.5';
        btnNo.style.pointerEvents = 'none';
        btnYes.style.transform = 'scale(1.05)';
    });

    btnNo.addEventListener('click', () => {
        foodReaction.innerText = "Ehh Bubu 😭 ekchoti feri socha na...";
        foodReaction.classList.remove('hidden');
    });

    /* --- 7. PHOTO PROMISE --- */
    document.getElementById('photo-promise').addEventListener('click', (e) => {
        const reaction = document.getElementById('photo-reaction');
        reaction.innerText = "Yay! Ma wait garxu hai Princess ❤️";
        reaction.classList.remove('hidden');
        e.target.style.background = "var(--accent)";
        e.target.innerText = "Promised 🤞";
    });

    /* --- 8. LOVE METER --- */
    const loveSubmit = document.getElementById('love-submit');
    const loveInput = document.getElementById('love-input');
    const meterResult = document.getElementById('meter-result');
    const lovePercent = document.getElementById('love-percent');
    const loveFill = document.getElementById('love-fill');
    const loveMsg = document.getElementById('love-msg');

    loveSubmit.addEventListener('click', () => {
        if (loveInput.value.trim() === '') {
            loveInput.focus();
            return;
        }
        
        loveSubmit.classList.add('hidden');
        loveInput.disabled = true;
        meterResult.classList.remove('hidden');
        
        let count = 0;
        const target = 1000;
        
        const interval = setInterval(() => {
            count += 25;
            if (count >= target) {
                clearInterval(interval);
                lovePercent.innerText = "1000+";
                lovePercent.style.color = "var(--accent)";
                loveMsg.innerText = "System error! Timro maya measure nai garna sakidaina... Infinity ❤️";
            } else {
                lovePercent.innerText = count;
            }
        }, 50);

        setTimeout(() => {
            loveFill.style.width = '100%';
            loveFill.style.boxShadow = "0 0 15px var(--accent)";
        }, 100);
    });

    /* --- 9. PRINCESS QUIZ --- */
    const quizData = [
        { q: "Timro favourite ice cream?", options: ["Chocolate", "Vanilla", "Strawberry"], ans: 1 },
        { q: "Favourite food k ho?", options: ["Burger", "Momo", "Pizza"], ans: 2 },
        { q: "Favourite color?", options: ["Pink", "Blue", "Black"], ans: 0 }
    ];

    let currentQ = 0;
    let score = 0;
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');

    function loadQuestion() {
        if (currentQ >= quizData.length) {
            quizQuestion.innerText = `Quiz Finished!`;
            quizOptions.innerHTML = '';
            quizFeedback.innerText = score === quizData.length 
                ? "Perfect! Malai timro sabai kura tha xa ❤️" 
                : "Aww, tara malai thaxa timi sabai vanda best chau ❤️";
            return;
        }

        quizQuestion.innerText = quizData[currentQ].q;
        quizOptions.innerHTML = '';
        quizFeedback.innerText = '';

        quizData[currentQ].options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn glass-btn w-100';
            btn.innerText = opt;
            btn.addEventListener('click', () => handleQuizAnswer(index, btn));
            quizOptions.appendChild(btn);
        });
    }

    function handleQuizAnswer(selectedIndex, btnElement) {
        const allBtns = quizOptions.querySelectorAll('button');
        allBtns.forEach(b => b.style.pointerEvents = 'none'); 

        if (selectedIndex === quizData[currentQ].ans) {
            btnElement.classList.add('correct');
            quizFeedback.innerText = "Yesss! Right answer ❤️";
            quizFeedback.style.color = "#4caf50";
            score++;
        } else {
            btnElement.classList.add('wrong');
            allBtns[quizData[currentQ].ans].classList.add('correct');
            quizFeedback.innerText = "Oops! Tara thikai xa, you are still perfect 🥺";
            quizFeedback.style.color = "var(--text-muted)";
        }

        setTimeout(() => {
            currentQ++;
            loadQuestion();
        }, 1500);
    }

    loadQuestion(); 

    /* --- 10. REASONS (Flip Cards) --- */
    const reasonCards = document.querySelectorAll('.reason-card');
    
    function toggleCardFlip(card) {
        card.classList.toggle('flipped');
    }

    reasonCards.forEach(card => {
        card.addEventListener('click', () => toggleCardFlip(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCardFlip(card);
            }
        });
    });

    /* --- 11. FINAL SURPRISE & HEART BURST --- */
    const revealFinalBtn = document.getElementById('reveal-final');
    const finalSection = document.getElementById('final-section');
    const surpriseSection = document.getElementById('surprise');
    const replayBtn = document.getElementById('replay-btn');

    revealFinalBtn.addEventListener('click', () => {
        surpriseSection.classList.add('hidden');
        finalSection.classList.remove('hidden');
        
        setTimeout(() => {
            finalSection.classList.add('active'); 
            finalSection.style.opacity = 1;
            finalSection.style.transform = "translateY(0)";
            window.scrollTo({ top: finalSection.offsetTop - 50, behavior: 'smooth' });
            
            for(let i = 0; i < 20; i++) {
                setTimeout(createHeartBurst, i * 50); // Stagger particle creation for smooth FPS
            }
        }, 100);
    });

    function createHeartBurst() {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
        heart.style.position = 'absolute';
        heart.style.color = 'var(--accent)';
        heart.style.fontSize = `${Math.random() * 15 + 10}px`;
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none'; 
        
        document.body.appendChild(heart);
        
        const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
        const startY = window.scrollY + window.innerHeight - 150;
        
        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        
        const animation = heart.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 200 + 150}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 1200,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => heart.remove();
    }

    replayBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
