// File: static/js/signin.js
const form = document.getElementById('signin-form');
const statusMsg = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMsg.textContent = 'Signing in...';
    statusMsg.style.color = 'blue';

    // FastAPI's token endpoint expects form data, not JSON
    const formData = new FormData();
    formData.append('username', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);

    try {
        const response = await fetch('/token', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.detail || 'Failed to sign in.');
        }
        
        // IMPORTANT: Store the access token in the browser's local storage
        localStorage.setItem('accessToken', result.access_token);
        
        statusMsg.textContent = 'Success! Redirecting to your dashboard...';
        statusMsg.style.color = 'green';
        window.location.href = '/static/doc_dashboard.html';

    } catch (error) {
        statusMsg.textContent = 'Error: ' + error.message;
        statusMsg.style.color = 'red';
    }
});