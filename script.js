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

    // ==========================================
    // --- PROJECT FILTERING & LIMIT LOGIC ---
    // ==========================================
    const projectCards = document.querySelectorAll('.project-grid .project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const viewMoreBtn = document.getElementById('toggle-projects-btn');
    
    const LIMIT = 4;
    let currentCategory = 'all';
    let isExpanded = false; // false = showing 4, true = showing all

    function renderProjects() {
        let visibleCount = 0;
        let totalMatches = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            // Check if card matches current filter
            const matches = (currentCategory === 'all') || (category === currentCategory);

            if (matches) {
                totalMatches++;
                // Decide if we should show this card based on limit and expansion state
                if (isExpanded || visibleCount < LIMIT) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Handle Button Visibility & Text
        if (totalMatches > LIMIT) {
            viewMoreBtn.style.display = 'inline-block';
            viewMoreBtn.textContent = isExpanded ? 'Show Less' : 'View More';
        } else {
            viewMoreBtn.style.display = 'none';
        }
    }

    // Event Listener: Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set new category and reset expansion
            currentCategory = btn.getAttribute('data-filter');
            isExpanded = false; // Reset to collapsed view on filter change
            
            renderProjects();
        });
    });

    // Event Listener: View More Button
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded; // Toggle state
            renderProjects();
        });
    }

    // Initial Render
    renderProjects();


    // ==========================================
    // --- WORK EXPERIENCE EXPANSION ---
    // ==========================================
    // Initial Hide Logic for Work
    const allWorkItems = document.querySelectorAll('.timeline-item');
    allWorkItems.forEach((item, index) => {
        if (index >= 5) item.style.display = 'none';
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
});

// Global function for Work Toggle (called by onclick in HTML)
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
        document.getElementById('work').scrollIntoView({behavior: 'smooth'});
    }
}
