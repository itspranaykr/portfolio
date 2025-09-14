// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm(); // Now integrated with WhatsApp
    initScrollToTop();
    initTypeWriter();
    initParticles();
});

// Navigation Functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(99, 102, 241, 0.1)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate skill items
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillItems(entry.target);
                }
                
                // Animate stat counters
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.skill-category, .project-card, .about-content, .stats, .contact-content'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Animate skill items with delay
function animateSkillItems(skillCategory) {
    const skillItems = skillCategory.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'slideInUp 0.6s ease-out forwards';
            item.style.opacity = '1';
        }, index * 100);
    });
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current) + '+';
            }
        }, 50);
    });
}

// WhatsApp Contact Form Integration
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Form validation
        if (validateForm(formObject)) {
            // Send to WhatsApp instead of traditional form submission
            sendToWhatsApp(formObject);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!formData.subject || formData.subject.trim().length < 5) {
        showFieldError('subject', 'Subject must be at least 5 characters long');
        isValid = false;
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'subject':
            if (value.length < 5) {
                showFieldError(fieldName, 'Subject must be at least 5 characters long');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    return true;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: slideInUp 0.3s ease-out;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = 'rgba(99, 102, 241, 0.3)';
}

// Send message to WhatsApp
function sendToWhatsApp(formData) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Preparing WhatsApp...';
    submitBtn.disabled = true;
    submitBtn.style.background = 'var(--text-gray)';
    
    // WhatsApp phone number (with country code, without + or spaces)
    const whatsappNumber = '919376457792'; // India country code + your number
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(formData);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showNotification('Redirecting to WhatsApp... Please send the message there!', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = 'Message Prepared!';
        submitBtn.style.background = '#10b981';
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'var(--gradient-1)';
        }, 3000);
    }, 1500);
}

// Create formatted WhatsApp message
function createWhatsAppMessage(formData) {
    const message = `🌟 *New Contact Form Message* 🌟

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📋 *Subject:* ${formData.subject}

💬 *Message:*
${formData.message}

---
*Sent via Portfolio Website Contact Form*
${new Date().toLocaleString()}`;

    return message;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typewriter effect for hero title
function initTypeWriter() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const originalText = titleElement.innerHTML;
    titleElement.innerHTML = '';
    
    let index = 0;
    const speed = 50;
    
    function typeWriter() {
        if (index < originalText.length) {
            titleElement.innerHTML += originalText.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typewriter effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Particle animation for hero background
function initParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and size
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: particleFloat ${duration}s infinite linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, duration * 1000);
}

// Add particle float animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        from {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes slideOutUp {
        to {
            transform: translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for project cards
function initLazyLoading() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
}

// Initialize lazy loading after DOM is loaded
setTimeout(initLazyLoading, 100);

// Initialize floating WhatsApp button (optional)
setTimeout(createWhatsAppButton, 2000);

// Add some interactive hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('skill-item')) {
        e.target.style.transform = 'scale(1.05)';
    }
    
    if (e.target.classList.contains('social-link')) {
        e.target.style.transform = 'translateY(-5px) scale(1.1)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('skill-item')) {
        e.target.style.transform = 'scale(1)';
    }
    
    if (e.target.classList.contains('social-link')) {
        e.target.style.transform = 'translateY(0) scale(1)';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Press 'Enter' or 'Space' to activate buttons
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Performance optimization - Throttle scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    // Your scroll event handlers here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);