function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.productCards');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.itemTitle').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        if (searchTerm === '') {
            productCards.forEach((card, index) => {
                card.style.display = 'block';
                card.style.animationDelay = (index * 0.1) + 's';
            });
        }
    });
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.productCards');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            this.style.transform = 'translateY(-15px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });

        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();

                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.productCards').forEach(card => {
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupSearch();
    setupCardInteractions();
    setupTabs();
    setupScrollAnimations();

    document.body.classList.add('loading');
});