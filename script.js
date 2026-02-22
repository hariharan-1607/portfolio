// Sticky Navbar
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
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

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Toggle body scroll
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'initial';
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


// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'initial';


        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission (Direct Email via mailto)
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Construct the mailto URL
    const subject = encodeURIComponent(`Portfolio Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\r\nEmail: ${email}\r\n\r\nMessage:\r\n${message}`);
    const mailtoUrl = `mailto:haribala112006@gmail.com?subject=${subject}&body=${body}`;

    // Create a temporary link and click it (more reliable than window.location)
    const tempLink = document.createElement('a');
    tempLink.href = mailtoUrl;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    // Give a brief hint to the user
    setTimeout(() => {
        alert("Redirecting to your email app... If it doesn't open, please check if you have a default mail client set up.");
        this.reset();
    }, 500);
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.2
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
document.querySelectorAll('.section-title, .about-wrapper, .skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Section Focus/Blur Observer
const sectionObserverOptions = {
    threshold: 0.3, // Percentage of section visible to trigger focus
    rootMargin: "-10% 0px -10% 0px" // Shrink intersection area for better focus
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
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

// Click Interaction for Skills and Projects (Touch/Mobile support)
const interactiveCards = document.querySelectorAll('.skill-card, .project-card');

interactiveCards.forEach(card => {
    card.addEventListener('click', () => {
        // Toggle active class
        card.classList.toggle('active');

        // Optional: Close other cards when one is opened
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
    resumeModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeResumeModal() {
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
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeResumeModal();
    }
});
