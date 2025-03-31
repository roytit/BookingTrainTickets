document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        })
    });

    const result = await response.json();
    
    if (response.ok) {
        window.location.href = '/booking';  // Путь остаётся /booking
    } else {
        alert(result.error || 'Ошибка входа');
    }
});