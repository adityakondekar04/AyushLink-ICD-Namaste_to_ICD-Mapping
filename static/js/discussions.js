// File: static/js/discussions.js
document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = '/static/signin.html';
        return;
    }

    const messagesContainer = document.getElementById('messages-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    let currentUser = null; // We'll store the current user's data here

    // --- NEW: Function to delete a message ---
    window.deleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`/api/v1/chat/messages/${messageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) {
                throw new Error('You are not authorized to delete this message.');
            }
            fetchMessages(); // Refresh the message list
        } catch (error) {
            alert(error.message);
        }
    };

    function renderMessages(messages) {
        messagesContainer.innerHTML = '';
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p>No messages yet. Be the first to post!</p>';
            return;
        }
        messages.forEach(msg => {
            const msgCard = document.createElement('div');
            msgCard.className = 'message-card';
            const msgDate = new Date(msg.created_at).toLocaleString();

            // Only show delete button if the message belongs to the current user
            const deleteButtonHtml = (currentUser && msg.user_id === currentUser.id)
                ? `<button class="delete-btn" onclick="deleteMessage(${msg.id})">×</button>`
                : '';
            
            msgCard.innerHTML = `
                <div class="message-header">
                    <span class="message-author">${msg.author}</span>
                    <div class="meta-info">
                        <span class="message-time">${msgDate}</span>
                        ${deleteButtonHtml}
                    </div>
                </div>
                <p class="message-content">${msg.content}</p>
            `;
            messagesContainer.appendChild(msgCard);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to bottom
    }

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        if (!content) return;
        try {
            await fetch('/api/v1/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ content })
            });
            messageInput.value = '';
            fetchMessages();
        } catch (error) {
            alert('Could not send your message.');
        }
    });
    
    async function fetchMessages() {
        // ... (fetchMessages function remains the same, but now it re-renders with delete buttons)
        try {
            const response = await fetch('/api/v1/chat/messages', { headers: { 'Authorization': `Bearer ${accessToken}` }});
            const messages = await response.json();
            renderMessages(messages);
        } catch (error) {
            messagesContainer.innerHTML = '<p style="color:red">Could not load messages.</p>';
        }
    }

    async function initialize() {
        // Fetch current user data first to know who is logged in
        try {
            const userResponse = await fetch('/users/me/', { headers: { 'Authorization': `Bearer ${accessToken}` }});
            currentUser = await userResponse.json();
            fetchMessages(); // Then fetch messages
        } catch (error) {
            console.error("Authentication error", error);
        }
    }

    initialize();
});