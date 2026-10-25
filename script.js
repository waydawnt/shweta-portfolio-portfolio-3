document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. LIVE TIME IN HEADER
    // ==========================================
    const timeEl = document.getElementById('live-time');
    function updateClock() {
        if (!timeEl) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        timeEl.textContent = `${hours}:${mins}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // ==========================================
    // 1. KLEAR-STYLE CUSTOM CURSOR & MAGNETIC BUTTONS
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, .magnetic, .sprint-mac-window');

    if (window.innerWidth >= 768) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // ==========================================
    // 2. MASTER OPENING SEQUENCE:
    //    Step 1: Dark to light opening (Preloader slides DOWN)
    //    Step 2: 2.5D Image loads/forms itself FIRST
    //    Step 3: Grid lines draw one by one (Top -> Right -> Left)
    //    Step 4: "Hello, I'm Shweta" + First Cohesion trait slide up smoothly
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderName = document.getElementById('preloader-name');
    const cohesionItems = document.querySelectorAll('.cohesion-item');

    gsap.set(".k-line-top", { width: "0%" });
    gsap.set(".k-line-right", { height: "0%" });
    gsap.set(".k-line-left", { height: "0%" });
    gsap.set(".klear-nav-item", { y: -15, opacity: 0 });
    gsap.set(".hero-title-slide", { y: "115%", opacity: 0 });
    gsap.set(".hero-text-fade", { y: 20, opacity: 0 });
    gsap.set(cohesionItems, { y: "115%", opacity: 0 });

    const masterTl = gsap.timeline();

    // STEP 1: Fade name & slide dark curtain DOWN
    masterTl.to(preloaderName, {
        opacity: 0, y: -10, duration: 0.4, delay: 0.5, ease: "power2.in"
    })
    .to(preloader, {
        yPercent: 100, duration: 0.9, ease: "power4.inOut",
        onComplete: () => {
            document.body.classList.remove('is-loading');
            preloader.style.display = 'none';
        }
    })

    // STEP 2: Let the 2.5D Image form itself FIRST
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

    // STEP 3: Grid lines draw one by one (Top -> Right -> Left)
    .to(".header-draw-line, .hero-bottom-line", {
        scaleX: 1, duration: 0.7, ease: "power3.inOut"
    }, "-=0.4")
    .to(".k-line-top", { width: "100%", duration: 0.5, ease: "power2.out" }, "-=0.5")
    .to(".k-line-right", { height: "100%", duration: 0.5, ease: "power2.out" }, "-=0.35")
    .to(".k-line-left", { height: "100%", duration: 0.5, ease: "power2.out" }, "-=0.35")
    .to(".klear-nav-item", {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out"
    }, "-=0.5")

    // STEP 4: "Hello, I'm Shweta" & First Cohesion Trait slide up smoothly
    .to(".hero-title-slide", {
        y: "0%", opacity: 1, duration: 0.8, stagger: 0.12, ease: "power4.out"
    }, "-=0.3")
    .to(".hero-text-fade", {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out"
    }, "-=0.5")
    .to(cohesionItems[0], {
        y: "0%", opacity: 1, duration: 0.7, ease: "power4.out",
        onComplete: startCohesionCycle
    }, "-=0.45");

    // Top Blue Progress Line
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
    // 4. KLEAR SCROLL PARALLAX ON HERO TEXT + 2.5D HOVER
    // ==========================================
    gsap.to("#scroll-move-right", {
        x: 90,
        ease: "none",
        scrollTrigger: {
            trigger: ".razor-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }
    });

    gsap.to("#scroll-move-left", {
        x: -90,
        ease: "none",
        scrollTrigger: {
            trigger: ".razor-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }
    });

    if (window.innerWidth >= 768) {
        const interactiveContainers = document.querySelectorAll('.interactive-container');
        interactiveContainers.forEach(container => {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                container.querySelectorAll('.p-layer').forEach(img => {
                    const depth = parseFloat(img.getAttribute('data-mouse-depth')) || 0.05;
                    gsap.to(img, { 
                        x: (e.clientX - centerX) * depth, 
                        y: (e.clientY - centerY) * depth, 
                        duration: 0.45, 
                        ease: "power2.out" 
                    });
                });

                const interactiveText = container.querySelector('.interactive-text');
                if (interactiveText) {
                    gsap.to(interactiveText, { 
                        x: (e.clientX - centerX) * 0.012, 
                        y: (e.clientY - centerY) * 0.012, 
                        rotationX: ((e.clientY - centerY) / centerY) * -1.5, 
                        rotationY: ((e.clientX - centerX) / centerX) * 1.5, 
                        transformPerspective: 1000, 
                        duration: 0.45, 
                        ease: "power2.out" 
                    });
                }
            });

            container.addEventListener('mouseleave', () => {
                gsap.to(container.querySelectorAll('.p-layer'), { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
                const interactiveText = container.querySelector('.interactive-text');
                if (interactiveText) gsap.to(interactiveText, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.8, ease: "power2.out" });
            });
        });

        // Interactive 2.5D Motion inside Razorpay OS Window
        document.querySelectorAll('.sprint-mac-window').forEach(win => {
            const img = win.querySelector('.mac-move-img');
            const card = win.querySelector('.mac-floating-card');
            const pill = win.querySelector('.mac-floating-pill');
            win.addEventListener('mousemove', (e) => {
                const rect = win.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2);
                if (img) gsap.to(img, { x: x * 0.03, y: y * 0.03, scale: 1.03, duration: 0.35, ease: "power2.out" });
                if (card) gsap.to(card, { x: x * -0.04, y: y * -0.04, duration: 0.35, ease: "power2.out" });
                if (pill) gsap.to(pill, { x: x * 0.05, y: y * -0.03, duration: 0.35, ease: "power2.out" });
            });
            win.addEventListener('mouseleave', () => {
                if (img) gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
                if (card) gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
                if (pill) gsap.to(pill, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
            });
        });
    }

    // ==========================================
    // 5. AUTOMATIC SCROLLSPY FOR PROJECTS TOP BAR & BLUE STAGE FILL
    // ==========================================
    const projectStages = document.querySelectorAll('.sprint-project-stage');
    const sprintTabs = document.querySelectorAll('.sprint-tab');

    function activateProject(index) {
        sprintTabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });
        projectStages.forEach((stage, i) => {
            stage.classList.toggle('active-stage', i === index);
        });
    }

    projectStages.forEach((stage, index) => {
        ScrollTrigger.create({
            trigger: stage,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => activateProject(index),
            onEnterBack: () => activateProject(index)
        });
    });

    // ==========================================
    // 6. SCROLL REVEALS & LEFT-TO-RIGHT LINE DIFFERENTIATORS
    // ==========================================
    gsap.utils.toArray(".scroll-draw-line").forEach(line => {
        gsap.to(line, {
            scaleX: 1, duration: 0.9, ease: "power3.inOut",
            scrollTrigger: { trigger: line, start: "top 90%", toggleActions: "play none none reverse" }
        });
    });

    document.querySelectorAll(".reveal-text").forEach((text) => {
        gsap.fromTo(text, { y: 35, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 86%", toggleActions: "play none none reverse" }
        });
    });

    // ==========================================
    // 7. SMOOTH ANCHOR SCROLLING (Accounts for Sticky Header + Sticky Project Bar)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            
            const headerHeight = document.querySelector('.klear-header')?.offsetHeight || 68;
            const sprintBar = document.querySelector('.sprint-top-bar');
            const isProjectLink = id.startsWith('#proj-');
            const extraOffset = (isProjectLink && sprintBar) ? sprintBar.offsetHeight : 0;
            
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
});