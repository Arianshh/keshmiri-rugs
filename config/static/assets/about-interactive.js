(() => {
    const page = document.querySelector('[data-about-page]');
    if (!page) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollToTarget = (id) => {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    };

    page.querySelectorAll('[data-scroll-to]').forEach((button) => {
        button.addEventListener('click', () => scrollToTarget(button.dataset.scrollTo));
    });

    const revealItems = page.querySelectorAll('.reveal-on-scroll');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.18 });
        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const chapters = page.querySelectorAll('[data-about-chapter]');
    const progress = page.querySelector('.about-progress');
    const progressButtons = page.querySelectorAll('.about-progress-dot');

    if ('IntersectionObserver' in window) {
        const chapterObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;

            const chapter = visible.target.dataset.aboutChapter;
            progressButtons.forEach((button) => {
                button.classList.toggle('is-active', button.dataset.scrollTo === visible.target.id);
            });
            progress?.classList.toggle('is-over-dark', visible.target.classList.contains('is-dark'));
            page.dataset.activeChapter = chapter;
        }, { rootMargin: '-32% 0px -48% 0px', threshold: [0, .2, .5, .8] });
        chapters.forEach((chapter) => chapterObserver.observe(chapter));
    }

    const approachData = {
        curated: {
            number: '01',
            title: 'Carefully Curated',
            html: `<p>Today, Keshmiri Rugs carefully curates handwoven pieces from across Persia, working directly with skilled weavers, trusted workshops, and established collectors.</p><p>Our collection includes antique, semi-antique, and contemporary rugs, selected for their craftsmanship, materials, design, condition, and cultural significance.</p>`
        },
        authenticity: {
            number: '02',
            title: 'Authenticity and Knowledge',
            html: document.getElementById('about-copy-authenticity')?.innerHTML || ''
        },
        identity: {
            number: '03',
            title: 'Every rug has its own identity',
            html: document.getElementById('about-copy-identity')?.innerHTML || ''
        },
        guidance: {
            number: '04',
            title: 'Our expertise',
            html: document.getElementById('about-copy-guidance')?.innerHTML || ''
        }
    };

    const approachTabs = page.querySelectorAll('[data-about-tab]');
    const approachStage = page.querySelector('.about-tab-stage');
    const stageNumber = document.getElementById('aboutStageNumber');
    const stageTitle = document.getElementById('aboutStageTitle');
    const stageCopy = document.getElementById('aboutStageCopy');

    const activateApproach = (tab) => {
        const item = approachData[tab.dataset.aboutTab];
        if (!item || !stageNumber || !stageTitle || !stageCopy) return;
        approachTabs.forEach((candidate) => {
            const active = candidate === tab;
            candidate.classList.toggle('is-active', active);
            candidate.setAttribute('aria-selected', String(active));
        });
        stageNumber.textContent = item.number;
        stageTitle.textContent = item.title;
        stageCopy.innerHTML = item.html;
        approachStage?.classList.remove('is-switching');
        void approachStage?.offsetWidth;
        approachStage?.classList.add('is-switching');
    };

    approachTabs.forEach((tab) => {
        tab.addEventListener('mouseenter', () => activateApproach(tab));
        tab.addEventListener('focus', () => activateApproach(tab));
        tab.addEventListener('click', () => activateApproach(tab));
    });

    const worldwideCopy = document.getElementById('about-copy-worldwide')?.textContent.trim() || '';
    const worldwideData = {
        certificate: 'To provide confidence and transparency, each rug is accompanied by a certificate of authenticity detailing its origin, materials, craftsmanship, and other important characteristics.',
        consultation: worldwideCopy,
        appointments: worldwideCopy,
        shipping: worldwideCopy
    };

    const worldwideTabs = page.querySelectorAll('[data-worldwide-tab]');
    const worldwideStage = page.querySelector('.about-worldwide-stage');
    const worldwideStageCopy = document.getElementById('worldwideStageCopy');

    const activateWorldwide = (tab) => {
        if (!worldwideStageCopy) return;
        worldwideTabs.forEach((candidate) => {
            const active = candidate === tab;
            candidate.classList.toggle('is-active', active);
            candidate.setAttribute('aria-selected', String(active));
        });
        worldwideStageCopy.textContent = worldwideData[tab.dataset.worldwideTab] || worldwideCopy;
        worldwideStage?.classList.remove('is-switching');
        void worldwideStage?.offsetWidth;
        worldwideStage?.classList.add('is-switching');
    };

    worldwideTabs.forEach((tab) => {
        tab.addEventListener('mouseenter', () => activateWorldwide(tab));
        tab.addEventListener('focus', () => activateWorldwide(tab));
        tab.addEventListener('click', () => activateWorldwide(tab));
    });
})();
