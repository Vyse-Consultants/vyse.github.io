// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');

// Industries Carousel Elements
const industriesGrid = document.getElementById('industries-grid');
const prevBtn = document.getElementById('industries-prev');
const nextBtn = document.getElementById('industries-next');

// Carousel State
let currentIndex = 0;
let cardWidth = 304; // 280px + 24px gap
let visibleCards = 3;
let maxIndex = 0;
let totalCards = 0;

// Mobile Navigation Toggle
function toggleMobileNav() {
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close mobile nav when clicking on a link
function closeMobileNav() {
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth scrolling for navigation links and buttons
function smoothScrollToSection(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile nav if open
        closeMobileNav();
        
        // Update active nav link
        updateActiveNavLink(targetId);
    }
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
}

// Industries Carousel Functions
function calculateCarouselDimensions() {
    if (!industriesGrid) return;
    
    const containerWidth = industriesGrid.parentElement.offsetWidth;
    totalCards = industriesGrid.children.length;
    
    // Responsive card sizing
    if (window.innerWidth <= 480) {
        cardWidth = 244; // 220px + 24px gap
        visibleCards = 1;
    } else if (window.innerWidth <= 768) {
        cardWidth = 274; // 250px + 24px gap
        visibleCards = Math.min(1.5, totalCards);
    } else if (window.innerWidth <= 1024) {
        cardWidth = 304; // 280px + 24px gap
        visibleCards = Math.min(2.5, totalCards);
    } else {
        cardWidth = 304; // 280px + 24px gap
        visibleCards = Math.min(3, totalCards);
    }
    
    // Calculate maximum index - ensure we can scroll through all cards
    maxIndex = Math.max(0, totalCards - Math.floor(visibleCards));
    
    console.log(`Carousel: ${totalCards} cards, visible: ${visibleCards}, maxIndex: ${maxIndex}`);
    
    // Update button states
    updateCarouselButtons();
}

function updateCarouselTransform() {
    if (!industriesGrid) return;
    
    const translateX = -(currentIndex * cardWidth);
    industriesGrid.style.transform = `translateX(${translateX}px)`;
    
    console.log(`Carousel moved to index ${currentIndex}, translateX: ${translateX}px`);
}

function updateCarouselButtons() {
    if (!prevBtn || !nextBtn) return;
    
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;
    
    prevBtn.disabled = !canGoPrev;
    nextBtn.disabled = !canGoNext;
    
    prevBtn.style.opacity = canGoPrev ? '1' : '0.5';
    nextBtn.style.opacity = canGoNext ? '1' : '0.5';
    
    prevBtn.style.cursor = canGoPrev ? 'pointer' : 'not-allowed';
    nextBtn.style.cursor = canGoNext ? 'pointer' : 'not-allowed';
}

function slideCarousel(direction) {
    console.log(`Slide carousel: ${direction}, currentIndex: ${currentIndex}, maxIndex: ${maxIndex}`);
    
    if (direction === 'prev' && currentIndex > 0) {
        currentIndex--;
        updateCarouselTransform();
        updateCarouselButtons();
    } else if (direction === 'next' && currentIndex < maxIndex) {
        currentIndex++;
        updateCarouselTransform();
        updateCarouselButtons();
    }
}

// Touch/Swipe support for mobile
function initCarouselTouchSupport() {
    if (!industriesGrid) return;
    
    let startX = 0;
    let startY = 0;
    let threshold = 50;
    
    industriesGrid.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });
    
    industriesGrid.addEventListener('touchmove', (e) => {
        // Don't prevent default to allow vertical scrolling
    }, { passive: true });
    
    industriesGrid.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const distX = touch.clientX - startX;
        const distY = touch.clientY - startY;
        
        // Check if horizontal swipe is dominant
        if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
            if (distX > 0) {
                slideCarousel('prev');
            } else {
                slideCarousel('next');
            }
        }
    }, { passive: true });
}

