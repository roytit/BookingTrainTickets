document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/check-auth', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Требуется авторизация');
    }
    
    const user = await response.json();
    document.getElementById('email').textContent = user.email;
    
  } catch (error) {
    console.error('Ошибка:', error);
  }
  
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/logout', { 
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login';
  });
});