// File: static/js/api_tools.js
document.addEventListener('DOMContentLoaded', () => {
    const diseaseTitleEl = document.getElementById('diseaseTitle');
    const namasteIdEl = document.getElementById('namasteId');
    const icdIdEl = document.getElementById('icdId');
    const descriptionTextEl = document.getElementById('descriptionText');
    const formulationsTextEl = document.getElementById('formulationsText');
    const pathyaTextEl = document.getElementById('pathyaText');
    const apathyaTextEl = document.getElementById('apathyaText');

    const params = new URLSearchParams(window.location.search);
    const namasteCode = params.get('code');

    if (!namasteCode) {
        diseaseTitleEl.textContent = 'No Diagnosis Selected';
        descriptionTextEl.textContent = 'Please go back and select a diagnosis.';
        return;
    }

    const fetchDiagnosisDetails = async () => {
        try {
            const response = await fetch(`/api/v1/diagnosis/${namasteCode}`);
            if (!response.ok) throw new Error('Diagnosis not found or server error.');
            const data = await response.json();
            
            diseaseTitleEl.textContent = data.term || 'N/A';
            namasteIdEl.textContent = data.namastecode || '-';
            icdIdEl.textContent = data.icd11code || '-';

            const formatText = (text) => text ? text.replace(/\n/g, '<br>') : 'No information available.';
            descriptionTextEl.innerHTML = formatText(data.description);
            formulationsTextEl.innerHTML = formatText(data.formulations);
            pathyaTextEl.innerHTML = formatText(data.pathya);
            apathyaTextEl.innerHTML = formatText(data.apathya);
        } catch (error) {
            console.error('Failed to load diagnosis details:', error);
            diseaseTitleEl.textContent = 'Error Loading Details';
            descriptionTextEl.innerHTML = `<p style="color:red;">Could not fetch details for code <strong>${namasteCode}</strong>.</p>`;
        }
    };

    fetchDiagnosisDetails();
});