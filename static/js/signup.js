// File: static/js/signup.js
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const formSteps = document.querySelectorAll(".form-step");
const form = document.getElementById('signup-form');
const statusMsg = document.getElementById('form-status');
let formStepIndex = 0;

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        formStepIndex++;
        updateFormSteps();
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        formStepIndex--;
        updateFormSteps();
    });
});

function updateFormSteps() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === formStepIndex);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMsg.textContent = 'Creating account...';
    statusMsg.style.color = 'blue';

    const userData = {
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.detail || 'Failed to create account.');
        }
        statusMsg.textContent = 'Account created successfully! Please sign in.';
        statusMsg.style.color = 'green';
        setTimeout(() => { window.location.href = '/static/signin.html'; }, 2000);
    } catch (error) {
        statusMsg.textContent = 'Error: ' + error.message;
        statusMsg.style.color = 'red';
    }
});