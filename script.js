// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Always start with dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update moon/sun icon based on current theme
themeToggle.innerHTML = `<i class="fas fa-${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>`;

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const phrases = ['Student', 'Software Engineer', 'Data Science Enthusiast'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 50;
        setTimeout(typeText, 1500);
        return;
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 100;
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation
typeText();

// Intersection Observer for fade-in animations
const sections = document.querySelectorAll('section');
const options = {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, options);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
const fileInput = document.getElementById('attachment');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

// Initialize EmailJS
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init("YOUR_PUBLIC_KEY");
})();

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const fileInfo = document.querySelector('.file-info');
    
    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
        if (fileSize > 5) {
            fileInfo.textContent = 'File is too large. Please select a file under 5MB.';
            fileInfo.style.color = 'red';
            fileInput.value = '';
        } else {
            fileInfo.textContent = `Selected file: ${file.name} (${fileSize}MB)`;
            fileInfo.style.color = 'var(--text-color)';
        }
    }
});

function showLoading(isLoading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoading.style.display = isLoading ? 'inline' : 'none';
    submitBtn.disabled = isLoading;
}

function showStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.style.color = isError ? 'red' : 'green';
    
    // Hide status after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading(true);
    
    const formData = new FormData(contactForm);
    const file = fileInput.files[0];
    
    try {
        // Prepare template parameters
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            has_attachment: file ? 'Yes' : 'No',
            attachment_name: file ? file.name : 'None'
        };

        // If there's a file, convert it to base64 and add to parameters
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            await new Promise((resolve, reject) => {
                reader.onload = () => {
                    templateParams.attachment = reader.result;
                    resolve();
                };
                reader.onerror = reject;
            });
        }

        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        
        showStatus('Message sent successfully! I will get back to you soon.');
        contactForm.reset();
        document.querySelector('.file-info').textContent = 'Max file size: 5MB';
        
    } catch (error) {
        console.error('Error sending message:', error);
        showStatus('Failed to send message. Please try again later.', true);
    } finally {
        showLoading(false);
    }
});

// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Smooth scroll for navigation links
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

// Interactive Cat Animation
const catContainer = document.querySelector('.cat-container');
const cat = document.querySelector('.cat');
const yarnBall = document.querySelector('.yarn-ball');
const catEyes = document.querySelectorAll('.inner-eye');
const catHead = document.querySelector('.cat-head');

let mouseX = 0;
let mouseY = 0;
let catX = 0;
let catY = 0;
let isPlaying = false;

// Show yarn ball cursor when hovering over cat container
catContainer.addEventListener('mouseenter', () => {
    yarnBall.style.display = 'block';
    cat.classList.add('playing');
});

catContainer.addEventListener('mouseleave', () => {
    yarnBall.style.display = 'none';
    cat.classList.remove('playing');
    resetCatPosition();
});

// Update yarn ball position
catContainer.addEventListener('mousemove', (e) => {
    const rect = catContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Move yarn ball to cursor position
    yarnBall.style.left = `${mouseX - 15}px`;
    yarnBall.style.top = `${mouseY - 15}px`;
    
    // Update cat eye position
    updateCatEyes();
    
    // Make cat follow yarn ball with some delay
    followYarnBall();
});

function updateCatEyes() {
    const catRect = cat.getBoundingClientRect();
    const containerRect = catContainer.getBoundingClientRect();
    
    catEyes.forEach(eye => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2 - containerRect.left;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2 - containerRect.top;
        
        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
        const distance = Math.min(3, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 10);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        eye.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function followYarnBall() {
    const catRect = cat.getBoundingClientRect();
    const containerRect = catContainer.getBoundingClientRect();
    
    const targetX = mouseX - containerRect.width / 2;
    const targetY = mouseY - containerRect.height / 2;
    
    // Smooth follow with easing
    catX += (targetX - catX) * 0.1;
    catY += (targetY - catY) * 0.1;
    
    // Limit cat movement within container
    const maxX = containerRect.width / 2 - catRect.width / 2;
    const maxY = containerRect.height / 2 - catRect.height / 2;
    
    catX = Math.max(-maxX, Math.min(maxX, catX));
    catY = Math.max(-maxY, Math.min(maxY, catY));
    
    cat.style.transform = `translate(${catX}px, ${catY}px)`;
}

function resetCatPosition() {
    catX = 0;
    catY = 0;
    cat.style.transform = 'translate(0, 0)';
    catEyes.forEach(eye => {
        eye.style.transform = 'translate(0, 0)';
    });
}

// Add random idle animations
function addIdleAnimations() {
    if (!isPlaying) {
        const randomAction = Math.floor(Math.random() * 3);
        switch (randomAction) {
            case 0:
                cat.querySelector('.cat-tail').style.animation = 'tailWag 0.5s infinite';
                setTimeout(() => {
                    cat.querySelector('.cat-tail').style.animation = 'tailWag 3s infinite';
                }, 2000);
                break;
            case 1:
                cat.querySelector('.whisker-group.left').style.animation = 'whiskerTwitch 0.3s 3';
                cat.querySelector('.whisker-group.right').style.animation = 'whiskerTwitch 0.3s 3';
                break;
            case 2:
                catEyes.forEach(eye => {
                    eye.style.transform = 'scaleY(0.1)';
                    setTimeout(() => {
                        eye.style.transform = 'scaleY(1)';
                    }, 200);
                });
                break;
        }
    }
}

// Trigger random idle animations every 4-8 seconds
setInterval(() => {
    addIdleAnimations();
}, Math.random() * 4000 + 4000);

// Initialize cat interaction when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const catScene = document.getElementById('cat-scene');
    const petButton = document.getElementById('pet-cat');
    let isPetting = false;
    const catSound = new Audio('maw.mp3');
    catSound.volume = 0.8; // Set volume to 80%

    function petCat() {
        if (!isPetting) {
            isPetting = true;
            catScene.style.transform = 'scale(0.95)';
            catSound.currentTime = 0; // Reset sound to start
            catSound.play();
            
            setTimeout(() => {
                catScene.style.transform = 'scale(1)';
                isPetting = false;
            }, 200);
        }
    }

    catScene.addEventListener('click', petCat);
    petButton.addEventListener('click', petCat);
});
