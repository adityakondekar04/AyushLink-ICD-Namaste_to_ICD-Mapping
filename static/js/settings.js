// File: static/js/settings.js
document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = '/static/signin.html';
        return;
    }

    const emailInput = document.getElementById('email');
    const fullNameInput = document.getElementById('full-name');
    const settingsForm = document.getElementById('settings-form');
    const statusMessage = document.getElementById('form-status');

    // Fetch current user data and populate the form
    async function populateUserData() {
        try {
            const response = await fetch('/users/me/', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) throw new Error('Could not fetch user data.');
            const user = await response.json();
            emailInput.value = user.email;
            fullNameInput.value = user.full_name || '';
        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'Error loading your data.';
            statusMessage.style.color = 'red';
        }
    }

    // Handle form submission to update user data
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newFullName = fullNameInput.value.trim();
        statusMessage.textContent = 'Saving...';
        statusMessage.style.color = '#3498db';

        try {
            const response = await fetch('/users/me/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ full_name: newFullName })
            });
            if (!response.ok) throw new Error('Failed to update profile.');
            
            statusMessage.textContent = 'Changes saved successfully!';
            statusMessage.style.color = 'green';
            setTimeout(() => { statusMessage.textContent = ''; }, 3000);

        } catch (error) {
            console.error(error);
            statusMessage.textContent = error.message;
            statusMessage.style.color = 'red';
        }
    });

    populateUserData();
});