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

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = 'x';
        closeBtn.style.cssText = 'position: absolute; top: 5px; right: 10px; font-size: 20px; cursor: pointer; color: #155724;';
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        });
        successMessage.style.position = 'relative';
        successMessage.appendChild(closeBtn);
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

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successMessage) {
            successMessage.click();
        }
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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;

    const styles = {
        success: {
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb'
        },
        error: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
        },
        info: {
            backgroundColor: '#d1ecf1',
            color: '#0c5460',
            border: '1px solid #bee5eb'
        }
    };

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: bold;
        min-width: 300px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    Object.assign(notification.style, styles[type] || styles.success);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}