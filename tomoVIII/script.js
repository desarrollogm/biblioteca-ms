document.addEventListener('DOMContentLoaded', () => {
    // 1. Botón de inicio
    const startBtn = document.getElementById('start-btn');
    const cap1 = document.getElementById('cap1');

    startBtn.addEventListener('click', () => {
        cap1.scrollIntoView({ behavior: 'smooth' });
    });

    // 2. Observer para animaciones de entrada (Fade In)
    const observerOptions = {
        threshold: 0.2
    };

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Efecto parallax en la imagen
                const img = entry.target.querySelector('.image-block');
                if (img) img.style.transform = 'scale(1)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.chapter').forEach(chapter => {
        chapterObserver.observe(chapter);
    });

    // 3. Efecto Parallax en el Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    });

    // 4. Mensaje táctico en consola (Magisterio Sonorense Mode)
    console.log("%c MAGISTERIO SONORENSE %c SOBERANÍA ESTRATÉGICA ACTIVA ", 
                "background: #FFD700; color: #000; font-weight: bold; padding: 5px; border-radius: 3px 0 0 3px;",
                "background: #E31C25; color: #fff; font-weight: bold; padding: 5px; border-radius: 0 3px 3px 0;");
});
