document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');

    form.addEventListener('submit', function (e) {
        const prodName = document.getElementById('prodName').value.trim();
        const prodDesc = document.getElementById('prodDesc').value.trim();
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;

        if (!prodName) {
            alert('Please enter a product name');
            e.preventDefault();
            return;
        }

        if (!prodDesc) {
            alert('Please enter a product description');
            e.preventDefault();
            return;
        }

        if (!category) {
            alert('Please select a category');
            e.preventDefault();
            return;
        }

        if (!price || price <= 0) {
            alert('Please enter a valid price');
            e.preventDefault();
            return;
        }

        if (!stock || stock < 0) {
            alert('Please enter a valid stock quantity');
            e.preventDefault();
            return;
        }

        const submitBtn = document.querySelector('.add-product-btn');
        submitBtn.textContent = 'Adding Product...';
        submitBtn.disabled = true;
    });
});