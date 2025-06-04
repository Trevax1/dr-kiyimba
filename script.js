document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const bookingForm = document.getElementById('booking-form');
    const testimonialSlider = document.querySelector('.testimonial-slider');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .about-content, .testimonial');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
            
            if (isVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    document.querySelectorAll('.service-card, .about-content, .testimonial').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Form handling
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const duration = document.getElementById('duration');
        const message = document.getElementById('message');

        // Clear previous errors
        [name, email, service, duration, message].forEach(clearError);

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate service
        if (!service.value) {
            showError(service, 'Please select a reading type');
            isValid = false;
        }

        // Validate duration
        if (!duration.value) {
            showError(duration, 'Please select a session duration');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Please tell us about your situation');
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            duration: document.getElementById('duration').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        formStatus.style.display = 'none';

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your reading request has been sent. We will contact you shortly.';
                bookingForm.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Sorry, there was an error sending your message. Please try again later.';
            console.error('Error:', error);
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    bookingForm.addEventListener('submit', handleSubmit);

    // Clear errors on input
    document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    if (testimonialSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialSlider.style.cursor = 'grabbing';
            startX = e.pageX - testimonialSlider.offsetLeft;
            scrollLeft = testimonialSlider.scrollLeft;
        });

        testimonialSlider.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialSlider.style.cursor = 'grab';
        });

        testimonialSlider.addEventListener('mouseup', () => {
            isDown = false;
            testimonialSlider.style.cursor = 'grab';
        });

        testimonialSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialSlider.scrollLeft = scrollLeft - walk;
        });

        testimonialSlider.style.cursor = 'grab';
    }

    const smoothScroll = (e) => {
        if (e.target.hash) {
            e.preventDefault();
            const target = document.querySelector(e.target.hash);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const answer = otherItem.querySelector('.faq-answer');
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                }
            });
            
            // Toggle current item
            const isActive = item.classList.contains('active');
            const answer = item.querySelector('.faq-answer');
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
            }
        });
    });
}); 