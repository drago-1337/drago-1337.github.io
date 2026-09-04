function smoothScrollTo(targetElement) {
    if (!targetElement) return;

    const startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let targetY = 0;

    if (targetElement.id === 'home') {
        targetY = 0;
    } else {
        const sectionTitle = targetElement.querySelector('.section-title');
        if (sectionTitle) {
            const titleRect = sectionTitle.getBoundingClientRect();
            targetY = Math.max(0, titleRect.top + startY - 90);
        } else {
            const targetRect = targetElement.getBoundingClientRect();
            targetY = Math.max(0, targetRect.top + startY - 80);
        }
    }

    const distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    const duration = 700;
    let startTime = null;
    let animationFrameId = null;

    const cancelScroll = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        window.removeEventListener('wheel', cancelScroll);
        window.removeEventListener('touchstart', cancelScroll);
    };

    window.addEventListener('wheel', cancelScroll, { passive: true });
    window.addEventListener('touchstart', cancelScroll, { passive: true });

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentPosition = startY + (distance * ease);

        window.scrollTo(0, currentPosition);
        document.documentElement.scrollTop = currentPosition;
        document.body.scrollTop = currentPosition;

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
        } else {
            window.scrollTo(0, targetY);
            document.documentElement.scrollTop = targetY;
            document.body.scrollTop = targetY;
            window.removeEventListener('wheel', cancelScroll);
            window.removeEventListener('touchstart', cancelScroll);
            updateActiveNav();
        }
    }

    animationFrameId = requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.length <= 1) {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            smoothScrollTo(target);
        }
    });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

function updateActiveNav() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let currentSectionId = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    if (currentSectionId) {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentSectionId);
        });
    }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

const words = ["Kotlin Developer", "C Dev", "C++ Dev"];
const typed = document.getElementById('typed');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    if (!typed) return;
    const current = words[wordIndex];

    if (!deleting) {
        typed.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2200);
            return;
        }
        setTimeout(typeLoop, 110);
    } else {
        typed.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 55);
    }
}

typeLoop();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
    } else {
        revealObserver.observe(el);
    }
});

const counters = document.querySelectorAll('.counter[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);

        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        let start = null;

        function stepCount(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(stepCount);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(stepCount);
    });
}, { threshold: 0.4 });

counters.forEach((el) => counterObserver.observe(el));

const skillHeaders = document.querySelectorAll('.skills__header');

skillHeaders.forEach((header) => {
    header.addEventListener('click', () => {
        const content = header.closest('.skills__content');
        if (!content) return;
        content.classList.toggle('skills__open');
        content.classList.toggle('skills__close');
    });
});

const skillsContainer = document.querySelector('.skills__container');

if (skillsContainer) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            skillsContainer.classList.add('skills-animate');
            skillsObserver.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    skillsObserver.observe(skillsContainer);
}
