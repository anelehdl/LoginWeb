// Handle file selection and preview
function handleFileSelect(input) {
    const fileText = document.getElementById('fileText');
    const imagePreview = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Update file text
        fileText.textContent = file.name;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, JPEG, PNG, GIF, or WEBP)');
            input.value = '';
            fileText.textContent = 'No file chosen';
            imagePreview.innerHTML = '';
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5000000) {
            alert('File size must be less than 5MB');
            input.value = '';
            fileText.textContent = 'No file chosen';
            imagePreview.innerHTML = '';
            return;
        }

        // Create image preview
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px; margin-top: 10px;">
            `;
        };
        reader.readAsDataURL(file);
    } else {
        fileText.textContent = 'No file chosen';
        imagePreview.innerHTML = '';
    }
}

// Form validation
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');

    form.addEventListener('submit', function (e) {
        // Basic validation
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

        // Show loading state
        const submitBtn = document.querySelector('.add-product-btn');
        submitBtn.textContent = 'Adding Product...';
        submitBtn.disabled = true;
    });
});

// Handle drag and drop for file upload
const fileUploadArea = document.querySelector('.file-upload-area');
const fileInput = document.getElementById('prodImg');

fileUploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    fileUploadArea.style.backgroundColor = '#f0f0f0';
});

fileUploadArea.addEventListener('dragleave', function (e) {
    e.preventDefault();
    fileUploadArea.style.backgroundColor = '';
});

fileUploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    fileUploadArea.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(fileInput);
    }
});