document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Важно для сессий!
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Ошибка входа');
    }
    
    // Редирект после успешного входа
    window.location.href = '/profile'; // Жёстко задаём редирект
    
  } catch (error) {
    console.error('Ошибка входа:', error);
    alert(error.message);
    document.getElementById('password').value = '';
  }
});