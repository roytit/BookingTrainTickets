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
    document.getElementById('lastName').textContent = user.last_name || 'Не указано';
    document.getElementById('firstName').textContent = user.first_name || 'Не указано';
    document.getElementById('middleName').textContent = user.middle_name || 'Не указано';

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

  // Переключение вкладок
  const accountTab = document.getElementById('accountTab');
  const ordersTab = document.getElementById('ordersTab');
  const accountSection = document.querySelector('.user-info');
  const ordersSection = document.querySelector('.orders');

  accountTab.addEventListener('click', () => {
    accountTab.classList.add('active');
    ordersTab.classList.remove('active');
    accountSection.style.display = 'block';
    ordersSection.style.display = 'none';
  });

  ordersTab.addEventListener('click', () => {
    ordersTab.classList.add('active');
    accountTab.classList.remove('active');
    accountSection.style.display = 'none';
    ordersSection.style.display = 'block';
  });

  // Анимация кнопок
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.transition = 'transform 0.2s ease-in-out';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });
});
