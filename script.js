document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ZERO-LAG CANVAS HEART EMITTER ---
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];
    const heartEmojis = ['💖', '💗', '💕', '💞', '🩷', '💘'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class FlyingHeart {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Initial random spread
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 20 + 15;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y / 50) * this.speedX; // Gentle sway
            if (this.y < -50) this.reset();
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px Arial`;
            ctx.fillText(this.emoji, this.x, this.y);
        }
    }

    // Spawn an overwhelming but smooth amount of hearts
    const heartCount = window.innerWidth < 600 ? 80 : 150;
    for (let i = 0; i < heartCount; i++) {
        hearts.push(new FlyingHeart());
    }

    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            h.update();
            h.draw();
        });
        requestAnimationFrame(animateHearts);
    }
    animateHearts();

    // --- 2. START SCREEN & AUDIO ---
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const bgMusic = document.getElementById('bg-music');

    startBtn.addEventListener('click', () => {
        bgMusic.play().catch(() => {});
        startScreen.classList.add('fade-out');
    });

    // --- 3. PHOTO JOURNEY ENGINE ---
    const captions = [
        "Herda herdai maya basyo...", "Timro yo pyaaro muskuraahat...", "Kati sundar kura haru...",
        "Timro sabai bhanda pyaro smile!", "Quiet moments, pure elegance.", "Always bringing light.",
        "Every single view is breathtaking.", "Yo moments haru sadhai khas.", "Timro style, timro vibe!",
        "Pure grace in every single look.", "Ekdamai pyari Aakriti ❤️", "Sparkles everywhere ✨",
        "Simple, sweet, and mesmerizing.", "Timile garda din nai ramro hunchha.", "Mero sabai bhanda pyari Princess 👑"
    ];

    let currentIndex = 1;
    const journeyImg = document.getElementById('journey-img');
    const photoCaption = document.getElementById('photo-caption');
    const photoCounter = document.getElementById('photo-counter');
    const progressBarFill = document.getElementById('progress-bar-fill');

    function renderPhoto(index) {
        journeyImg.style.opacity = '0.3';
        setTimeout(() => {
            journeyImg.src = `image${index}.jpg`;
            journeyImg.onerror = () => journeyImg.src = 'image1.jpg'; // Fallback
            photoCaption.textContent = captions[index - 1];
            photoCounter.textContent = `${index < 10 ? '0'+index : index} / 15`;
            progressBarFill.style.width = `${(index / 15) * 100}%`;
            journeyImg.style.opacity = '1';
        }, 200);
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex = currentIndex >= 15 ? 1 : currentIndex + 1;
        renderPhoto(currentIndex);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIndex = currentIndex <= 1 ? 15 : currentIndex - 1;
        renderPhoto(currentIndex);
    });

    // Mobile Swipe
    let touchStartX = 0;
    document.getElementById('swipe-area').addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    document.getElementById('swipe-area').addEventListener('touchend', e => {
        if (e.changedTouches[0].screenX < touchStartX - 40) document.getElementById('next-btn').click();
        if (e.changedTouches[0].screenX > touchStartX + 40) document.getElementById('prev-btn').click();
    });

    // --- 4. INTERACTIONS ---
    document.getElementById('btn-yes').addEventListener('click', (e) => {
        document.getElementById('food-response').textContent = "Yay! Full stomach, happy mind! 🥰";
    });
    
    document.getElementById('btn-no').addEventListener('click', (e) => {
        document.getElementById('food-response').textContent = "Ehh Kali 😭 feri socha na...";
    });

    document.getElementById('love-input').addEventListener('input', (e) => {
        const len = e.target.value.trim().length;
        document.getElementById('meter-fill').style.width = Math.min(len * 5, 100) + '%';
        const txt = document.getElementById('reaction-text');
        if(len === 0) txt.textContent = "Type something sweet...";
        else if(len < 10) txt.textContent = "Aali ali matrai? 🥺";
        else txt.textContent = "Infinite Maya! 👑💖";
    });

    document.getElementById('envelope').addEventListener('click', function() {
        this.classList.toggle('open');
    });

    // --- 5. SCROLL OBSERVER ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });

    document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));
});
