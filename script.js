document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. INJECT & INITIALIZE CUSTOM FLOATING SCROLLBAR
    // ==========================================
    let customScrollbar = document.querySelector('.c-scrollbar');
    if (!customScrollbar) {
        customScrollbar = document.createElement('div');
        customScrollbar.className = 'c-scrollbar';
        customScrollbar.setAttribute('aria-hidden', 'true');
        customScrollbar.innerHTML = '<div class="c-scrollbar-thumb"></div>';
        document.body.appendChild(customScrollbar);
    }
    const scrollbarThumb = customScrollbar.querySelector('.c-scrollbar-thumb');

    // ==========================================
    // 1. CUSTOM CURSOR (3-State Dynamic Contrast)
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .p-nav, .add-row, .skill-tag, .exp-row, .c-scrollbar');
    let lastMouseX = 0;
    let lastMouseY = 0;

    function updateCursorContrast(clientX, clientY) {
        if (!cursor) return;
        const elUnderMouse = document.elementFromPoint(clientX, clientY);
        if (!elUnderMouse) return;

        // 1. Check if cursor is over a white/light-filled element inside a blue section/card
        const isOverLightInnerElement = Boolean(
            elUnderMouse.closest('.email-pill, .btn-cream, a.project-card .p-card-visual, a.project-card .p-card-tags span, .c-scrollbar')
        );

        // 2. Check if cursor is over a blue/dark section or an element that fills with cobalt blue on hover
        const isOverBlueOrDark = Boolean(
            elUnderMouse.closest('.wire-experience, .wire-footer, a.project-card, .btn-neutral, .skill-tag, #preloader')
        );

        if (isOverLightInnerElement) {
            cursor.classList.remove('cursor-light');
            cursor.classList.add('cursor-accent');
        } else if (isOverBlueOrDark) {
            cursor.classList.remove('cursor-accent');
            cursor.classList.add('cursor-light');
        } else {
            cursor.classList.remove('cursor-light', 'cursor-accent');
        }
    }

    if (window.innerWidth > 1024 && cursor) {
        window.addEventListener('mousemove', (e) => {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
            updateCursorContrast(e.clientX, e.clientY);
        });

        window.addEventListener('scroll', () => {
            if (lastMouseX || lastMouseY) {
                updateCursorContrast(lastMouseX, lastMouseY);
            }
        }, { passive: true });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // ==========================================
    // 2. CUSTOM SCROLLBAR SYNC, DRAG & CONTRAST LOGIC
    // ==========================================
    function updateCustomScrollbar() {
        if (!customScrollbar || !scrollbarThumb || window.innerWidth <= 1024) return;

        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = Math.max(1, docHeight - winHeight);
        const trackRect = customScrollbar.getBoundingClientRect();
        const trackHeight = trackRect.height;

        const thumbHeight = Math.max(48, Math.min(trackHeight, (winHeight / docHeight) * trackHeight));
        const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
        const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        const thumbTop = scrollProgress * maxThumbTop;

        scrollbarThumb.style.height = `${thumbHeight}px`;
        scrollbarThumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;

        // Switch scrollbar to white when the thumb passes over dark blue sections (.wire-experience / .wire-footer)
        const thumbCenterY = trackRect.top + thumbTop + thumbHeight / 2;
        const expSec = document.querySelector('.wire-experience');
        const footSec = document.querySelector('.wire-footer');
        let onDarkSection = false;

        [expSec, footSec].forEach(sec => {
            if (sec) {
                const r = sec.getBoundingClientRect();
                if (thumbCenterY >= r.top && thumbCenterY <= r.bottom) {
                    onDarkSection = true;
                }
            }
        });

        customScrollbar.classList.toggle('on-dark', onDarkSection);
    }

    // Drag-to-scroll & Click-on-track support
    let isDraggingScrollbar = false;
    let dragStartY = 0;
    let dragStartScrollY = 0;

    if (scrollbarThumb && customScrollbar) {
        scrollbarThumb.addEventListener('mousedown', (e) => {
            isDraggingScrollbar = true;
            dragStartY = e.clientY;
            dragStartScrollY = window.scrollY;
            customScrollbar.classList.add('is-dragging');
            document.documentElement.classList.add('is-dragging-scroll');
            e.preventDefault();
            e.stopPropagation();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingScrollbar) return;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const maxScroll = Math.max(1, docHeight - winHeight);
            const trackHeight = customScrollbar.getBoundingClientRect().height;
            const thumbHeight = scrollbarThumb.offsetHeight;
            const maxThumbTop = Math.max(1, trackHeight - thumbHeight);

            const deltaY = e.clientY - dragStartY;
            const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
            window.scrollTo(0, dragStartScrollY + scrollDelta);
        });

        window.addEventListener('mouseup', () => {
            if (!isDraggingScrollbar) return;
            isDraggingScrollbar = false;
            customScrollbar.classList.remove('is-dragging');
            document.documentElement.classList.remove('is-dragging-scroll');
        });

        // Click anywhere on the track to jump smoothly
        customScrollbar.addEventListener('mousedown', (e) => {
            if (e.target === scrollbarThumb) return;
            const trackRect = customScrollbar.getBoundingClientRect();
            const thumbHeight = scrollbarThumb.offsetHeight;
            const clickRatio = Math.min(1, Math.max(0, (e.clientY - trackRect.top - thumbHeight / 2) / (trackRect.height - thumbHeight)));
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 3. MASTER OPENING SEQUENCE
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
            if (preloader) preloader.style.display = 'none';
            ScrollTrigger.refresh();
            updateCustomScrollbar();
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

    // Top Progress Bar & Custom Scrollbar Sync
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) {
            progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        }
        updateCustomScrollbar();
    }, { passive: true });

    window.addEventListener('resize', updateCustomScrollbar, { passive: true });

    // ==========================================
    // 4. COHESION CYCLING TEXT
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
    // 5. 2.5D ILLUSTRATION PARALLAX (Hero Text Stays Aligned)
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
    // 6. SCROLL REVEALS & LEFT-TO-RIGHT LINE DIFFERENTIATORS
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
    // 7. FOOTER EMAIL CLICK FEEDBACK (Copies email + opens mail client)
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
                emailBadge.textContent = 'Write';
            }, 2500);
        });
    }

    // ==========================================
    // 8. SMOOTH ANCHOR SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            
            const headerHeight = document.querySelector('.klear-header')?.offsetHeight || 68;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });


    // ==========================================
    // 9. PROJECT CARD IMAGE BROWSER (hover arrows on two-image projects)
    // ==========================================
    document.querySelectorAll('.p-slides').forEach((wrap) => {
        const visual = wrap.parentElement;
        const slides = Array.from(wrap.querySelectorAll('.p-slide'));
        const dots = Array.from(visual.querySelectorAll('.p-dot'));
        const prevBtn = visual.querySelector('.p-nav-prev');
        const nextBtn = visual.querySelector('.p-nav-next');
        if (slides.length < 2) return;

        let current = 0;

        function show(next) {
            if (next < 0 || next >= slides.length || next === current) return;
            const goingForward = next > current;
            // Outgoing slide exits in the direction of travel; incoming keeps its resting side
            slides[current].classList.remove('is-active');
            slides[current].classList.toggle('is-prev', goingForward);
            slides[next].classList.add('is-active');
            dots.forEach((d, i) => d.classList.toggle('is-active', i === next));
            current = next;
            if (prevBtn) prevBtn.classList.toggle('is-disabled', current === 0);
            if (nextBtn) nextBtn.classList.toggle('is-disabled', current === slides.length - 1);
        }

        function bind(el, handler) {
            if (!el) return;
            el.addEventListener('click', (e) => {
                // Cards are links: never navigate when browsing images
                e.preventDefault();
                e.stopPropagation();
                handler();
            });
        }

        bind(prevBtn, () => show(current - 1));
        bind(nextBtn, () => show(current + 1));
        dots.forEach((dot, i) => bind(dot, () => show(i)));
    });

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
        updateCustomScrollbar();
    });

    updateCustomScrollbar();
});