document.addEventListener('DOMContentLoaded', function () {
    const headerLoginBtn = document.getElementById('headerLBtn');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', function () {
            if (!window.location.href.includes('login.html')) {
                window.location.href = '../Login/login.html';
            }
        });
    }

    const formLoginBtn = document.getElementById('login');
    if (formLoginBtn) {
        formLoginBtn.addEventListener('click', function () {
            window.location.href = '../Login/login.html';
        });
    }

    const signUpBtn = document.getElementById('signup');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function () {
            window.location.href = '../SignUp/signup.html';
        });
    }

    const headerSignupBtn = document.getElementById('headerSBtn');
    if (headerSignupBtn) {
        headerSignupBtn.addEventListener('click', function () {
            window.location.href = '../SignUp/signup.html';
        });
    }

    setupFormEnhancements();
    setupHeaderButtons();
    setupKeyboardShortcuts();

    document.body.classList.add('loading');
});

function setupFormEnhancements() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');
    const submitBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signup');

    [submitBtn, signupBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
    });

    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });

        input.addEventListener('input', function () {
            if (this.value.length > 0) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = 'rgba(30, 60, 107, 0.1)';
            }
        });
    });

    if (form) {
        form.addEventListener('submit', function (e) {

            if (submitBtn) {
                submitBtn.value = 'Logging in...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                setTimeout(() => {
                    submitBtn.value = 'Login';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        });
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && document.activeElement.closest('form')) {
            const form = document.getElementById('loginForm');
            if (form) {
                const submitBtn = document.getElementById('loginBtn');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    });
}

document.head.appendChild(style);