document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const searchBtn = document.getElementById('searchBtn');
    const showBtn = document.getElementById('showBtn');
    const searchInput = document.getElementById('searchID');
    const productContainer = document.getElementById('productContainer');
    const modal = document.getElementById('update');
    const closeModal = document.getElementById('closeModal');
    const updateForm = document.getElementById('updateForm');
    const alertContainer = document.getElementById('alertContainer');

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    showBtn.addEventListener('click', showAllProducts);
    closeModal.addEventListener('click', closeUpdateModal);
    updateForm.addEventListener('submit', handleUpdateSubmit);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeUpdateModal();
        }
    });

    // Load all products on page load
    showAllProducts();

    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            showAlert('Please enter a search term', 'warning');
            return;
        }
        loadProducts(searchTerm);
    }

    function showAllProducts() {
        loadProducts();
    }

    function loadProducts(searchTerm = '') {
        showLoading();

        const url = searchTerm ? `update.php?search=${encodeURIComponent(searchTerm)}` : 'update.php';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                displayProducts(data.products);
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error loading products: ' + error.message, 'error');
                hideLoading();
            });
    }

    function displayProducts(products) {
        hideLoading();

        if (products.length === 0) {
            productContainer.innerHTML = '<div class="no-products">No products found</div>';
            return;
        }

        let html = '';
        products.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="product-info">
                        <h3>${escapeHtml(product.productName)}</h3>
                        <p class="product-id">ID: ${product.productID}</p>
                        <p class="product-description">${escapeHtml(product.productDescription || 'No description')}</p>
                        <div class="product-details">
                            <span class="price">R${parseFloat(product.price).toFixed(2)}</span>
                            <span class="category">${escapeHtml(product.category)}</span>
                            <span class="stock">Stock: ${product.stock}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-edit" 
                            data-id="${product.productID}"
                            data-name="${escapeHtml(product.productName)}"
                            data-description="${escapeHtml(product.productDescription || '')}"
                            data-price="${product.price}"
                            data-category="${escapeHtml(product.category)}"
                            data-stock="${product.stock}">
                            Update
                        </button>
                    </div>
                </div>
            `;
        });

        productContainer.innerHTML = html;

        const editButtons = productContainer.querySelectorAll('.btn-edit');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productID = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const description = button.getAttribute('data-description');
                const price = button.getAttribute('data-price');
                const category = button.getAttribute('data-category');
                const stock = button.getAttribute('data-stock');

                openUpdateModal(productID, name, description, price, category, stock);
            });
        });
    }

    function openUpdateModal(productID, name, description, price, category, stock) {
        // Populate form fields
        document.getElementById('productID').value = productID;
        document.getElementById('productName').value = name;
        document.getElementById('productDescription').value = description;
        document.getElementById('price').value = price;
        document.getElementById('category').value = category;
        document.getElementById('stock').value = stock;

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeUpdateModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        updateForm.reset();
    }

    function handleUpdateSubmit(e) {
        e.preventDefault();

        const formData = new FormData(updateForm);
        const data = Object.fromEntries(formData.entries());

        // Add hidden productID
        data.productID = document.getElementById('productID').value;

        // Validate required fields
        if (!data.productName || !data.price || !data.category || data.stock === '') {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        const submitBtn = updateForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;

        fetch('update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showAlert('Product updated successfully!', 'success');
                    closeUpdateModal();
                    // Refresh the product list
                    const currentSearch = searchInput.value.trim();
                    if (currentSearch) {
                        loadProducts(currentSearch);
                    } else {
                        showAllProducts();
                    }
                } else {
                    showAlert(result.message || 'Failed to update product', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error updating product: ' + error.message, 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;

        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertDiv);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    function showLoading() {
        productContainer.innerHTML = '<div class="loading">Loading products...</div>';
    }

    function hideLoading() {
        const loadingDiv = productContainer.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Make openUpdateModal globally accessible
    window.openUpdateModal = openUpdateModal;
});