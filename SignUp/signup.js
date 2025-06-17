document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const detailsForm = document.getElementById('detailsForm');

    if (signupForm && window.location.pathname.toLowerCase().includes('signup.html')) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Signup form submitted');

            const formData = new FormData(this);
            const userName = formData.get('userName');
            const email = formData.get('email');
            const password = formData.get('pswd');

            console.log('Form data:', { userName, email, password: '***' });

            if (!userName || !email || !password) {
                alert('Please fill in all the fields');
                return;
            }

            try {
                sessionStorage.setItem('signupData', JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                }));
                console.log('Data saved to sessionStorage');

                window.location.href = './signupDetails.html';
            } catch (error) {
                console.error('Error saving to sessionStorage:', error);
                alert('Error saving data. Please try again.');
            }
        });
    }

    if (detailsForm && window.location.pathname.toLowerCase().includes('signupdetails.html')) {
        detailsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Details form submitted');

            let signupData;
            try {
                signupData = JSON.parse(sessionStorage.getItem('signupData') || '{}');
                console.log('Retrieved signup data:', signupData);
            } catch (error) {
                console.error('Error retrieving signup data:', error);
                alert('Error retrieving signup data. Please start over.');
                window.location.href = './signup.html';
                return;
            }

            if (!signupData.userName) {
                alert('Please start process over.');
                window.location.href = './signup.html';
                return;
            }

            const formData = new FormData(this);
            const phoneNum = formData.get('phoneNum');
            const address = formData.get('address');
            const userRole = formData.get('userRole');

            console.log('Details form data:', { phoneNum, address, userRole });

            if (!phoneNum || !address || !userRole) {
                alert('Please fill in all the fields.');
                return;
            }

            const completeUserData = {
                userName: signupData.userName,
                email: signupData.email,
                password: signupData.password,
                phoneNum: phoneNum,
                address: address,
                userRole: userRole
            };

            console.log('Sending complete user data to server...');

            fetch('signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completeUserData)
            })
                .then(response => {
                    console.log('Response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('Server response:', data);
                    if (data.success) {
                        sessionStorage.removeItem('signupData');
                        alert('Registration successful!');

                        if (userRole === 'buyer') {
                            window.location.href = '../Homepage/homepage.html';
                        } else if (userRole === 'seller') {
                            window.location.href = '../User_Seller/sellerDashboard.html';
                        }
                    } else {
                        alert('Registration failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    alert('Network error. Please try again.');
                });
        });
    }

    const loginBtn = document.getElementById('login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            window.location.href = '../Login/login.html';
        });
    }

    setupEnhancedFeatures();
    setupHeaderButtons();

    if (signupForm) {
        setupSignupPage();
    }
    if (detailsForm) {
        setupDetailsPage();
    }

    document.body.classList.add('loading');
});

function setupEnhancedFeatures() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    const buttons = document.querySelectorAll('input[type="submit"], input[type="button"]');

    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            const container = this.parentElement;
            if (container.classList.contains('input-container')) {
                container.style.transform = 'translateY(-2px)';
            }
        });

        input.addEventListener('blur', function () {
            const container = this.parentElement;
            if (container.classList.contains('input-container')) {
                container.style.transform = 'translateY(0)';
            }
        });
    });

    buttons.forEach(btn => {
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
    });
}

function setupSignupPage() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '50%';
        }, 500);
    }

    const inputs = document.querySelectorAll('#signupForm input[type="text"], #signupForm input[type="email"], #signupForm input[type="password"]');
    inputs.forEach(input => {
        let iconId;
        switch (input.id) {
            case 'userName':
                iconId = 'usernameIcon';
                break;
            case 'email':
                iconId = 'emailIcon';
                break;
            case 'pswd':
                iconId = 'passwordIcon';
                break;
        }
        const icon = document.getElementById(iconId);

        input.addEventListener('input', function () {
            validateSignupInput(this, icon);
        });
    });
}

function setupDetailsPage() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 500);
    }

    const radioOptions = document.querySelectorAll('.radio-option');
    const radioInputs = document.querySelectorAll('input[type="radio"]');

    radioOptions.forEach(option => {
        const radioInput = option.querySelector('input[type="radio"]');

        option.addEventListener('click', function () {
            radioInput.checked = true;
            updateRadioSelection();
        });

        option.setAttribute('tabindex', '0');
    });

    radioInputs.forEach(input => {
        input.addEventListener('change', updateRadioSelection);
    });

    const inputs = document.querySelectorAll('#detailsForm input[type="text"]');
    inputs.forEach(input => {
        let iconId;
        switch (input.id) {
            case 'phoneNum':
                iconId = 'phoneIcon';
                break;
            case 'address':
                iconId = 'addressIcon';
                break;
        }
        const icon = document.getElementById(iconId);

        input.addEventListener('input', function () {
            validateDetailsInput(this, icon);
        });
    });
}

function validateSignupInput(input, icon) {
    const value = input.value.trim();
    let isValid = false;

    switch (input.type) {
        case 'text':
            isValid = value.length >= 3;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'password':
            isValid = value.length >= 6;
            break;
    }

    updateValidationUI(input, icon, value, isValid);
}

function validateDetailsInput(input, icon) {
    const value = input.value.trim();
    let isValid = false;

    switch (input.name) {
        case 'phoneNum':
            isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(value);
            break;
        case 'address':
            isValid = value.length >= 10;
            break;
    }

    updateValidationUI(input, icon, value, isValid);
}

function updateValidationUI(input, icon, value, isValid) {
    if (value.length > 0) {
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (icon) {
                icon.className = 'validation-icon show valid';
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (icon) {
                icon.className = 'validation-icon show invalid';
            }
        }
    } else {
        input.classList.remove('valid', 'invalid');
        if (icon) {
            icon.className = 'validation-icon';
        }
    }
}

function updateRadioSelection() {
    const radioOptions = document.querySelectorAll('.radio-option');
    const radioInputs = document.querySelectorAll('input[type="radio"]');

    radioOptions.forEach(option => {
        option.classList.remove('selected');
    });

    radioInputs.forEach(input => {
        if (input.checked) {
            input.closest('.radio-option').classList.add('selected');
        }
    });
}

function setupHeaderButtons() {
    const signupBtn = document.getElementById('headerSBtn');
    if (signupBtn) {
        signupBtn.classList.add('active');
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);