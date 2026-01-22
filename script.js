document.addEventListener('DOMContentLoaded', () => {
    
    // --- Typing Animation ---
    const typingText = document.querySelector('.typing-text');
    const phrases = ['Software Engineer', 'Data Scientist', 'Consultant'];
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
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isHidden = card.classList.contains('hidden-project-card');
                
                // If the card is one of the 'hidden' extras, respect that state unless revealed
                if (isHidden) {
                    card.style.display = 'none';
                    return;
                }

                if (filterValue === 'all') {
                    card.style.display = 'flex';
                } else {
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

    // --- Initial Hide Logic for Work ---
    const allWorkItems = document.querySelectorAll('.timeline-item');
    allWorkItems.forEach((item, index) => {
        if (index >= 5) item.style.display = 'none';
    });
});

// --- Toggle Functions ---

function toggleProjects() {
    const hiddenCards = document.querySelectorAll('.hidden-project-card');
    const btn = document.getElementById('show-more-projects');
    
    // We check the first card to see if it is currently displayed
    // If it's effectively hidden (display: none), we show them.
    let isCurrentlyHidden = true;
    if (hiddenCards.length > 0) {
        const style = window.getComputedStyle(hiddenCards[0]);
        if (style.display !== 'none') isCurrentlyHidden = false;
    }

    if (isCurrentlyHidden) {
        hiddenCards.forEach(card => {
            card.style.display = 'flex';
            // Important: we don't remove the class 'hidden-project-card' completely 
            // so we can identify them later to hide them again.
            // But we can mark them as 'revealed' to handle logic if needed.
        });
        btn.textContent = 'Show Less';
    } else {
        hiddenCards.forEach(card => {
            card.style.display = 'none';
        });
        btn.textContent = 'View More AI Projects';
    }
}

function toggleWork() {
    const allWorkItems = document.querySelectorAll('.timeline-item');
    const btn = document.getElementById('show-more-work');
    
    // Check if the 6th item (index 5) is hidden
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
        // Scroll back to work section
        document.getElementById('work').scrollIntoView({behavior: 'smooth'});
    }
}
