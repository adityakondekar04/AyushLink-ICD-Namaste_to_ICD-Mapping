// File: static/js/publish.js

document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = '/static/signin.html';
        return;
    }

    window.showPanel = function(panelId) {
        document.querySelectorAll('.form-panel, .tab-button').forEach(el => el.classList.remove('active'));
        document.getElementById(panelId).classList.add('active');
        const activeButton = document.querySelector(`.tab-button[onclick="showPanel('${panelId}')"]`);
        if(activeButton) activeButton.classList.add('active');
    }
    showPanel('contribution'); // Default to contribution tab

    // --- News Form Logic ---
    const newsForm = document.getElementById('news-form');
    newsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const statusMsg = document.getElementById('news-form-status');
        statusMsg.textContent = 'Submitting...';
        try {
            const response = await fetch('/api/v1/updates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({
                    title: document.getElementById('headline').value,
                    content: document.getElementById('summary').value,
                    source_url: document.getElementById('source-url').value
                })
            });
            if (!response.ok) throw new Error('Submission failed.');
            statusMsg.textContent = 'News published successfully!';
            statusMsg.style.color = 'green';
            newsForm.reset();
        } catch (error) {
            statusMsg.textContent = 'Error: ' + error.message;
            statusMsg.style.color = 'red';
        }
    });

    // --- Contribution Form Logic ---
    const contributionForm = document.getElementById('contribution-form');
    contributionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const statusMsg = document.getElementById('contribution-form-status');
        statusMsg.textContent = 'Submitting...';
        try {
            const response = await fetch('/api/v1/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                // The 'author' field is no longer sent from the frontend
                body: JSON.stringify({
                    namastecode_target: document.getElementById('namaste-code').value,
                    suggestion_type: document.getElementById('suggestion-type').value,
                    content: document.getElementById('content').value
                })
            });
            if (!response.ok) throw new Error('Submission failed.');
            statusMsg.textContent = 'Contribution submitted successfully!';
            statusMsg.style.color = 'green';
            contributionForm.reset();
        } catch (error) {
            statusMsg.textContent = 'Error: ' + error.message;
            statusMsg.style.color = 'red';
        }
    });
});