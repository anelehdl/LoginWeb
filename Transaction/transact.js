document.addEventListener('DOMContentLoaded', function () {
    loadOrderSummary();
    setupFormValidation();
    setupRealTimeValidation();
});

function loadOrderSummary() {
    const checkoutSummary = JSON.parse(localStorage.getItem('checkoutSummary'));

    if (!checkoutSummary || !checkoutSummary.items || checkoutSummary.items.length === 0) {
        window.location.href = '../Transaction/cart.html';
        return;
    }

    displayOrderItems(checkoutSummary.items);
    displayOrderTotals(checkoutSummary);
}

function displayOrderItems(items) {
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';

    items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">R${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
}

function displayOrderTotals(summary) {
    document.getElementById('summarySubtotal').textContent = `R${summary.subtotal.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `R${summary.tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `R${summary.total.toFixed(2)}`;
}

function setupFormValidation() {
    const form = document.getElementById('paymentForm');
    form.addEventListener('submit', handleFormSubmit);
}

function setupRealTimeValidation() {
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function (e) {
        formatCardNumber(e.target);
        validateCardNumber(e.target.value);
    });

    cardNumberInput.addEventListener('blur', function (e) {
        validateCardNumber(e.target.value);
    });

    const expiryInput = document.getElementById('expiryDate');
    expiryInput.addEventListener('input', function (e) {
        formatExpiryDate(e.target);
        validateExpiryDate(e.target.value);
    });

    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', function (e) {
        formatCVV(e.target);
        validateCVV(e.target.value);
    });

    const fields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode', 'cardName'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('blur', function () {
            validateField(fieldId, field.value);
        });
    });
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, 'R1 ');
    input.value = value;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function formatCVV(input) {
    input.value = input.value.replace(/\D/g, '');
}

function validateField(fieldId, value) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    let isValid = true;
    let errorMessage = '';

    field.classList.remove('error', 'success');

    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Must be at least 2 characters long';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Only letters and spaces allowed';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'address':
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'Address is required';
            } else if (value.trim().length < 5) {
                isValid = false;
                errorMessage = 'Please enter a complete address';
            }
            break;

        case 'city':
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'City is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Only letters and spaces allowed';
            }
            break;

        case 'zipCode':
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'Postal code is required';
            } else if (!/^\d{4}$/.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid 4-digit postal code';
            }
            break;

        case 'cardName':
            if (!value.trim()) {
                isValid = false;
                errorMessage = 'Name on card is required';
            } else if (value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter the full name as on card';
            }
            break;
    }

    if (isValid) {
        field.classList.add('success');
        errorElement.textContent = '';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

function validateCardNumber(cardNumber) {
    const field = document.getElementById('cardNumber');
    const errorElement = document.getElementById('cardNumberError');
    const cleanNumber = cardNumber.replace(/\D/g, '');

    field.classList.remove('error', 'success');

    if (!cleanNumber) {
        field.classList.add('error');
        errorElement.textContent = 'Card number is required';
        return false;
    }

    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        field.classList.add('error');
        errorElement.textContent = 'Card number must be 13-19 digits';
        return false;
    }

    field.classList.add('success');
    errorElement.textContent = '';
    return true;
}

function validateExpiryDate(expiryDate) {
    const field = document.getElementById('expiryDate');
    const errorElement = document.getElementById('expiryDateError');

    field.classList.remove('error', 'success');

    if (!expiryDate) {
        field.classList.add('error');
        errorElement.textContent = 'Expiry date is required';
        return false;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
        field.classList.add('error');
        errorElement.textContent = 'Please enter date in MM/YY format';
        return false;
    }

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        field.classList.add('error');
        errorElement.textContent = 'Card has expired';
        return false;
    }

    if (expYear > currentYear + 10) {
        field.classList.add('error');
        errorElement.textContent = 'Expiry date seems too far in the future';
        return false;
    }

    field.classList.add('success');
    errorElement.textContent = '';
    return true;
}

function validateCVV(cvv) {
    const field = document.getElementById('cvv');
    const errorElement = document.getElementById('cvvError');

    field.classList.remove('error', 'success');

    if (!cvv) {
        field.classList.add('error');
        errorElement.textContent = 'CVV is required';
        return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
        field.classList.add('error');
        errorElement.textContent = 'CVV must be 3 or 4 digits';
        return false;
    }

    if (!/^\d+$/.test(cvv)) {
        field.classList.add('error');
        errorElement.textContent = 'CVV must contain only numbers';
        return false;
    }

    field.classList.add('success');
    errorElement.textContent = '';
    return true;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const isFirstNameValid = validateField('firstName', document.getElementById('firstName').value);
    const isLastNameValid = validateField('lastName', document.getElementById('lastName').value);
    const isEmailValid = validateField('email', document.getElementById('email').value);
    const isAddressValid = validateField('address', document.getElementById('address').value);
    const isCityValid = validateField('city', document.getElementById('city').value);
    const isZipCodeValid = validateField('zipCode', document.getElementById('zipCode').value);
    const isCardNameValid = validateField('cardName', document.getElementById('cardName').value);
    const isCardNumberValid = validateCardNumber(document.getElementById('cardNumber').value);
    const isExpiryDateValid = validateExpiryDate(document.getElementById('expiryDate').value);
    const isCVVValid = validateCVV(document.getElementById('cvv').value);

    const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid &&
        isAddressValid && isCityValid && isZipCodeValid &&
        isCardNameValid && isCardNumberValid && isExpiryDateValid && isCVVValid;

    if (isFormValid) {
        processPayment();
    } else {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }

        showNotification('Please fix the errors below', 'error');
    }
}

function processPayment() {
    const submitButton = document.getElementById('submitPayment');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    setTimeout(() => {
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const checkoutSummary = JSON.parse(localStorage.getItem('checkoutSummary'));
        const total = checkoutSummary.total;

        showSuccessModal(orderId, total);

        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutSummary');

        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function showSuccessModal(orderId, total) {
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('finalTotal').textContent = `R${total.toFixed(2)}`;
    document.getElementById('successModal').style.display = 'block';

    document.body.style.overflow = 'hidden';
}

function goToHomepage() {
    window.location.href = '../Homepage/homepage.html';
}

function printReceipt() {
    const checkoutSummary = JSON.parse(localStorage.getItem('checkoutSummary')) ||
        { items: [], subtotal: 0, tax: 0, total: 0 };
    const orderId = document.getElementById('orderId').textContent;

    const receiptContent = `
        <html>
        <head>
            <title>Purchase Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .order-info { margin-bottom: 20px; }
                .items { margin-bottom: 20px; }
                .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .totals { border-top: 2px solid #333; padding-top: 10px; }
                .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .final-total { font-weight: bold; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Local Market</h1>
                <h2>Purchase Receipt</h2>
            </div>
            <div class="order-info">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
            <div class="items">
                <h3>Items Purchased:</h3>
                ${checkoutSummary.items.map(item => `
                    <div class="item">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>R${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>R${checkoutSummary.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (15%):</span>
                    <span>R${checkoutSummary.tax.toFixed(2)}</span>
                </div>
                <div class="total-row final-total">
                    <span>Total:</span>
                    <span>R${checkoutSummary.total.toFixed(2)}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 40px; color: #666;">
                <p>Thank you for your purchase!</p>
                <p>Visit us again at Local Market</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const backgroundColor = type === 'error' ? '#ff4757' : '#667eea';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.onclick = function (event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        goToHomepage();
    }
} 