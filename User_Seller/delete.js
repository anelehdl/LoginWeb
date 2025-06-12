// delete.js - Frontend JavaScript for product deletion

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('deleteForm');
    const productIdInput = document.getElementById('productId');
    const productInfo = document.getElementById('productInfo');
    const productDetails = document.getElementById('productDetails');
    const messageDiv = document.getElementById('message');
    const deleteBtn = document.getElementById('deleteBtn');

    // Hide product info initially
    productInfo.style.display = 'none';

    // Fetch product details when product ID is entered
    productIdInput.addEventListener('blur', function () {
        const productId = this.value.trim();
        console.log('Product ID entered:', productId); // Debug log
        if (productId) {
            fetchProductDetails(productId);
        } else {
            productInfo.style.display = 'none';
            deleteBtn.disabled = true; // Disable if no product ID
        }
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const productId = productIdInput.value.trim();

        console.log('Form submitted with product ID:', productId); // Debug log

        if (!productId) {
            showMessage('Please enter a product ID', 'error');
            return;
        }

        // Check if button is disabled
        if (deleteBtn.disabled) {
            showMessage('Please wait for product details to load first', 'error');
            return;
        }

        // Confirm deletion
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            deleteProduct(productId);
        }
    });

    // Fetch product details to show user what they're about to delete
    async function fetchProductDetails(productId) {
        try {
            console.log('Fetching product details for ID:', productId); // Debug log
            showMessage('Loading product details...', 'info');
            deleteBtn.disabled = true; // Disable during fetch

            const response = await fetch('getProd.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `productId=${encodeURIComponent(productId)}`
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data); // Debug log

            if (data.success) {
                const product = data.product;

                document.getElementById('productInfo').innerHTML = `
                    <div class="product-card">
                        <h3>${product.name}</h3>
                        <p><strong>ID:</strong> ${product.id}</p>
                        <p><strong>Description:</strong> ${product.description}</p>
                        <p><strong>Price:</strong> R${parseFloat(product.price).toFixed(2)}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Stock:</strong> ${product.stock}</p>
                    </div>
                `;
                productInfo.style.display = 'block';
                deleteBtn.disabled = false; // Enable delete button
                showMessage('Product found. Review details before deleting.', 'success');
            } else {
                productInfo.style.display = 'none';
                deleteBtn.disabled = true;
                showMessage(data.message || 'Product not found', 'error');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            productInfo.style.display = 'none';
            deleteBtn.disabled = true;
            showMessage(`Error loading product details: ${error.message}`, 'error');
        }
    }

    // Delete product
    async function deleteProduct(productId) {
        try {
            console.log('Deleting product ID:', productId); // Debug log
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Deleting...';
            showMessage('Deleting product...', 'info');

            const response = await fetch('delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `productId=${encodeURIComponent(productId)}`
            });

            console.log('Delete response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Delete response data:', data); // Debug log

            if (data.success) {
                showMessage(`Product '${data.product_name}' deleted successfully!`, 'success');
                clearForm();
            } else {
                showMessage(data.message || 'Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showMessage(`Error deleting product: ${error.message}`, 'error');
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete Product';
        }
    }

    // Show messages to user
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        // Hide message after 5 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Clear form function (called by cancel button)
    window.clearForm = function () {
        form.reset();
        productInfo.style.display = 'none';
        messageDiv.style.display = 'none';
        deleteBtn.disabled = true; // Disable until product is loaded
        deleteBtn.textContent = 'Delete Product';
    };
});