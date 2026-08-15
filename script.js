document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Audio & Start Screen ---
    const startScreen = document.getElementById('start-screen');
    const bgMusic = document.getElementById('bg-music');
    const mainContent = document.getElementById('main-content');

    startScreen.addEventListener('click', () => {
        bgMusic.play().catch(e => console.log("Audio play blocked by browser:", e));
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.style.display = 'none';
        }, 1000);
    });

    // --- 2. Scroll Animations (Intersection Observer) ---
    const observeElements = document.querySelectorAll('.observe-me');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after revealing to keep it visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observeElements.forEach(el => scrollObserver.observe(el));


    // --- 3. Cinematic Photo Journey (1 to 15) ---
    const totalPhotos = 15;
    let currentPhotoIndex = 1;
    const journeyImg = document.getElementById('journey-img');
    const photoCounter = document.getElementById('photo-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function updatePhoto(direction) {
        // Fade out slightly
        journeyImg.style.opacity = '0.4';
        journeyImg.style.transform = direction === 'next' ? 'scale(1.05) translateX(10px)' : 'scale(1.05) translateX(-10px)';
        
        setTimeout(() => {
            journeyImg.src = `image${currentPhotoIndex}.jpg`;
            // Format counter e.g., 01 — 15
            const formattedNum = currentPhotoIndex < 10 ? `0${currentPhotoIndex}` : currentPhotoIndex;
            photoCounter.textContent = `${formattedNum} — 15`;
            
            // Fade back in
            journeyImg.style.opacity = '1';
            journeyImg.style.transform = 'scale(1) translateX(0)';
        }, 400); // Wait for fade out
    }

    nextBtn.addEventListener('click', () => {
        currentPhotoIndex = currentPhotoIndex >= totalPhotos ? 1 : currentPhotoIndex + 1;
        updatePhoto('next');
    });

    prevBtn.addEventListener('click', () => {
        currentPhotoIndex = currentPhotoIndex <= 1 ? totalPhotos : currentPhotoIndex - 1;
        updatePhoto('prev');
    });


    // --- 4. Micro-Interactions ---
    
    // Interaction 1: Khana dinxau?
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const noResponse = document.getElementById('no-response');

    btnNo.addEventListener('click', () => {
        noResponse.classList.add('show');
        // Playful logic: move button slightly or change text
        btnNo.textContent = "Sure haina?";
        setTimeout(() => { btnNo.textContent = "No"; }, 2000);
    });

    btnYes.addEventListener('click', () => {
        btnYes.textContent = "Yay! ❤️";
        noResponse.classList.remove('show');
    });

    // Interaction 2: Photo pathaune
    const sendPhotoBtn = document.getElementById('send-photo-btn');
    sendPhotoBtn.addEventListener('click', () => {
        sendPhotoBtn.textContent = "I'm waiting... ✨";
        sendPhotoBtn.style.background = "var(--accent-pink)";
    });

    // Interaction 3: Kati maya garxau
    const loveInput = document.getElementById('love-input');
    const loveMeter = document.getElementById('love-meter');
    const loveReaction = document.getElementById('love-reaction');

    loveInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        // Fake dynamic meter
        let width = Math.min(length * 5, 100);
        loveMeter.style.width = width + '%';

        if (width > 80) {
            loveReaction.textContent = "Infinity and beyond ✨";
            loveReaction.classList.add('show');
        } else {
            loveReaction.classList.remove('show');
        }
    });


    // --- 5. Secret Envelope ---
    const envelope = document.getElementById('secret-envelope');
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
    });


    // --- 6. Cinematic Finale Sequence ---
    const finaleSection = document.getElementById('finale');
    const steps = [
        document.querySelector('.step-1'),
        document.querySelector('.step-2'),
        document.querySelector('.step-3')
    ];
    let sequenceTriggered = false;

    const finaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sequenceTriggered) {
                sequenceTriggered = true;
                runFinaleSequence();
            }
        });
    }, { threshold: 0.5 });

    finaleObserver.observe(finaleSection);

    function runFinaleSequence() {
        // Step 1: "Wait..."
        steps[0].classList.add('active');
        
        setTimeout(() => {
            steps[0].classList.remove('active');
            
            // Step 2: "Aakriti, euta kura bhanna birsechu..."
            setTimeout(() => {
                steps[1].classList.add('active');
                
                setTimeout(() => {
                    steps[1].classList.remove('active');
                    
                    // Step 3: Best photo & "I Love You, My Princess"
                    setTimeout(() => {
                        steps[2].classList.add('active');
                        // Optional: slightly increase music volume or add a glowing effect
                    }, 2000);
                    
                }, 3500); // Time for step 2 to show
                
            }, 1500); // Pause between 1 and 2
            
        }, 3000); // Time for step 1 to show
    }

});
