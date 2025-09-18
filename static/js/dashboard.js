// File: static/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SECURITY & PROFILE SETUP ---
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = '/static/signin.html';
        return; // Stop the rest of the script if not logged in
    }
    
    // --- 2. GLOBAL CACHE ---
    let supportedLanguages = {}; // Store languages here to avoid re-fetching

    // --- 3. ELEMENT REFERENCES ---
    const profileNameSpan = document.getElementById('profile-name');
    const logoutButton = document.getElementById('logout-button');
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions-container');
    const detailsContainer = document.getElementById('diagnosis-details-container');
    const symptomsTextarea = document.getElementById('symptoms-textarea');
    const analyzeButton = document.getElementById('analyze-button');
    const aiResultsContainer = document.getElementById('ai-results');

    // --- 4. CORE FUNCTIONS ---

    async function fetchCurrentUser() {
        try {
            const response = await fetch('/users/me/', { headers: { 'Authorization': `Bearer ${accessToken}` } });
            if (!response.ok) throw new Error('Auth failed');
            const user = await response.json();
            profileNameSpan.textContent = user.full_name || 'Doctor';
        } catch (error) {
            localStorage.removeItem('accessToken');
            window.location.href = '/static/signin.html';
        }
    }

    async function handleSearchInput() {
        const query = searchInput.value.trim();
        detailsContainer.style.display = 'none';
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }
        try {
            const response = await fetch(`/api/v1/terminology/search?q=${encodeURIComponent(query)}`);
            const suggestions = await response.json();
            renderSuggestions(suggestions);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    function renderSuggestions(suggestions) {
        if (!suggestions.length) {
            suggestionsContainer.innerHTML = '<div id="search-suggestions"><div class="suggestion-item"><span>No results found.</span></div></div>';
            return;
        }
        suggestionsContainer.innerHTML = `<div id="search-suggestions">${suggestions.map(s => `
            <div class="suggestion-item" onclick="displayDiagnosisDetails('${s.namastecode}')">
                <strong>${s.term}</strong>
                <span>NAMASTE: ${s.namastecode}</span>
            </div>
        `).join('')}</div>`;
    }

    async function displayDiagnosisDetails(namasteCode) {
        suggestionsContainer.innerHTML = '';
        detailsContainer.style.display = 'block';
        detailsContainer.innerHTML = '<p>Loading details...</p>';
        try {
            const response = await fetch(`/api/v1/diagnosis/${namasteCode}`);
            const data = await response.json();
            const imageUrl = data.imageurl ? `/static/disease_images/${data.imageurl}` : 'https://via.placeholder.com/100';
            const formatText = (text) => text ? text.replace(/\n/g, '<br>') : 'No information available.';
            detailsContainer.innerHTML = `
                <div class="details-header">
                    <img src="${imageUrl}" alt="${data.term}"><div class="info"><h2>${data.term}</h2><p><strong>NAMASTE:</strong> ${data.namastecode}<br><strong>ICD-11:</strong> ${data.icd11code || 'N/A'}</p></div>
                </div>
                <div class="details-content">
                    <h3>Description</h3><p id="diagnosis-description-text">${formatText(data.description)}</p>
                    <div id="translation-container" style="margin-top: 15px; margin-bottom: 15px;"></div>
                    <h3>Formulations</h3><p>${formatText(data.formulations)}</p>
                    <h3>Pathya (Do's)</h3><p>${formatText(data.pathya)}</p>
                    <h3>Apathya (Don'ts)</h3><p>${formatText(data.apathya)}</p>
                </div>`;
            
            const translationContainer = document.getElementById('translation-container');
            let langOptions = Object.entries(supportedLanguages).map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
            translationContainer.innerHTML = `<label for="lang-select" style="font-weight:bold;">Translate Description:</label><select id="lang-select" style="margin-left: 8px; padding: 5px;">${langOptions}</select>`;
            document.getElementById('lang-select').value = 'en';
            document.getElementById('lang-select').addEventListener('change', async (e) => {
                const targetLang = e.target.value;
                const descriptionEl = document.getElementById('diagnosis-description-text');
                descriptionEl.innerHTML = '<i>Translating...</i>';
                const translateResponse = await fetch(`/api/v1/translate/${namasteCode}?lang=${targetLang}`);
                const translationResult = await translateResponse.json();
                descriptionEl.innerHTML = translationResult.translated_text || 'Translation failed.';
            });
        } catch (error) {
            console.error("Failed to fetch details:", error);
            detailsContainer.innerHTML = `<p style="color:red;">Error loading details.</p>`;
        }
    }

    async function handleAiAnalysis() {
        const symptoms = symptomsTextarea.value.trim();
        if (!symptoms) return alert('Please enter symptoms to analyze.');
        aiResultsContainer.innerHTML = '<div class="suggestion-item"><i>🧠 Analyzing...</i></div>';
        try {
            const response = await fetch('/api/v1/ai/analyze-symptoms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ symptoms: symptoms })
            });
            const suggestions = await response.json();
            renderAiSuggestions(suggestions);
        } catch (error) {
            console.error("AI analysis failed:", error);
            aiResultsContainer.innerHTML = '<div class="suggestion-item"><span style="color:red;">Error during analysis.</span></div>';
        }
    }

    function renderAiSuggestions(suggestions) {
        if (!suggestions || !suggestions.length) {
            aiResultsContainer.innerHTML = '<div class="suggestion-item"><span>No likely diagnoses found.</span></div>';
            return;
        }
        aiResultsContainer.innerHTML = suggestions.map(s => `
            <div class="suggestion-item" onclick="displayDiagnosisDetails('${s.code}')" style="cursor: pointer;">
                <strong>${s.description}</strong>
                <span>NAMASTE: ${s.code} &nbsp;|&nbsp; ICD-11: ${s.icd11code} &nbsp;|&nbsp; Score: ${s.score.toFixed(2)}</span>
            </div>`).join('');
    }

    // --- 5. INITIALIZATION & GLOBAL BINDING ---
    async function initializeApp() {
        await fetchCurrentUser();
        try {
            const langResponse = await fetch('/api/v1/translate/languages');
            supportedLanguages = await langResponse.json();
        } catch (error) {
            console.error("Could not pre-fetch languages:", error);
        }
        
        // Make the function for onclick available globally
        window.displayDiagnosisDetails = displayDiagnosisDetails;

        // Add event listeners
        searchInput.addEventListener('keyup', handleSearchInput);
        analyzeButton.addEventListener('click', handleAiAnalysis);
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            window.location.href = '/static/signin.html';
        });
    }

    initializeApp();
});