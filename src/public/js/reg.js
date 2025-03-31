document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  
  if (!form) {
      console.error('Форма не найдена! Проверьте ID формы.');
      return;
  }

  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = {
          username: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          password: document.getElementById('password').value,
          confirmPassword: document.getElementById('confirm-password').value
      };

      console.log('Отправляемые данные:', formData);

      try {
          const response = await fetch('/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();
          
          if (response.ok) {
              alert(result.message);
              window.location.href = '/login';
          } else {
              alert(result.error || 'Ошибка регистрации');
          }
      } catch (error) {
          console.error('Ошибка:', error);
          alert('Не удалось подключиться к серверу');
      }
  });
});