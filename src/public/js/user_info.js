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

  // Инициализация редактирования email
  initEmailEditing();
});

// Функция валидации email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Основная функция для работы с редактированием email
function initEmailEditing() {
  const emailBlock = document.querySelector('.info-block.full-width');
  const emailSpan = document.getElementById('email');
  const editBtn = emailBlock.querySelector('.edit-btn');
  
  let currentEmail = emailSpan.textContent;
  let isEditing = false;

  editBtn.addEventListener('click', async function() {
    if (isEditing) {
      // Режим сохранения
      const input = emailBlock.querySelector('input.email-input');
      const newEmail = input.value.trim();
      
      // Валидация email
      if (!validateEmail(newEmail)) {
        alert('Пожалуйста, введите корректный email (например, user@example.com)');
        return;
      }
      
      // Если email не изменился
      if (newEmail === currentEmail) {
        toggleEditMode(false);
        return;
      }
      
      // Отправка на сервер
      try {
        editBtn.disabled = true;
        editBtn.textContent = 'Сохранение...';
        
        const response = await fetch('/api/update-email', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: newEmail })
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Ошибка при обновлении email');
        }
        
        currentEmail = responseData.email;
        toggleEditMode(false, responseData.email);
      } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Произошла ошибка при обновлении email');
      } finally {
        editBtn.disabled = false;
      }
    } else {
      // Режим редактирования
      toggleEditMode(true);
    }
  });

  // Переключение между режимами редактирования и просмотра
  function toggleEditMode(editMode, newEmail = null) {
    if (editMode) {
      // Создаем input
      const input = document.createElement('input');
      input.type = 'email';
      input.className = 'email-input';
      input.value = currentEmail;
      
      // Заменяем span на input
      emailSpan.replaceWith(input);
      editBtn.textContent = '✎ Сохранить';
      isEditing = true;
      
      // Фокус и обработка Esc
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          toggleEditMode(false);
        }
      });
    } else {
      // Создаем span
      const newSpan = document.createElement('span');
      newSpan.id = 'email';
      newSpan.className = 'info-value';
      newSpan.textContent = newEmail || currentEmail;
      
      // Заменяем input на span
      emailBlock.querySelector('input.email-input')?.replaceWith(newSpan);
      editBtn.textContent = '✎ Изменить';
      isEditing = false;
      
      // Обновляем текущий email
      if (newEmail) {
        currentEmail = newEmail;
      }
    }
  }
}