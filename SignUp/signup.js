document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('loginForm');
    const detailsForm = document.getElementById('detailsForm');

    if (signupForm && window.location.pathname.toLowerCase().includes('/signup/signup.html')) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const userName = formData.get('userName');
            const email = formData.get('email');
            const password = formData.get('pswd');

            if (!userName || !email || !password) {
                alert('Please fill in all the fields');
                return;
            }

            sessionStorage.setItem('signupData', JSON.stringify({
                userName: userName,
                email: email,
                password: password
            }));

            window.location.href = '../Signup/signupDetails.html';
        });
    }

    if (detailsForm && window.location.pathname.toLowerCase().includes('/signup/signupdetails.html')) {
        detailsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const signupData = JSON.parse(sessionStorage.getItem('signupData') || '{}');

            if (!signupData.userName) {
                alert('Please start process over.');
                window.location.href = '../Signup/signup.html';
                return;
            }

            const formData = new FormData(this);
            const phoneNum = formData.get('phoneNum');
            const address = formData.get('address');
            const userRole = formData.get('userRole');

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

            fetch('signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completeUserData)
            })
                .then(response => response.json())
                .then(data => {
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
                });
        });
    }

    const loginBtn = document.getElementById('login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            window.location.href = '../Login/login.html';
        });
    }
});
