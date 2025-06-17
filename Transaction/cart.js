document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', proceedToCheckout);
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        displayEmptyCart();
        cartSummary.style.display = 'none';
        return;
    }

    cartContent.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartContent.appendChild(cartItem);
    });

    cartSummary.style.display = 'block';
    updateCartSummary();
}

function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-index', index);

    const imagePath = getProductImage(item.name);

    cartItem.innerHTML = `
        <img src="${imagePath}" alt="${item.name}" class="item-image" 
             onerror="this.src='../Pictures/default-product.jpg'">
        <div class="item-details">
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-price">R${parseFloat(item.price).toFixed(2)} each</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="item-total">
                Subtotal: R${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;

    return cartItem;
}

function getProductImage(productName) {
    const imageMappings = {
        'Wooden Spoon Set': '../Pictures/woodenSpoon.jpg',
        'Silver Bracelet': '../Pictures/silver.jpg',
        'Leather Wallet': '../Pictures/leatherWallet.jpg',
        'Ceramic Bowl': '../Pictures/ceramic bowl.jpg',
        'Woven Scarf': '../Pictures/scarf.jpg',
        'Embroidered Cushion': '../Pictures/cushion.jpg',
        'Handmade Basket': '../Pictures/basket.jpg',
        'Beaded Necklace': '../Pictures/necklace.jpg'
    };

    return imageMappings[productName] || '../Pictures/default-product.jpg';
}

function displayEmptyCart() {
    const cartContent = document.getElementById('cartContent');
    cartContent.innerHTML = `
        <div class="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button class="continue-shopping" onclick="window.location.href='../Products/productListings.html'">
                Start Shopping
            </button>
        </div>
    `;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        loadCart();

        if (change > 0) {
            showNotification('Quantity updated');
        } else if (cart[index] && cart[index].quantity > 0) {
            showNotification('Quantity updated');
        }
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);

        localStorage.setItem('cart', JSON.stringify(cart));

        loadCart();

        showNotification(`${itemName} removed from cart`);
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        showNotification('Cart cleared');
    }
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.price) * item.quantity;
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `R${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `R${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `R${total.toFixed(2)}`;
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const summary = {
        items: cart,
        subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('R', '')),
        tax: parseFloat(document.getElementById('tax').textContent.replace('R', '')),
        total: parseFloat(document.getElementById('total').textContent.replace('R', ''))
    };

    localStorage.setItem('checkoutSummary', JSON.stringify(summary));
    window.location.href = '../Transaction/transaction.html';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
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