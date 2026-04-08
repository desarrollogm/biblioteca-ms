/**
 * EL JUEGO DE LAS PENSIONES
 * Interactive Storybook Navigation & Animations
 */

(function () {
    'use strict';

    // === DOM Elements ===
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const progressFill = document.getElementById('progressFill');
    const bookNav = document.getElementById('bookNav');

    // === State ===
    let currentPage = 0;
    const totalPages = pages.length;
    let isTransitioning = false;
    let navTimeout = null;

    // === Initialize ===
    function init() {
        updateUI();
        bindEvents();
        showNav();
    }

    // === Scroll helpers ===
    function getActivePage() {
        return pages[currentPage];
    }

    function getActiveTextContainer() {
        return pages[currentPage].querySelector('.chapter-text-container');
    }

    function isPageScrollable() {
        const tc = getActiveTextContainer();
        if (!tc) return false;
        return tc.scrollHeight > tc.clientHeight + 10;
    }

    function isAtTop() {
        const tc = getActiveTextContainer();
        if (!tc) return true;
        return tc.scrollTop <= 5;
    }

    function isAtBottom() {
        const tc = getActiveTextContainer();
        if (!tc) return true;
        return tc.scrollTop + tc.clientHeight >= tc.scrollHeight - 5;
    }

    // === Navigation ===
    function goToPage(index) {
        if (isTransitioning || index < 0 || index >= totalPages || index === currentPage) return;

        isTransitioning = true;

        const direction = index > currentPage ? 1 : -1;
        const currentEl = pages[currentPage];
        const nextEl = pages[index];

        // Remove active from current page
        currentEl.classList.remove('active');
        if (direction > 0) currentEl.classList.add('exit-left');

        // Prepare next page — reset scroll on text container
        const nextTextContainer = nextEl.querySelector('.chapter-text-container');
        if (nextTextContainer) nextTextContainer.scrollTop = 0;

        // Set initial position for transition
        nextEl.style.transform = direction > 0 ? 'translateX(60px)' : 'translateX(-60px)';

        // Force reflow so the initial transform registers before transition
        nextEl.offsetHeight;

        // Clear inline transform so CSS .active transition takes over
        nextEl.style.transform = '';
        nextEl.classList.add('active');

        // Clean up after transition completes
        setTimeout(() => {
            currentEl.classList.remove('exit-left');
            currentEl.style.transform = '';
            isTransitioning = false;

            // Force text container to recalculate scroll
            const tc = nextEl.querySelector('.chapter-text-container');
            if (tc) {
                tc.style.overflowY = 'hidden';
                tc.offsetHeight; // Force reflow
                tc.style.overflowY = 'auto';
            }
        }, 850);

        currentPage = index;
        updateUI();
        resetAnimations(nextEl);
        showNav();
    }

    function nextPage() {
        goToPage(currentPage + 1);
    }

    function prevPage() {
        goToPage(currentPage - 1);
    }

    // === UI Updates ===
    function updateUI() {
        // Page indicator
        pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;

        // Progress bar
        const progress = (currentPage / (totalPages - 1)) * 100;
        progressFill.style.width = `${progress}%`;

        // Button states
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    function resetAnimations(pageEl) {
        // Force re-trigger CSS animations by removing and re-adding the active class
        const animatedElements = pageEl.querySelectorAll(
            '.chapter-number, .chapter-title, .chapter-epigraph, .chapter-body, .endcover-title, .endcover-colophon'
        );

        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Force reflow
            el.style.animation = '';
        });
    }

    // === Nav Visibility ===
    function showNav() {
        bookNav.style.opacity = '1';
        bookNav.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(navTimeout);
        navTimeout = setTimeout(() => {
            if (currentPage !== 0 && currentPage !== totalPages - 1) {
                bookNav.style.opacity = '0.3';
            }
        }, 4000);
    }

    // === Fullscreen ===
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    }

    // === Event Bindings ===
    function bindEvents() {
        // Button clicks
        prevBtn.addEventListener('click', prevPage);
        nextBtn.addEventListener('click', nextPage);
        fullscreenBtn.addEventListener('click', toggleFullscreen);

        // Keyboard navigation — allow in-page scrolling
        document.addEventListener('keydown', (e) => {
            const pg = getActivePage();
            const scrollable = isPageScrollable();

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    nextPage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevPage();
                    break;
                case 'ArrowDown':
                case ' ':
                    if (scrollable && !isAtBottom()) {
                        // Let the page scroll naturally, don't change page
                        return;
                    }
                    e.preventDefault();
                    nextPage();
                    break;
                case 'ArrowUp':
                    if (scrollable && !isAtTop()) {
                        // Let the page scroll naturally, don't change page
                        return;
                    }
                    e.preventDefault();
                    prevPage();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToPage(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToPage(totalPages - 1);
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
            }
        });

        // Click on page edges to advance (but NOT on text area)
        document.querySelector('.book-container').addEventListener('click', (e) => {
            if (e.target.closest('.book-nav')) return;
            if (e.target.closest('.nav-btn')) return;
            if (e.target.closest('.chapter-text-container')) return;

            const rect = document.querySelector('.book-container').getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const halfWidth = rect.width / 2;

            if (clickX > halfWidth) {
                nextPage();
            } else {
                prevPage();
            }
        });

        // Touch / Swipe support
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextPage();
                } else {
                    prevPage();
                }
            }
        }, { passive: true });

        // Mouse wheel — scroll within page first, then change page at boundaries
        let wheelPageChangeTimeout = null;
        document.addEventListener('wheel', (e) => {
            const pg = getActivePage();
            const scrollable = isPageScrollable();

            if (scrollable) {
                if (e.deltaY > 30 && isAtBottom()) {
                    if (wheelPageChangeTimeout) return;
                    wheelPageChangeTimeout = setTimeout(() => { wheelPageChangeTimeout = null; }, 600);
                    nextPage();
                } else if (e.deltaY < -30 && isAtTop()) {
                    if (wheelPageChangeTimeout) return;
                    wheelPageChangeTimeout = setTimeout(() => { wheelPageChangeTimeout = null; }, 600);
                    prevPage();
                }
                // Otherwise, let the page scroll naturally
                return;
            }

            // Non-scrollable pages (cover, endcover) — use original behavior
            if (wheelPageChangeTimeout) return;
            wheelPageChangeTimeout = setTimeout(() => { wheelPageChangeTimeout = null; }, 800);

            if (e.deltaY > 30) {
                nextPage();
            } else if (e.deltaY < -30) {
                prevPage();
            }
        }, { passive: true });

        // Show nav on mouse move
        document.addEventListener('mousemove', showNav);
    }

    // === Start ===
    document.addEventListener('DOMContentLoaded', init);
})();
