document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    fetch('/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || 'Signup failed') });
        }
        return response.json();
    })
    .then(data => {
        // After successful signup, log the user in
        return fetch('/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ 'username': email, 'password': password })
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || 'Login failed after signup') });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('accessToken', data.access_token);
        window.location.href = '/';
    })
    .catch(error => {
        errorMessage.textContent = error.message;
    });
});