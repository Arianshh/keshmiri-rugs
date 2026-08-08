const WHATSAPP_NUMBER = "989128692978";


function openWhatsApp(category) {

    const text = encodeURIComponent(
        `Hello Keshmiri Rugs, I want to see more or purchase from the ${category || "Persian Rugs"} collection.`
    );

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
        "_blank"
    );
}


document.addEventListener("click", e => {

    const btn = e.target.closest("[data-wa]");

    if (btn) {
        openWhatsApp(btn.dataset.category);
    }

});


/* =========================
   Old Signature Toggle
========================= */


const signatureToggle = document.getElementById("signatureToggle");
const signaturePanel = document.getElementById("signaturePanel");


if (signatureToggle && signaturePanel) {

    signatureToggle.addEventListener("click", () => {

        signaturePanel.classList.toggle("open");


        signatureToggle.innerText =
            signaturePanel.classList.contains("open")
                ? "Hide Signature Collection"
                : "View Signature Collection";

    });

}


/* =========================
   Rug Image Gallery
========================= */


function openRugGallery(trigger) {


    if (!trigger || !window.PhotoSwipe) {

        console.error("PhotoSwipe is not loaded");

        return;

    }


    const imageItems = [];


    const mainImage = trigger.dataset.mainImage;
    const mainTitle = trigger.dataset.mainTitle || "";


    const detailImage = trigger.dataset.detailImage;
    const detailTitle = trigger.dataset.detailTitle || "";


    if (mainImage) {

        imageItems.push({

            src: mainImage,
            title: mainTitle

        });

    }


    if (detailImage) {

        imageItems.push({

            src: detailImage,
            title: detailTitle

        });

    }


    if (!imageItems.length) {
        return;
    }


    Promise.all(
        imageItems.map(item => {


            return new Promise((resolve, reject) => {


                const image = new Image();


                image.onload = () => {

                    resolve({

                        src: item.src,

                        width: image.naturalWidth,

                        height: image.naturalHeight,

                        alt: item.title

                    });

                };


                image.onerror = reject;


                image.src = item.src;


            });


        })
    )


        .then(dataSource => {


            const gallery = new PhotoSwipe({

                dataSource,

                index: 0,

                wheelToZoom: true,

                showHideAnimationType: "fade",

                bgOpacity: 0.94


            });


            let indicator = null;


            if (dataSource.length > 1) {


                gallery.on("uiRegister", () => {


                    gallery.ui.registerElement({

                        name: "rugIndicator",

                        order: 9,

                        isButton: false,

                        appendTo: "bar",


                        onInit: (el, pswp) => {


                            indicator =
                                document.createElement("div");


                            indicator.className =
                                "rug-slide-indicator";


                            const updateIndicator = () => {


                                const current =
                                    pswp.currIndex + 1;


                                indicator.innerHTML = `


                                <span class="rug-counter">

                                    ${current}
                                    /
                                    ${dataSource.length}

                                </span>


                                <span class="rug-dots">

                                    ${dataSource.map((_, i) => `

                                        <span class="
                                            ${i === pswp.currIndex ? "active" : ""}
                                        "></span>

                                    `).join("")}


                                </span>


                            `;


                            };


                            updateIndicator();


                            el.appendChild(indicator);


                            pswp.on(
                                "change",
                                updateIndicator
                            );


                        }

                    });


                });


            }


            gallery.init();


        })


        .catch(error => {


            console.error(
                "Could not load rug gallery images",
                error
            );


        });


}


document
    .querySelectorAll("[data-rug-gallery]")
    .forEach(trigger => {


        trigger.addEventListener(
            "click",
            event => {


                event.preventDefault();


                openRugGallery(trigger);


            }
        );


    });


/* =========================
   Rug Detail Popup
========================= */


const rugDetailModal =
    document.getElementById("rugDetailModal");


const rugDetailTitle =
    document.getElementById("rugDetailTitle");


const rugDetailContent =
    document.getElementById("rugDetailContent");


