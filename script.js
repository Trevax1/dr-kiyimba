document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Form handling
    const form = document.getElementById('booking-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');
    const formStatus = document.getElementById('form-status');

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const duration = document.getElementById('duration');
        const message = document.getElementById('message');

        // Reset previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Name validation
        if (!name.value.trim()) {
            document.getElementById('name-error').textContent = 'Please enter your name';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        }

        // Service validation
        if (!service.value) {
            document.getElementById('service-error').textContent = 'Please select a reading type';
            isValid = false;
        }

        // Duration validation
        if (!duration.value) {
            document.getElementById('duration-error').textContent = 'Please select a session duration';
            isValid = false;
        }

        // Message validation
        if (!message.value.trim()) {
            document.getElementById('message-error').textContent = 'Please tell us about your situation';
            isValid = false;
        }

        return isValid;
    };

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Show loading state
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline';
        submitButton.disabled = true;
        formStatus.innerHTML = '';
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                window.location.href = '/success.html';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.innerHTML = 'There was an error submitting your form. Please try again or contact us directly at kiyimba50@gmail.com';
            buttonText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Mobile Navigation Toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Testimonial slider
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    // Initialize testimonial slider
    if (testimonials.length > 0) {
        showTestimonial(0);
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
}); 