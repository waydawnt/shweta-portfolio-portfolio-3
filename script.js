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
                initRazorHero(); 
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
    // 3. RAZORPAY STYLE FADE-IN HERO
    // ==========================================
    function initRazorHero() {
        const heroSection = document.querySelector(".razor-hero");
        if (!heroSection) return;

        const tl = gsap.timeline();

        tl.fromTo(".fade-up", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );

        tl.fromTo(".fade-up-text",
            { y: "110%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" },
            "-=0.5"
        );
    }

// ==========================================
    // 4. MOUSE HOVER PARALLAX & 3D TEXT
    // ==========================================
    if (window.innerWidth >= 768) {
        const interactiveContainers = document.querySelectorAll('.interactive-container');
        interactiveContainers.forEach(container => {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 1. Move the image layers
                const layers = container.querySelectorAll('.p-layer-wrapper');
                layers.forEach(layer => {
                    const img = layer.querySelector('img');
                    if(!img) return;
                    
                    const depth = parseFloat(img.getAttribute('data-mouse-depth')) || 0.05;
                    const moveX = (e.clientX - centerX) * depth;
                    const moveY = (e.clientY - centerY) * depth;
                    
                    gsap.to(layer, { x: moveX, y: moveY, duration: 0.6, ease: "power2.out" });
                });

                // 2. Add 3D Tilt & Float to the Text
                const interactiveText = container.querySelector('.interactive-text');
                if (interactiveText) {
                    const moveX = (e.clientX - centerX) * 0.015; // Subtle float X
                    const moveY = (e.clientY - centerY) * 0.015; // Subtle float Y
                    
                    // Calculate subtle 3D rotation (max 2 degrees)
                    const rotateX = ((e.clientY - centerY) / centerY) * -2; 
                    const rotateY = ((e.clientX - centerX) / centerX) * 2;

                    gsap.to(interactiveText, { 
                        x: moveX, 
                        y: moveY, 
                        rotationX: rotateX, 
                        rotationY: rotateY, 
                        transformPerspective: 1000, // Gives the tilt real 3D depth
                        duration: 0.6, 
                        ease: "power2.out" 
                    });
                }
            });

            container.addEventListener('mouseleave', () => {
                const layers = container.querySelectorAll('.p-layer-wrapper');
                gsap.to(layers, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
                
                const interactiveText = container.querySelector('.interactive-text');
                if (interactiveText) {
                    gsap.to(interactiveText, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.8, ease: "power2.out" });
                }
            });
        });
    }

    // ==========================================
    // 5. IMAGE FADE IN & TEXT REVEAL
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

    // ==========================================
    // 6. PROJECT LIST HOVER IMAGE REVEAL
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