// Auto-resize carousel on window resize
function handleCarouselResize() {
    calculateCarouselDimensions();
    
    // Reset to first slide if current index is out of bounds
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    
    updateCarouselTransform();
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const message = formData.get('message')?.trim();
    
    if (!name) {
        errors.push('Full Name is required');
    }
    
    if (!email) {
        errors.push('Email Address is required');
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!phone) {
        errors.push('Phone Number is required');
    } else {
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phonePattern.test(phone)) {
            errors.push('Please enter a valid phone number (minimum 10 digits)');
        }
    }
    
    if (!message) {
        errors.push('Message is required');
    } else if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Show form success/error message
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message status status--${type}`;
    messageElement.style.marginTop = 'var(--space-16)';
    messageElement.style.fontSize = 'var(--font-size-sm)';
    messageElement.textContent = message;
    
    // Insert message after form
    if (contactForm) {
        contactForm.insertAdjacentElement('afterend', messageElement);
        
        // Auto-remove message after 8 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 8000);
        
        // Scroll to message
        setTimeout(() => {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Highlight form field errors
function highlightFormErrors(errors) {
    // Remove existing error styling
    const formControls = contactForm.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.style.borderColor = '';
        control.classList.remove('error');
    });
    
    // Add error styling to fields with issues
    const errorMessages = errors.join('. ').toLowerCase();
    
    if (errorMessages.includes('name')) {
        const nameField = document.getElementById('name');
        if (nameField) {
            nameField.style.borderColor = 'var(--color-error)';
            nameField.classList.add('error');
        }
    }
    
    if (errorMessages.includes('email')) {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.style.borderColor = 'var(--color-error)';
            emailField.classList.add('error');
        }
    }
    
    if (errorMessages.includes('phone')) {
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.style.borderColor = 'var(--color-error)';
            phoneField.classList.add('error');
        }
    }
    
    if (errorMessages.includes('message')) {
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.style.borderColor = 'var(--color-error)';
            messageField.classList.add('error');
        }
    }
}

// Enhanced contact form handling with Web3Forms integration
async function handleContactForm(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    // Check if access key is configured
    const accessKey = formData.get('access_key');
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        showFormMessage('error', 'Form is not properly configured. Please contact us directly at info@vyse.com');
        return;
    }
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage('error', errors.join('. ') + '.');
        highlightFormErrors(errors);
        return;
    }
    
    // Clear error styling on successful validation
    const formControls = contactForm.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.style.borderColor = '';
        control.classList.remove('error');
    });
    
    // Show loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    try {
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Success
            contactForm.reset();
            showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.');
        } else {
            // Error from Web3Forms
            throw new Error(result.message || 'Form submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('error', 'Something went wrong. Please try again or contact us directly at info@vyse.com');
    } finally {
        // Reset button state
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Intersection Observer for navigation highlighting
function createIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = '#' + entry.target.id;
                updateActiveNavLink(targetId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service__card, .industry__card, .advantage__card');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize keyboard navigation
function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
        
        // Handle arrow keys for carousel (only when no input is focused)
        if (document.activeElement === document.body) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                slideCarousel('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                slideCarousel('next');
            }
        }
    });
    
    // Handle enter key on nav toggle
    if (navToggle) {
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });
    }
}

// Add loading states and user feedback
function enhanceUserExperience() {
    // Add click handlers for all anchor links with href starting with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });
    
    // Add hover effects for better interaction feedback
    const cards = document.querySelectorAll('.service__card, .industry__card, .client__logo');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('translateY')) {
                this.style.transform = 'translateY(-4px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(/translateY\([^)]*\)/, 'translateY(0)');
        });
    });
    
    // Clear form field errors on input
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('input', function() {
            this.style.borderColor = '';
            this.classList.remove('error');
        });
    });
}

// Initialize Industries Carousel
function initCarousel() {
    if (!industriesGrid || !prevBtn || !nextBtn) {
        console.error('Carousel elements not found');
        return;
    }
    
    console.log('Initializing carousel...');
    
    // Calculate initial dimensions
    calculateCarouselDimensions();
    
    // Set initial transform
    updateCarouselTransform();
    
    // Add click event listeners with proper event handling
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Previous button clicked');
        slideCarousel('prev');
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Next button clicked');
        slideCarousel('next');
    });
    
    // Initialize touch support
    initCarouselTouchSupport();
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleCarouselResize, 250));
    
    console.log('Industries carousel initialized successfully');
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize page functionality
function initializePage() {
    try {
        console.log('Initializing VYSE website...');
        
        // Navigation functionality
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        // Smooth scrolling for all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });
        
        // Contact form handling with Web3Forms
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        } else {
            console.warn('Contact form not found');
        }
        
        // Scroll effects with debouncing for performance
        window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
        
        // Initialize industries carousel
        setTimeout(() => {
            initCarousel();
        }, 100); // Small delay to ensure DOM is fully rendered
        
        // Initialize intersection observer for navigation
        createIntersectionObserver();
        
        // Initialize animations
        animateOnScroll();
        
        // Initialize keyboard navigation
        initKeyboardNavigation();
        
        // Enhance user experience
        enhanceUserExperience();
        
        // Handle clicks outside mobile menu
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                navToggle && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });
        
        console.log('VYSE website initialized successfully');
        
        // Log setup instructions if access key is not configured
        const accessKeyInput = document.querySelector('input[name="access_key"]');
        if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
            console.warn('⚠️  SETUP REQUIRED: Please configure Web3Forms access key in the contact form');
            console.info('📝 Instructions: Visit https://web3forms.com to get your free access key');
        }
        
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing background processes');
    } else {
        console.log('Page visible - resuming functionality');
        // Recalculate carousel on page visibility change
        if (industriesGrid) {
            setTimeout(handleCarouselResize, 100);
        }
    }
});

// Error handling for any uncaught errors
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`VYSE website loaded in ${Math.round(loadTime)}ms`);
        
        // Ensure carousel is properly sized after all resources load
        setTimeout(() => {
            if (industriesGrid) {
                console.log('Recalculating carousel after page load');
                handleCarouselResize();
            }
        }, 500);
    });
}