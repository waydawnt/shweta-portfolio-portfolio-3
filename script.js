document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. CUSTOM CURSOR (Desktop)
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .project-card');

    if (window.innerWidth > 1024 && cursor) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // ==========================================
    // 2. MASTER OPENING SEQUENCE
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderName = document.getElementById('preloader-name');
    const cohesionItems = document.querySelectorAll('.cohesion-item');

    gsap.set(".klear-nav-item", { y: -12, opacity: 0 });
    gsap.set(".hero-title-slide", { y: "115%", opacity: 0 });
    gsap.set(".hero-text-fade", { y: 18, opacity: 0 });
    gsap.set(cohesionItems, { y: "115%", opacity: 0 });

    const masterTl = gsap.timeline();

    // STEP 1: Fade name & slide dark curtain DOWN
    masterTl.to(preloaderName, {
        opacity: 0, y: -10, duration: 0.4, delay: 0.45, ease: "power2.in"
    })
    .to(preloader, {
        yPercent: 100, duration: 0.85, ease: "power4.inOut",
        onComplete: () => {
            document.body.classList.remove('is-loading');
            preloader.style.display = 'none';
        }
    })

    // STEP 2: 2.5D Image forms itself FIRST (Moodboard -> Woman -> Desk)
    .fromTo(".layer-bg-wrap", 
        { opacity: 0, scale: 0.92, y: 35 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" },
        "-=0.2"
    )
    .fromTo(".layer-woman-wrap", 
        { opacity: 0, y: 80, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.3)" }, 
        "-=0.3"
    )
    .fromTo(".layer-desk-wrap", 
        { opacity: 0, y: 95 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: "power4.out" }, 
        "-=0.35"
    )

    // STEP 3: Header & Hero Divider Lines draw in
    .to(".header-draw-line, .hero-bottom-line", {
        scaleX: 1, duration: 0.7, ease: "power3.inOut"
    }, "-=0.4")
    .to(".klear-nav-item", {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out"
    }, "-=0.5")

    // STEP 4: "Hello! I'm Shweta." + Pillars + First Cohesion Trait slide up
    .to(".hero-title-slide", {
        y: "0%", opacity: 1, duration: 0.75, stagger: 0.1, ease: "power4.out"
    }, "-=0.3")
    .to(".hero-text-fade", {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out"
    }, "-=0.45")
    .to(cohesionItems[0], {
        y: "0%", opacity: 1, duration: 0.65, ease: "power4.out",
        onComplete: startCohesionCycle
    }, "-=0.4");

    // Top Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });

    // ==========================================
    // 3. COHESION CYCLING TEXT
    // ==========================================
    function startCohesionCycle() {
        if (!cohesionItems.length) return;
        let currentIndex = 0;

        setInterval(() => {
            const currentItem = cohesionItems[currentIndex];
            const nextIndex = (currentIndex + 1) % cohesionItems.length;
            const nextItem = cohesionItems[nextIndex];

            gsap.to(currentItem, {
                y: "-115%",
                opacity: 0,
                duration: 0.55,
                ease: "power3.inOut"
            });

            gsap.fromTo(nextItem,
                { y: "115%", opacity: 0 },
                { y: "0%", opacity: 1, duration: 0.55, ease: "power3.inOut" }
            );

            currentIndex = nextIndex;
        }, 2300);
    }

    // ==========================================
    // 4. 2.5D ILLUSTRATION PARALLAX (Hero Text Stays Aligned per Page 1 #7/#9)
    // ==========================================
    const interactiveContainers = document.querySelectorAll('.interactive-container');
    interactiveContainers.forEach(container => {
        function moveLayers(clientX, clientY) {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            container.querySelectorAll('.p-layer').forEach(img => {
                const depth = parseFloat(img.getAttribute('data-mouse-depth')) || 0.05;
                gsap.to(img, {
                    x: (clientX - centerX) * depth,
                    y: (clientY - centerY) * depth,
                    duration: 0.45,
                    ease: "power2.out"
                });
            });
        }

        container.addEventListener('mousemove', (e) => moveLayers(e.clientX, e.clientY));
        container.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                moveLayers(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        container.addEventListener('mouseleave', () => {
            gsap.to(container.querySelectorAll('.p-layer'), { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        });
    });

    // Subtle breathing float on mobile/tablet
    if (window.innerWidth <= 1024) {
        gsap.to(".layer-woman-wrap .p-layer", {
            y: -6, x: 4, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(".layer-desk-wrap .p-layer", {
            y: 5, x: -5, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
    }

    // ==========================================
    // 5. SCROLL REVEALS & LEFT-TO-RIGHT LINE DIFFERENTIATORS
    // ==========================================
    gsap.utils.toArray(".scroll-draw-line").forEach(line => {
        gsap.to(line, {
            scaleX: 1, duration: 0.9, ease: "power3.inOut",
            scrollTrigger: { trigger: line, start: "top 90%", toggleActions: "play none none reverse" }
        });
    });

    document.querySelectorAll(".reveal-text").forEach((text) => {
        gsap.fromTo(text, { y: 28, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 88%", toggleActions: "play none none reverse" }
        });
    });

    // ==========================================
    // 6. FOOTER EMAIL CLICK FEEDBACK (Copies email + opens mail client)
    // ==========================================
    const emailCta = document.getElementById('email-cta');
    const emailBadge = document.getElementById('email-badge');
    if (emailCta && emailBadge) {
        emailCta.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('shweta_m@nid.edu');
            }
            emailBadge.textContent = 'Copied! ✓';
            setTimeout(() => {
                emailBadge.textContent = 'Write ↗';
            }, 2500);
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
            
            const headerHeight = document.querySelector('.klear-header')?.offsetHeight || 64;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
});