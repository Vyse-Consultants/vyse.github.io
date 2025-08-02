// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');
const logoLink = document.querySelector('.nav__logo-link');

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

// Logo click handler - scroll to top
function handleLogoClick(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Close mobile nav if open
    closeMobileNav();
    
    // Update active nav link to home
    updateActiveNavLink('#home');
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

// Enhanced header scroll effect with better visibility
function handleHeaderScroll() {
    if (!header) return;
    
    const scrolled = window.scrollY > 10;
    
    if (scrolled) {
        header.style.backgroundColor = 'rgba(252, 252, 249, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        header.style.borderBottom = '1px solid rgba(94, 82, 64, 0.15)';
    } else {
        header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        header.style.borderBottom = '1px solid var(--color-border)';
    }

    // Ensure navigation links are always visible
    navLinks.forEach(link => {
        if (!link.style.color || link.style.color === '') {
            link.style.color = 'var(--color-text)';
        }
    });
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const message = formData.get('message')?.trim();
    
    if (!name) {
        errors.push('Name is required');
    }
    
    if (!email) {
        errors.push('Email is required');
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!phone) {
        errors.push('Phone number is required');
    } else {
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phonePattern.test(phone)) {
            errors.push('Please enter a valid phone number');
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
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message status status--${type}`;
    messageElement.style.marginTop = 'var(--space-16)';
    messageElement.textContent = message;
    
    // Insert message after form
    if (contactForm) {
        contactForm.insertAdjacentElement('afterend', messageElement);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Enhanced contact form handling with validation
function handleContactForm(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage('error', errors.join('. '));
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        try {
            // Reset form
            contactForm.reset();
            showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.');
        } catch (error) {
            showFormMessage('error', 'Something went wrong. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('btn--loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }, 2000);
}

// Enhanced Intersection Observer for navigation highlighting
function createIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = '#' + entry.target.id;
                updateActiveNavLink(targetId);
                
                // Add visible class for animations
                entry.target.classList.add('section-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animate elements on scroll with enhanced visibility
function animateOnScroll() {
    const elements = document.querySelectorAll('.service__card, .industry__card, .advantage__card, .feature, .client__logo');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for better visual effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(element);
    });
}

// Initialize keyboard navigation with accessibility improvements
function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
        
        // Handle tab navigation enhancement
        if (e.key === 'Tab') {
            // Ensure focus is visible on navigation elements
            setTimeout(() => {
                const focusedElement = document.activeElement;
                if (focusedElement && focusedElement.classList.contains('nav__link')) {
                    focusedElement.style.outline = '2px solid var(--brand-secondary)';
                    focusedElement.style.outlineOffset = '2px';
                }
            }, 10);
        }
    });
    
    // Handle enter and space key on nav toggle
    if (navToggle) {
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });
    }
    
    // Enhance logo keyboard accessibility
    if (logoLink) {
        logoLink.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick(e);
            }
        });
    }
}

// Enhanced user experience with better interactions
function enhanceUserExperience() {
    // Add click handlers for all anchor links with href starting with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });
    
    // Enhanced hover effects with better performance
    const interactiveCards = document.querySelectorAll('.service__card, .industry__card, .client__logo, .advantage__card, .feature');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add focus support for keyboard users
        card.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.outline = '2px solid var(--brand-secondary)';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.outline = 'none';
        });
    });
    
    // Add enhanced navigation link visibility
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--brand-primary)';
            this.style.backgroundColor = 'rgba(var(--color-teal-500-rgb), 0.08)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = 'var(--color-text)';
                this.style.backgroundColor = 'transparent';
            }
        });
    });
}

// Enhanced visibility checker to ensure navigation is always visible
function ensureNavigationVisibility() {
    navLinks.forEach(link => {
        const computedStyle = window.getComputedStyle(link);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // If the link is not visible enough, force better contrast
        if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
            link.style.color = 'var(--color-text)';
        }
        
        // Ensure minimum opacity
        if (parseFloat(computedStyle.opacity) < 0.8) {
            link.style.opacity = '1';
        }
    });
}

// Performance monitoring and optimization
function initPerformanceOptimizations() {
    // Debounce scroll events for better performance
    let scrollTimeout;
    const debouncedScrollHandler = () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            handleHeaderScroll();
            ensureNavigationVisibility();
        });
    };
    
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    
    // Optimize intersection observer performance
    if ('IntersectionObserver' in window) {
        createIntersectionObserver();
        animateOnScroll();
    }
}

// Initialize page functionality with enhanced error handling
function initializePage() {
    try {
        // Logo functionality
        if (logoLink) {
            logoLink.addEventListener('click', handleLogoClick);
        }
        
        // Navigation functionality
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        // Smooth scrolling for all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });
        
        // Contact form handling
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }
        
        // Initialize performance optimizations
        initPerformanceOptimizations();
        
        // Initialize keyboard navigation
        initKeyboardNavigation();
        
        // Enhance user experience
        enhanceUserExperience();
        
        // Ensure navigation visibility on load
        ensureNavigationVisibility();
        
        // Handle clicks outside mobile menu
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                navToggle && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });
        
        // Initial header state
        handleHeaderScroll();
        
        // Ensure proper contrast on page load
        setTimeout(() => {
            ensureNavigationVisibility();
        }, 100);
        
        console.log('VYSE Recruit website initialized successfully with enhanced navigation visibility');
        
    } catch (error) {
        console.error('Error initializing page:', error);
        
        // Fallback to ensure basic functionality works
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
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
    if (!document.hidden) {
        // Re-ensure navigation visibility when page becomes visible
        setTimeout(() => {
            ensureNavigationVisibility();
            handleHeaderScroll();
        }, 100);
    }
});

// Handle window resize to maintain navigation visibility
window.addEventListener('resize', () => {
    setTimeout(() => {
        ensureNavigationVisibility();
        handleHeaderScroll();
    }, 100);
});

// Error handling for any uncaught errors
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Ensure basic navigation still works despite errors
    ensureNavigationVisibility();
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`VYSE Recruit page loaded in ${Math.round(loadTime)}ms`);
        
        // Final check for navigation visibility after everything is loaded
        setTimeout(() => {
            ensureNavigationVisibility();
        }, 500);
    });
}

// Dark mode support for navigation visibility
function handleThemeChange() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        setTimeout(() => {
            ensureNavigationVisibility();
            handleHeaderScroll();
        }, 100);
    });
}

// Initialize theme change handling
if (window.matchMedia) {
    handleThemeChange();
}