document
    .querySelectorAll("[data-rug-detail-open]")
    .forEach(button => {


        button.addEventListener("click", () => {


            const name =
                button.dataset.rugName;


            const description =
                button.dataset.rugDescription;


            rugDetailTitle.innerText =
                name;


            const clean = value => {

                if (
                    !value ||
                    value === "None" ||
                    value === "null"
                ) {

                    return "";

                }

                return value;

            };


            const dimension =
                clean(button.dataset.rugDimension);


            const warp =
                clean(button.dataset.rugWarp);


            const pile =
                clean(button.dataset.rugPile);


            const price =
                clean(button.dataset.rugPrice);


            const available =
                clean(button.dataset.rugAvailable);


            rugDetailContent.innerHTML = `



${dimension ?
                `
<div class="rug-meta">
<strong>Dimension</strong>
<span>${dimension}</span>
</div>
`
                : ""}
                


            ${warp ?
                `<p><strong>Warp:</strong> ${warp}</p>`
                : ""}



            ${pile ?
                `<p><strong>Pile:</strong> ${pile}</p>`
                : ""}



            ${price ?
                `<p><strong>Price:</strong> $${price}</p>`
                : ""}



            ${available ?
                `<p>
                <strong>Status:</strong>
                ${available === "True"
                    ? "Available"
                    : "Unavailable"}
            </p>`
                : ""}



            ${description ?
                `
            <hr>

            <p>
                ${description.replace(/\n/g, "<br>")}
            </p>
            `
                : ""}



        `;


            rugDetailModal.classList.add("open");


        });


    });


document
    .querySelector(".rug-detail-close")
    ?.addEventListener("click", () => {


        rugDetailModal.classList.remove("open");


    });


document
    .querySelector(".rug-detail-overlay")
    ?.addEventListener("click", () => {


        rugDetailModal.classList.remove("open");


    });

document
    .querySelectorAll("[data-info-open]")
    .forEach(button => {


        button.addEventListener("click", () => {


            const target =
                document.getElementById(
                    button.dataset.infoOpen
                );


            if (target) {

                target.classList.add("open");

            }


        });


    });


document
    .querySelectorAll(".info-modal-close")
    .forEach(button => {


        button.addEventListener("click", () => {


            button
                .closest(".info-modal")
                .classList.remove("open");


        });


    });


document
    .querySelectorAll(".info-modal")
    .forEach(modal => {


        modal.addEventListener("click", e => {


            if (e.target === modal) {

                modal.classList.remove("open");

            }


        });


    });

document
    .querySelectorAll("[data-description-open]")
    .forEach(button => {


        button.addEventListener("click", () => {


            const modal =
                document.getElementById(
                    button.dataset.descriptionOpen
                );


            if (modal) {

                modal.classList.add("open");

            }


        });


    });

const description =
    document.querySelector(".category-short-description");

const moreButton =
    document.getElementById("categoryMoreBtn");


if (description && moreButton) {

    if (
        description.scrollHeight <=
        description.clientHeight
    ) {

        moreButton.style.display = "none";

    }

}
const whyData = {

    heritage: {

        title: "Founded in Tabriz",

        image: "/static/assets/why/heritage.jpg",

        text: "Our family's journey began in 1959. For more than six decades we've carefully curated authentic Persian rugs."

    },

    generation: {

        title: "Three Generations",

        image: "/static/assets/why/generation.jpg",

        text: "Knowledge has been passed from one generation to the next, preserving expertise in Persian weaving traditions."

    },

    authentic: {

        title: "Authentic Handwoven Rugs",

        image: "/static/assets/why/authentic.jpg",

        text: "Every rug is handmade using traditional techniques, carrying its own history and unique character."

    },

    world: {

        title: "Worldwide Delivery",

        image: "/static/assets/why/world.jpg",

        text: "We work with collectors, designers and homeowners around the world to bring Persian craftsmanship wherever it belongs."

    }

};


document.querySelectorAll(".why-tab").forEach(tab => {

    tab.addEventListener("mouseenter", () => {

        document
            .querySelector(".why-tab.active")
            ?.classList.remove("active");

        tab.classList.add("active");

        const item = whyData[tab.dataset.target];

        document.getElementById("whyTitle").textContent = item.title;

        document.getElementById("whyText").textContent = item.text;


    });

});
(() => {
    const page = document.querySelector('[data-about-page]');
    if (!page) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollToTarget = (id) => {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'start'});
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
        }, {threshold: 0.18});
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
        }, {rootMargin: '-32% 0px -48% 0px', threshold: [0, .2, .5, .8]});
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
const collectionItems =
    document.querySelectorAll(".collection-item");


const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });


    }, {
        threshold: .15
    });


collectionItems.forEach(item => {
    observer.observe(item);
});