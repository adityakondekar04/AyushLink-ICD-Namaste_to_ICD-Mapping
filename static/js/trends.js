// File: static/js/trends.js

document.addEventListener('DOMContentLoaded', async () => {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    feedContainer.innerHTML = '<p style="text-align: center;">Loading feed...</p>';

    try {
        // Fetch both news updates and contributions at the same time
        const [updatesResponse, contributionsResponse] = await Promise.all([
            fetch('/api/v1/updates'),
            fetch('/api/v1/contributions/all') // Assuming you have an endpoint to get all contributions
        ]);

        if (!updatesResponse.ok || !contributionsResponse.ok) {
            throw new Error('Failed to fetch data from the server.');
        }

        const updates = await updatesResponse.json();
        const contributions = await contributionsResponse.json();

        // Add a 'type' property to distinguish between them
        updates.forEach(item => item.type = 'News Update');
        contributions.forEach(item => item.type = 'Contribution');
        
        // Combine both arrays into one feed
        const combinedFeed = [...updates, ...contributions];

        // Sort the combined feed by date, newest first
        combinedFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (combinedFeed.length === 0) {
            feedContainer.innerHTML = '<p style="text-align: center;">The feed is empty. Be the first to publish something!</p>';
            return;
        }

        // Clear the loading message and render the feed
        feedContainer.innerHTML = '';
        combinedFeed.forEach(item => {
            const card = document.createElement('div');
            card.className = 'form-card'; // Reusing the card style
            card.style.marginBottom = '20px';
            
            const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Different HTML for News vs. Contributions
            if (item.type === 'News Update') {
                card.innerHTML = `
                    <p style="font-weight: 600; color: var(--accent-color);">${item.type}</p>
                    <h2 style="margin-bottom: 5px;">${item.title}</h2>
                    <p class="muted">Posted by ${item.author} on ${formattedDate}</p>
                    <p style="margin-top: 15px;">${item.content}</p>
                    ${item.source_url ? `<a href="${item.source_url}" target="_blank" style="margin-top: 10px; display: inline-block;">Read Source</a>` : ''}
                `;
            } else { // Contribution
                card.innerHTML = `
                    <p style="font-weight: 600; color: #e67e22;">${item.type}</p>
                    <h2 style="margin-bottom: 5px;">${item.suggestion_type} for ${item.namastecode_target}</h2>
                    <p class="muted">Submitted by ${item.author} on ${formattedDate}</p>
                    <p style="margin-top: 15px;">${item.content}</p>
                `;
            }
            feedContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching feed:', error);
        feedContainer.innerHTML = '<p style="text-align: center; color: red;">Could not load the feed.</p>';
    }
});