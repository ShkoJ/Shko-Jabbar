document.addEventListener('DOMContentLoaded', () => {
    
    // --- Typing Animation ---
    const typingText = document.querySelector('.typing-text');
    const phrases = ['Software Engineer', 'Data Scientist', 'Entrepreneur'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        if (!typingText) return;
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
            setTimeout(typeText, 2000);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 100;
        }

        setTimeout(typeText, typingSpeed);
    }
    typeText();

    // --- Filter Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-grid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // If filtering 'all', show everything except explicitly hidden ones
                // Note: The 'Show More' button handles the .hidden-project-card class separately.
                // When filtering, we usually want to see everything in that category.
                
                if (filterValue === 'all') {
                    // Reset to default state (some might be hidden by "Show More" logic)
                    if (card.classList.contains('hidden-project-card')) {
                        card.style.display = 'none';
                    } else {
                        card.style.display = 'flex';
                    }
                } else {
                    // Specific filter
                    if (category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });


    // --- Scroll Animation ---
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));

    // --- Loading Remover ---
    const loader = document.querySelector('.loading');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 500);
    }

    // --- Cat Interaction ---
    const catScene = document.getElementById('cat-scene');
    const catSound = new Audio('maw.mp3');
    catSound.volume = 0.5;

    if (catScene) {
        catScene.addEventListener('click', () => {
            catScene.style.transform = 'scale(0.9)';
            catSound.currentTime = 0;
            catSound.play().catch(e => console.log('Audio error', e));
            setTimeout(() => catScene.style.transform = 'scale(1)', 150);
        });
    }

    // --- Initial Hide Logic for Work (CSS handles default, this handles button) ---
    // Hide items 6+ manually to ensure consistent start state if CSS fails
    const allWorkItems = document.querySelectorAll('.timeline-item');
    allWorkItems.forEach((item, index) => {
        if (index >= 5) item.style.display = 'none';
    });
});

// --- Toggle Functions (Global Scope) ---

function toggleProjects() {
    // Specifically targets the hidden AI cards
    const hiddenCards = document.querySelectorAll('.hidden-project-card');
    const btn = document.getElementById('show-more-projects');
    
    // Check if currently hidden (style none or class present)
    const isHidden = hiddenCards[0].style.display === 'none' || window.getComputedStyle(hiddenCards[0]).display === 'none';

    if (isHidden) {
        hiddenCards.forEach(card => {
            card.style.display = 'flex';
            card.classList.remove('hidden-project-card'); // Remove class so filters see it as normal
            card.classList.add('revealed-card'); // Mark as revealed
        });
        btn.textContent = 'Show Less';
    } else {
        const revealedCards = document.querySelectorAll('.revealed-card');
        revealedCards.forEach(card => {
            card.style.display = 'none';
            card.classList.add('hidden-project-card');
            card.classList.remove('revealed-card');
        });
        btn.textContent = 'View More AI Projects';
    }
}

function toggleWork() {
    const allWorkItems = document.querySelectorAll('.timeline-item');
    const btn = document.getElementById('show-more-work');
    
    // Check if the 6th item is hidden
    const isHidden = allWorkItems[5].style.display === 'none';

    if (isHidden) {
        allWorkItems.forEach((item, index) => {
            if (index >= 5) {
                item.style.display = 'block';
                item.classList.add('visible');
            }
        });
        btn.textContent = 'Show Less';
    } else {
        allWorkItems.forEach((item, index) => {
            if (index >= 5) item.style.display = 'none';
        });
        btn.textContent = 'Show More History';
        // Scroll back to work section so user isn't lost
        document.getElementById('work').scrollIntoView({behavior: 'smooth'});
    }
}
