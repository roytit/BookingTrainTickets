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
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Ошибка входа');
      }
      
      // Проверяем, есть ли редирект в ответе или делаем стандартный
      window.location.href = result.redirectUrl || '/booking';
      
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert(error.message);
      
      // Очищаем поле пароля при ошибке
      document.getElementById('password').value = '';
    }
  });