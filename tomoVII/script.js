document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal logic
    const chapters = document.querySelectorAll('.fade-in');
    
    const revealOnScroll = () => {
        chapters.forEach(chapter => {
            const chapterTop = chapter.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.85;
            
            if (chapterTop < triggerPoint) {
                chapter.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Start button logic
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        document.getElementById('cap1').scrollIntoView({ behavior: 'smooth' });
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
    });
});
