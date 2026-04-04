document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GRID BACKGROUND GENERATION & ANIMATION ---
    const gridContainer = document.querySelector('.grid-background');
    if (gridContainer) {
        const cellSize = 50; // Size in pixels
        const cols = Math.floor(window.innerWidth / cellSize);
        const rows = Math.floor(window.innerHeight / cellSize);

        // Set CSS Grid Layout
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        // Create Cells
        const totalCells = cols * rows;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            gridContainer.appendChild(cell);
        }

        // Global Mouse Interaction for Grid
        let previousIndex = -1;

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Calculate grid coordinates
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);

            // Calculate linear index
            const index = row * cols + col;

            // Boundary checks
            if (index < 0 || index >= totalCells || col < 0 || col >= cols || row < 0 || row >= rows) {
                if (previousIndex !== -1) clearHighlights(previousIndex);
                previousIndex = -1;
                return;
            }

            // Optimization: Only update if the cell changed
            if (index !== previousIndex) {
                if (previousIndex !== -1) clearHighlights(previousIndex);
                applyHighlights(index);
                previousIndex = index;
            }
        });

        document.addEventListener('mouseleave', () => {
            if (previousIndex !== -1) {
                clearHighlights(previousIndex);
                previousIndex = -1;
            }
        });

        function getNeighbors(index, radius = 1) {
            const neighbors = [];
            const r = Math.floor(index / cols);
            const c = index % cols;

            for (let dr = -radius; dr <= radius; dr++) {
                for (let dc = -radius; dc <= radius; dc++) {
                    if (dr === 0 && dc === 0) continue; // Skip center

                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        neighbors.push({
                            index: nr * cols + nc,
                            distance: Math.max(Math.abs(dr), Math.abs(dc)) // Chebyshev distance
                        });
                    }
                }
            }
            return neighbors;
        }

        function applyHighlights(index) {
            const cells = gridContainer.children;
            if (!cells[index]) return;

            // Highlight Center
            cells[index].classList.remove('neighbor', 'neighbor-far'); // Safety clear
            cells[index].classList.add('active');

            // Get Neighbors (Radius 2)
            const neighbors = getNeighbors(index, 2);

            neighbors.forEach(n => {
                const cell = cells[n.index];
                if (!cell) return;

                // Clear potential conflicts
                cell.classList.remove('active', 'neighbor', 'neighbor-far');

                if (n.distance === 1) {
                    cell.classList.add('neighbor');
                } else if (n.distance === 2) {
                    cell.classList.add('neighbor-far');
                }
            });
        }

        function clearHighlights(index) {
            const cells = gridContainer.children;
            if (!cells[index]) return; // Safety

            cells[index].classList.remove('active');

            const neighbors = getNeighbors(index, 2);
            neighbors.forEach(n => {
                const cell = cells[n.index];
                if (cell) cell.classList.remove('neighbor', 'neighbor-far');
            });
        }
    }

    // --- 2. GLOBAL TIMELINE ---
    let introTimeline = anime.timeline({
        autoplay: false,
        easing: 'easeOutExpo',
        duration: 1000
    });

    introTimeline
        .add({
            targets: '.site-logo',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 800
        })
        .add({
            targets: '.nav-item',
            opacity: [0, 1],
            translateY: [-20, 0],
            delay: anime.stagger(100),
        }, '-=600')
        .add({
            targets: '.intro-content .greeting',
            opacity: [0, 1],
            translateY: [20, 0],
        }, '-=400')
        .add({
            targets: '.intro-content .subtitle',
            opacity: [0, 1],
            translateY: [20, 0],
        }, '-=800')
        // *** UPDATED TARGET FOR NEW SOCIAL ICONS STRUCTURE ***
        .add({
            targets: '.social-list li', 
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.5, 1],
            delay: anime.stagger(100)
        }, '-=500')
        .add({
            targets: '#clock-widget',
            opacity: [0, 1],
            duration: 800
        }, '-=800');

    // --- PRELOADER ---
    const loader = document.querySelector('.loading');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                introTimeline.play();
            }, 500);
        }, 800);
    } else {
        introTimeline.play();
    }

    // --- 3. CLOCK (BAGHDAD TIME) ---
    function updateClock() {
        const clockElement = document.getElementById('clock-widget');
        if (clockElement) {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Baghdad',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const timeString = now.toLocaleTimeString('en-US', options);
            clockElement.textContent = `My Time: ${timeString}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 4. SCROLL TRIGGERS ---
    // A. SVG LINE DRAWING
    const titles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const path = entry.target.querySelector('path');
                if (path) {
                    path.style.strokeDasharray = '200';
                    path.style.strokeDashoffset = '200';
                    anime({
                        targets: path,
                        strokeDashoffset: [anime.setDashoffset, 0],
                        easing: 'easeInOutSine',
                        duration: 1500,
                        direction: 'alternate',
                        loop: false
                    });
                }
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    titles.forEach(t => titleObserver.observe(t));

    // B. SECTION REVEAL
    const sections = document.querySelectorAll('.scroll-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    easing: 'easeOutQuad',
                    duration: 1000
                });
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(sec => sectionObserver.observe(sec));

    // C. SKILLS STAGGER
    const skillsSection = document.querySelector('#skills');
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: skillCards,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    delay: anime.stagger(150),
                    easing: 'easeOutQuad',
                    complete: function (anim) {
                        document.querySelectorAll('.skill-card').forEach((card, index) => {
                            anime({
                                targets: card.querySelectorAll('.tag-item'),
                                opacity: [0, 1],
                                scale: [0.5, 1],
                                delay: anime.stagger(50),
                                easing: 'spring(1, 80, 10, 0)'
                            });
                        });
                    }
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    if (skillsSection) skillObserver.observe(skillsSection);

    // D. PROJECT STAGGER
    const projectGrid = document.querySelector('.project-grid');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: '.project-card',
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    delay: anime.stagger(100, { grid: [1, 8], from: 'center' }),
                    easing: 'easeOutElastic(1, .8)',
                    duration: 800
                });
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    if (projectGrid) projectObserver.observe(projectGrid);


    // --- 5. INTERACTIVE ANIMATIONS ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.03,
                boxShadow: '0px 15px 30px rgba(0,0,0,0.15)',
                duration: 800,
                easing: 'easeOutElastic(1, .6)'
            });
        });
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                duration: 600,
                easing: 'easeOutExpo'
            });
        });
    });

    // Cat Dance
    const catScene = document.getElementById('cat-scene');
    const catSound = new Audio('maw.mp3');
    catSound.volume = 0.5;

    if (catScene) {
        catScene.addEventListener('click', () => {
            catSound.currentTime = 0;
            catSound.play().catch(e => console.log('Audio error', e));

            anime({
                targets: '.cat-image',
                keyframes: [
                    { translateY: -10, scaleY: 0.95, duration: 100 },
                    { translateY: -40, scaleY: 1.1, duration: 250 },
                    { rotate: 15, duration: 100 },
                    { rotate: -15, duration: 100 },
                    { rotate: 0, translateY: 0, scaleY: 1, duration: 300 }
                ],
                easing: 'easeOutQuad',
            });
        });
    }

    // --- 6. TYPING ---
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

    // --- 7. UTILITIES ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const viewMoreBtn = document.getElementById('toggle-projects-btn');
    const LIMIT = 4;
    let currentCategory = 'all';
    let isExpanded = false;

    function renderProjects() {
        let visibleCount = 0;
        let totalMatches = 0;
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matches = (currentCategory === 'all') || (category === currentCategory);
            if (matches) {
                totalMatches++;
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
        if (viewMoreBtn) {
            if (totalMatches > LIMIT) {
                viewMoreBtn.style.display = 'inline-block';
                viewMoreBtn.textContent = isExpanded ? 'Show Less' : 'View More';
            } else {
                viewMoreBtn.style.display = 'none';
            }
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            isExpanded = false;
            renderProjects();
        });
    });

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            renderProjects();
        });
    }
    renderProjects();

    // Initial Hide Logic for Work Experience
    const allWorkItems = document.querySelectorAll('.timeline-item');
    allWorkItems.forEach((item, index) => {
        if (index >= 5) item.style.display = 'none';
    });
});

function toggleWork() {
    const allWorkItems = document.querySelectorAll('.timeline-item');
    const btn = document.getElementById('show-more-work');
    const isHidden = allWorkItems[5].style.display === 'none';

    if (isHidden) {
        allWorkItems.forEach((item, index) => {
            if (index >= 5) {
                item.style.display = 'block';
                anime({
                    targets: item,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    easing: 'easeOutQuad',
                    duration: 500
                });
            }
        });
        btn.textContent = 'Show Less';
    } else {
        allWorkItems.forEach((item, index) => {
            if (index >= 5) item.style.display = 'none';
        });
        btn.textContent = 'Show More History';
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    }
}
