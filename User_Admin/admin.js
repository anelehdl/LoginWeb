document.addEventListener('DOMContentLoaded', function () {
    // Add hover effects to dashboard cards
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

    // Add click tracking for dashboard actions
    const cardActions = document.querySelectorAll('.card-action');
    cardActions.forEach(action => {
        action.addEventListener('click', function (e) {
            const cardTitle = this.closest('.card').querySelector('.card-title').textContent;
            console.log(`User clicked: ${cardTitle}`);

            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';

            // Reset after a short delay (in case navigation fails)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // Press 'Escape' to close success message
        if (e.key === 'Escape' && successMessage) {
            successMessage.click();
        }
    });

    // Add welcome animation
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

    // Animate cards on load
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


