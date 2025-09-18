// File: static/js/patient_history.js

document.addEventListener('DOMContentLoaded', () => {
    // --- SECURITY CHECK & INITIAL SETUP ---
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = '/static/signin.html';
        return; // Stop script execution if not logged in
    }
    let selectedPatientId = null;

    // --- ELEMENT REFERENCES ---
    const profileNameSpan = document.getElementById('profile-name');
    const logoutButton = document.getElementById('logout-button');
    const patientListDiv = document.getElementById('patient-list');
    
    const detailContainer = document.getElementById('patient-detail-container');
    const detailPlaceholder = document.getElementById('patient-detail-placeholder');
    const detailContent = document.getElementById('patient-detail-content');
    const detailPatientName = document.getElementById('detail-patient-name');
    const recordListDiv = document.getElementById('record-list');
    const addRecordForm = document.getElementById('add-record-form');
    
    // Modal elements for adding a new patient
    const addPatientModal = document.getElementById('add-patient-modal');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addPatientFormModal = document.getElementById('add-patient-form-modal');

    // --- MODAL LOGIC ---
    addPatientBtn.onclick = () => { addPatientModal.style.display = 'flex'; };
    closeModalBtn.onclick = () => { addPatientModal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target == addPatientModal) {
            addPatientModal.style.display = 'none';
        }
    };

    // --- DATA FETCHING & RENDERING ---
    async function fetchAndRenderPatients() {
        try {
            const response = await fetch('/api/v1/patients', { headers: { 'Authorization': `Bearer ${accessToken}` } });
            const patients = await response.json();
            patientListDiv.innerHTML = patients.length ? '' : '<p>No patients found. Click "Add New" to start.</p>';
            patients.forEach(p => {
                const item = document.createElement('div');
                item.className = 'patient-list-item';
                item.textContent = p.full_name;
                item.dataset.patientId = p.id;
                item.onclick = () => selectPatient(p.id);
                patientListDiv.appendChild(item);
            });
        } catch (error) { 
            console.error('Failed to fetch patients:', error);
            patientListDiv.innerHTML = '<p style="color:red;">Could not load patients.</p>';
        }
    }

    window.selectPatient = async function(patientId) {
        selectedPatientId = patientId;
        document.querySelectorAll('.patient-list-item').forEach(item => item.classList.toggle('active', item.dataset.patientId == patientId));
        
        detailPlaceholder.style.display = 'none';
        detailContent.style.display = 'block';
        recordListDiv.innerHTML = '<p>Loading records...</p>';

        try {
            const response = await fetch(`/api/v1/patients/${patientId}`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
            const patient = await response.json();
            detailPatientName.textContent = patient.full_name;
            renderRecords(patient.records);
        } catch (error) { 
            console.error('Failed to fetch patient details:', error);
            detailPatientName.textContent = 'Error';
            recordListDiv.innerHTML = '<p style="color:red;">Could not load records.</p>';
        }
    }

    function renderRecords(records) {
        recordListDiv.innerHTML = records.length ? '' : '<p>No records found. Add one below.</p>';
        records.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)); // Newest first
        records.forEach(r => {
            const card = document.createElement('div');
            card.className = 'record-card';
            const recordDate = new Date(r.record_date).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
            card.innerHTML = `
                <p class="date">${recordDate}</p>
                <strong>Symptoms:</strong><p>${r.symptoms.replace(/\n/g, '<br>')}</p>
                <strong>Diagnosis:</strong><p>${r.diagnosis.replace(/\n/g, '<br>')}</p>
                <strong>Treatment:</strong><p>${r.treatment.replace(/\n/g, '<br>')}</p>
            `;
            recordListDiv.appendChild(card);
        });
    }

    // --- FORM SUBMISSIONS ---
    addPatientFormModal.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPatient = {
            full_name: document.getElementById('patient-name-modal').value,
            date_of_birth: document.getElementById('patient-dob-modal').value,
            contact_info: document.getElementById('patient-contact-modal').value,
        };
        await fetch('/api/v1/patients', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }, body: JSON.stringify(newPatient) });
        addPatientFormModal.reset();
        addPatientModal.style.display = 'none';
        fetchAndRenderPatients();
    });

    addRecordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedPatientId) { alert('Please select a patient first.'); return; }
        const newRecord = {
            symptoms: document.getElementById('record-symptoms').value,
            diagnosis: document.getElementById('record-diagnosis').value,
            treatment: document.getElementById('record-treatment').value,
        };
        await fetch(`/api/v1/patients/${selectedPatientId}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }, body: JSON.stringify(newRecord) });
        addRecordForm.reset();
        selectPatient(selectedPatientId); // Refresh records for the current patient
    });
    
    // --- INITIALIZATION ---
    async function initializePage() {
        try {
            const userResponse = await fetch('/users/me/', { headers: { 'Authorization': `Bearer ${accessToken}` } });
            const user = await userResponse.json();
            profileNameSpan.textContent = user.full_name || 'Doctor';
        } catch (error) { console.error("Auth error", error); }
        
        fetchAndRenderPatients();
    }
    
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        window.location.href = '/static/signin.html';
    });

    initializePage();
});