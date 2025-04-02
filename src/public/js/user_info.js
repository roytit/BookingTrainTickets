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

  // Определение активной вкладки
  const currentPath = window.location.pathname;
  if (currentPath.includes('user-info')) {
    document.getElementById('accountTab').classList.add('active');
    document.getElementById('ordersTab').classList.remove('active');
  } else if (currentPath.includes('user-history')) {
    document.getElementById('ordersTab').classList.add('active');
    document.getElementById('accountTab').classList.remove('active');
  }

  // Переключение вкладок
  document.getElementById('ordersTab').addEventListener('click', () => {
    document.getElementById('ordersTab').classList.add('active');
    document.getElementById('accountTab').classList.remove('active');
    setTimeout(() => {
      window.location.href = '/profile/user-history';
    }, 300);
  });

  document.getElementById('accountTab').addEventListener('click', () => {
    document.getElementById('accountTab').classList.add('active');
    document.getElementById('ordersTab').classList.remove('active');
    setTimeout(() => {
      window.location.href = '/profile/user-info';
    }, 300);
  });
});
