function confirmDelete() {
    return confirm('Are you sure you want to remove this user? This action cannot be undone.');
}

function populateForm(userID, userName, email) {
    document.getElementById('userID').value = userID;
    document.getElementById('userName').value = userName;
    document.getElementById('email').value = email;
    document.getElementById('password').value = '********'
}