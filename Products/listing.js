document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

async function loadProducts() {
    try {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';

        // Fetch products from PHP script
        const response = await fetch('fetch.php');
        const data = await response.json();

        if (data.success) {
            displayProducts(data.products);
        } else {
            showError('Error loading products: ' + data.error);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');

    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products available at the moment.</div>';
        return;
    }

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-product-id', product.id);

    const imagePath = getProductImage(product.name);

    const isInStock = product.stock > 0;
    const stockClass = isInStock ? '' : 'out-of-stock';

    productCard.innerHTML = `
        <div class="product-img">
            <img src="${imagePath}" alt="${product.name}" onerror="this.src='../Pictures/default-product.jpg'">
            ${!isInStock ? '<div class="stock-overlay">Out of Stock</div>' : ''}
        </div>
        <div class="products-container">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <span class="product-price">R${product.price}</span>
                <span class="product-category">${product.category}</span>
            </div>
            <div class="product-stock">Stock: ${product.stock}</div>
            <button class="add-cart ${stockClass}" 
                    ${!isInStock ? 'disabled' : ''} 
                    onclick="addToCart(${product.id}, '${escapeHtml(product.name)}', ${product.price})">
                ${isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;

    return productCard;
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

function addToCart(productId, productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    showNotification(`${productName} added to cart!`);
}

function showError(message) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = `<div class="error-message">${message}</div>`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function refreshProducts() {
    loadProducts();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}