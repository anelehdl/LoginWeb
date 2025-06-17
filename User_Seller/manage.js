document.addEventListener('DOMContentLoaded', function () {

    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease-out';

            setTimeout(() => {
                successMessage.remove();
            }, 500);
        }, 5000);

        successMessage.addEventListener('click', function () {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                this.remove();
            }, 300);
        });

    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    const cardActions = document.querySelectorAll('.card-action');
    cardActions.forEach(action => {
        action.addEventListener('click', function (e) {
            const cardTitle = this.closest('.card').querySelector('.card-title').textContent;
            console.log(`User clicked: ${cardTitle}`);

            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });

    const dashHeader = document.querySelector('.dash-header');
    if (dashHeader) {
        dashHeader.style.opacity = '0';
        dashHeader.style.transform = 'translateY(-20px)';
        dashHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            dashHeader.style.opacity = '1';
            dashHeader.style.transform = 'translateY(0)';
        }, 100);
    }

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});