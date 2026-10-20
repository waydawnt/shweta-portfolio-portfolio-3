document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. KLEAR-STYLE CUSTOM CURSOR
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, .magnetic, .work-row');

    if (window.innerWidth >= 768) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        const magnetics = document.querySelectorAll('.magnetic');
        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // ==========================================
    // 2. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.getElementById('loader-text');

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                initTanishaHero();
            }, 400);
        }
        loaderBar.style.width = `${progress}%`;
        loaderText.textContent = `${Math.floor(progress)}%`;
    }, 130);

    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });

    // ==========================================
    // 3. TANISHA STYLE ROTATING TYPOGRAPHY HERO
    // ==========================================
    function initTanishaHero() {
        const heroSection = document.querySelector(".t-hero");
        if (!heroSection) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".t-hero",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        const letters = document.querySelectorAll('.t-letter:not(.space)');
        const spaces = document.querySelectorAll('.t-letter.space');
        const centerImg = document.querySelector('.t-center-img');

        if (spaces.length > 0) {
            tl.to(spaces, { opacity: 0, duration: 0.1 }, 0);
        }

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = window.innerWidth < 768 ? 130 : 250;

        letters.forEach((letter, i) => {
            const rect = letter.getBoundingClientRect();
            const letterX = rect.left + rect.width / 2;
            const letterY = rect.top + rect.height / 2;

            const angleDeg = (i / letters.length) * 360 - 90;
            const angleRad = angleDeg * (Math.PI / 180);

            const targetX = centerX + Math.cos(angleRad) * radius;
            const targetY = centerY + Math.sin(angleRad) * radius;

            tl.to(letter, {
                x: targetX - letterX,
                y: targetY - letterY,
                rotation: angleDeg + 90, 
                ease: "power2.inOut"
            }, 0);
        });

        tl.to(centerImg, {
            scale: 1,
            ease: "power2.inOut"
        }, 0);
    }

    // ==========================================
    // 4. IMAGE FADE IN & TEXT REVEAL
    // ==========================================
    const revealTexts = document.querySelectorAll(".reveal-text");
    revealTexts.forEach((text) => {
        gsap.fromTo(text, 
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: text, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });

    const revealImgs = document.querySelectorAll(".reveal-img");
    revealImgs.forEach((img) => {
        gsap.fromTo(img, 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: img, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });

    // ==========================================
    // 5. PROJECT LIST HOVER IMAGE REVEAL
    // ==========================================
    const workRows = document.querySelectorAll(".work-row");
    const previewImg = document.getElementById("preview-img");
    let currentImage = "";

    ScrollTrigger.create({
        trigger: ".wire-work",
        start: "top 60%",
        onEnter: () => {
            if (previewImg && previewImg.style.opacity !== "1") {
                gsap.to(previewImg, { opacity: 1, duration: 0.5 });
            }
        }
    });

    workRows.forEach(row => {
        row.addEventListener("mouseenter", () => {
            const newImage = row.getAttribute("data-image");
            if (newImage !== currentImage && previewImg) {
                currentImage = newImage;
                gsap.to(previewImg, {
                    opacity: 0, 
                    duration: 0.2, 
                    onComplete: () => {
                        previewImg.src = newImage;
                        gsap.to(previewImg, { opacity: 1, duration: 0.3 });
                    }
                });
            }
        });
    });

    // ==========================================
    // 6. CINEMATIC PARALLAX EFFECT
    // ==========================================
    if (window.innerWidth >= 768) {
        gsap.to(".parallax-img", {
            yPercent: 30, // Moves the image down slightly as you scroll past
            ease: "none",
            scrollTrigger: {
                trigger: ".wire-showcase",
                start: "top bottom", // Starts when top of section hits bottom of viewport
                end: "bottom top",   // Ends when bottom of section hits top of viewport
                scrub: true
            }
        });
    }

    // ==========================================
    // 7. SMOOTH ANCHOR SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            
            const navHeight = document.querySelector('.wire-nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
});