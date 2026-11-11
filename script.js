// Sticky Navbar
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 20) {
        navbar.style.background = 'rgba(15, 28, 48, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function toggleMobileMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'initial';
    }
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });

    // Auto-hide mobile menu on mouse leave
    navLinks.addEventListener('mouseleave', () => {
        if (navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'initial';
        }
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        // Close mobile menu if open
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        document.body.style.overflow = 'initial';

        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active Navigation Link Highlighting on Scroll
const pageSections = document.querySelectorAll('header[id], section[id]');
const navItems = document.querySelectorAll('.nav-links a.nav-link');

function updateActiveNavLink() {
    let currentSectionId = 'home';
    const scrollMarker = window.scrollY + 140;

    pageSections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollMarker >= top && scrollMarker < top + height) {
            currentSectionId = sec.getAttribute('id');
        }
    });

    // If scrolled right to the bottom of the page, highlight Contact
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
        const lastSection = pageSections[pageSections.length - 1];
        if (lastSection) currentSectionId = lastSection.getAttribute('id');
    }

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('load', updateActiveNavLink);

// Form Submission (Direct Email via Webmail & Mailto - Preserved)
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !message || !emailPattern.test(email)) {
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.style.display = 'block';
                formStatus.innerHTML = `<p class="status-desc" style="margin-bottom:0; color:#f87171;">Please enter a valid name, email address, and message.</p>`;
            }
            return;
        }

        const recipientEmail = "haribala112006@gmail.com";
        const subjectText = `Portfolio Message from ${name}`;
        const bodyText = `Name: ${name}\r\nEmail: ${email}\r\n\r\nMessage:\r\n${message}`;

        const subject = encodeURIComponent(subjectText);
        const body = encodeURIComponent(bodyText);

        // Webmail direct compose URL (works flawlessly in browser without requiring an OS desktop mail client)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${body}`;
        const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        // Detect mobile vs desktop
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = mailtoUrl;
        } else {
            // Open Gmail compose directly in a new tab (avoids about:blank freeze caused by conflicting mailto trigger)
            const link = document.createElement('a');
            link.href = gmailUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Show elegant in-form status with interactive fallbacks (no alert dialog)
        if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            formStatus.innerHTML = `
                <div class="status-header">
                    <i class="fas fa-check-circle"></i>
                    <span>Opening Email Composer...</span>
                </div>
                <p class="status-desc">Your message has been drafted for <strong>${recipientEmail}</strong>. If your email didn't open automatically, choose an option below:</p>
                <div class="status-actions">
                    <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="status-btn primary">
                        <i class="fab fa-google"></i> Open in Gmail
                    </a>
                    <a href="${mailtoUrl}" class="status-btn">
                        <i class="fas fa-envelope"></i> Default Mail App
                    </a>
                    <button type="button" class="status-btn" id="copy-msg-btn">
                        <i class="fas fa-copy"></i> <span id="copy-text">Copy Message</span>
                    </button>
                </div>
            `;

            const copyBtn = document.getElementById("copy-msg-btn");
            if (copyBtn) {
                copyBtn.addEventListener("click", function () {
                    const fullText = `To: ${recipientEmail}\nSubject: ${subjectText}\n\n${bodyText}`;
                    navigator.clipboard.writeText(fullText).then(() => {
                        const copyText = document.getElementById("copy-text");
                        if (copyText) copyText.textContent = "Copied!";
                        setTimeout(() => {
                            if (copyText) copyText.textContent = "Copy Message";
                        }, 2500);
                    }).catch(() => {
                        const copyText = document.getElementById("copy-text");
                        if (copyText) copyText.textContent = "Failed to copy";
                    });
                });
            }
        }
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.section-title, .about-wrapper, .skill-category-card, .project-card, .timeline-item, .education-card, .cert-card, .achievement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Section Focus/Blur Observer (handles both compact and tall multi-card sections cleanly)
const sectionObserverOptions = {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin: "-10% 0px -10% 0px"
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const visibleHeight = entry.intersectionRect ? entry.intersectionRect.height : 0;
        const rootHeight = entry.rootBounds ? entry.rootBounds.height : window.innerHeight * 0.8;
        const isFocused = entry.isIntersecting && (entry.intersectionRatio >= 0.25 || visibleHeight >= rootHeight * 0.35);

        if (isFocused) {
            entry.target.classList.remove('inactive-section');
        } else {
            entry.target.classList.add('inactive-section');
        }
    });
}, sectionObserverOptions);

// Observe all sections (except hero for initial landing experience)
document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Click Interaction for Interactive Cards (Touch/Mobile support)
const interactiveCards = document.querySelectorAll('.skill-category-card, .project-card');

interactiveCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');

        interactiveCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('active');
            }
        });
    });
});

// Resume Modal Logic
const resumeLink = document.getElementById('resume-link');
const resumeModal = document.getElementById('resume-modal');
const closeModal = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

function openResumeModal(e) {
    if (e) e.preventDefault();
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

if (resumeLink) {
    resumeLink.addEventListener('click', openResumeModal);
}

if (closeModal) {
    closeModal.addEventListener('click', closeResumeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeResumeModal);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
        closeResumeModal();
    }
});

// Dynamic Copyright Year
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}
