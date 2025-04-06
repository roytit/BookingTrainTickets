document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user = await loadUserData();
    if (!user) return;

    initUserInterface(user);
    initLogoutHandler();
    initTabSwitchers();
    initEditHandlers();

  } catch (error) {
    console.error('Ошибка инициализации:', error);
    window.location.href = '/login';
  }
});

// Основные функции
async function loadUserData() {
  try {
    const response = await fetch('/api/check-auth', { credentials: 'include' });
    if (!response.ok) throw new Error('Требуется авторизация');
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    window.location.href = '/login';
    return null;
  }
}

function initUserInterface(user) {
  document.getElementById('email').textContent = user.email;
  document.getElementById('lastName').textContent = user.last_name || 'Не указано';
  document.getElementById('firstName').textContent = user.first_name || 'Не указано';
  document.getElementById('middleName').textContent = user.middle_name || 'Не указано';

  const currentPath = window.location.pathname;
  if (currentPath.includes('user-info')) {
    document.getElementById('accountTab').classList.add('active');
    document.getElementById('ordersTab').classList.remove('active');
  } else if (currentPath.includes('user-history')) {
    document.getElementById('ordersTab').classList.add('active');
    document.getElementById('accountTab').classList.remove('active');
  }
}

function initLogoutHandler() {
  document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/profile/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) window.location.href = '/login';
      else throw new Error('Ошибка при выходе');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      alert('Не удалось выполнить выход. Попробуйте еще раз.');
    }
  });
}

function initTabSwitchers() {
  document.getElementById('ordersTab').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('ordersTab', '/profile/user-history');
  });

  document.getElementById('accountTab').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('accountTab', '/profile/user-info');
  });
}

function switchTab(activeTabId, redirectUrl) {
  document.getElementById(activeTabId).classList.add('active');
  document.getElementById(activeTabId === 'accountTab' ? 'ordersTab' : 'accountTab').classList.remove('active');
  setTimeout(() => window.location.href = redirectUrl, 300);
}

function initEditHandlers() {
  // Сбрасываем все обработчики перед инициализацией
  document.querySelectorAll('.edit-btn').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.replaceWith(newBtn);
  });

  // Инициализируем обработчики для каждого поля
  initFieldEditing({
    fieldId: 'email',
    fieldType: 'email',
    validationFn: validateEmail,
    apiEndpoint: '/api/update-email',
    fieldName: 'email'
  });

  initFieldEditing({
    fieldId: 'lastName',
    fieldType: 'text',
    validationFn: validateName,
    apiEndpoint: '/profile/api/update-profile',
    fieldName: 'last_name',
    emptyValue: 'Не указано'
  });

  initFieldEditing({
    fieldId: 'firstName',
    fieldType: 'text',
    validationFn: validateName,
    apiEndpoint: '/profile/api/update-profile',
    fieldName: 'first_name',
    emptyValue: 'Не указано'
  });

  initFieldEditing({
    fieldId: 'middleName',
    fieldType: 'text',
    validationFn: validateName,
    apiEndpoint: '/profile/api/update-profile',
    fieldName: 'middle_name',
    emptyValue: 'Не указано'
  });

  initPasswordEditing();
}

// Универсальная функция для редактирования полей
function initFieldEditing(config) {
  const { fieldId, fieldType, validationFn, apiEndpoint, fieldName, emptyValue } = config;
  const fieldBlock = document.getElementById(fieldId).closest('.info-block');
  const editBtn = fieldBlock.querySelector('.edit-btn');
  
  let currentValue = document.getElementById(fieldId).textContent;
  if (emptyValue && currentValue === emptyValue) currentValue = '';

  editBtn.addEventListener('click', async () => {
    const fieldSpan = document.getElementById(fieldId);
    
    // Если уже в режиме редактирования
    if (fieldSpan.tagName === 'INPUT') {
      await handleSave(fieldSpan, editBtn, currentValue, validationFn, apiEndpoint, fieldName);
      return;
    }
    
    // Переход в режим редактирования
    const inputElement = document.createElement('input');
    inputElement.type = fieldType;
    inputElement.className = `${fieldId}-input`;
    inputElement.value = currentValue;
    inputElement.id = fieldId;
    
    fieldSpan.replaceWith(inputElement);
    editBtn.textContent = '✎ Сохранить';
    
    inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelEditing(inputElement, editBtn, currentValue, emptyValue);
      } else if (e.key === 'Enter') {
        handleSave(inputElement, editBtn, currentValue, validationFn, apiEndpoint, fieldName);
      }
    });
    
    inputElement.focus();
  });
}

// Обработка сохранения для обычных полей
async function handleSave(inputElement, editBtn, currentValue, validationFn, apiEndpoint, fieldName) {
  const newValue = inputElement.value.trim();

  if (!validationFn(newValue)) {
    alert(fieldName === 'email' ? 'Пожалуйста, введите корректный email' : 'Поле не может быть пустым');
    return;
  }

  if (newValue === currentValue) {
    cancelEditing(inputElement, editBtn, currentValue);
    return;
  }

  try {
    editBtn.disabled = true;
    editBtn.textContent = 'Сохранение...';

    const requestBody = {};
    requestBody[fieldName] = newValue;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(responseData?.message || 'Ошибка при сохранении');
    }

    completeEditing(inputElement, editBtn, newValue);
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    alert(error.message || 'Что-то пошло не так при сохранении');
  } finally {
    editBtn.disabled = false;
    editBtn.textContent = '✎ Изменить';
  }
}


// Отмена редактирования
function cancelEditing(inputElement, editBtn, originalValue, emptyValue = '') {
  const newSpan = document.createElement('span');
  newSpan.id = inputElement.id;
  newSpan.className = 'info-value';
  newSpan.textContent = originalValue || emptyValue;
  
  inputElement.replaceWith(newSpan);
  editBtn.textContent = '✎ Изменить';
}

// Завершение редактирования после успешного сохранения
function completeEditing(inputElement, editBtn, newValue) {
  const newSpan = document.createElement('span');
  newSpan.id = inputElement.id;
  newSpan.className = 'info-value';
  newSpan.textContent = newValue;
  
  inputElement.replaceWith(newSpan);
  editBtn.textContent = '✎ Изменить';
}

function showNotification(message, isError = false) {
  const notif = document.getElementById('notification');
  
  // Изменяем текст уведомления
  notif.textContent = message;
  
  // Если ошибка, меняем стиль на красный
  notif.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
  
  // Показываем уведомление (анимируем появление)
  notif.classList.add('show');
  
  // Скрываем уведомление через 3 секунды
  setTimeout(() => {
    notif.classList.remove('show');
  }, 3000);
}



// Редактирование пароля
function initPasswordEditing() {
  const passwordBlock = document.getElementById('password').closest('.info-block');
  const editBtn = passwordBlock.querySelector('.edit-btn');
  
  editBtn.addEventListener('click', async () => {
    const passwordSpan = document.getElementById('password');
    
    // Если уже в режиме редактирования
    if (passwordSpan.tagName === 'DIV') {
      await handlePasswordSave(passwordSpan, editBtn);
      return;
    }
    
    // Переход в режим редактирования
    const container = document.createElement('div');
    container.id = 'password';
    container.className = 'password-inputs-container';
    
    ['Текущий пароль', 'Новый пароль', 'Повторите пароль'].forEach((placeholder, i) => {
      const input = document.createElement('input');
      input.type = 'password';
      input.className = ['current-password-input', 'new-password-input', 'confirm-password-input'][i];
      input.placeholder = placeholder;
      container.appendChild(input);
    });
    
    passwordSpan.replaceWith(container);
    editBtn.textContent = '✎ Изменить';
    container.querySelector('input').focus();
  });
}

// Обработка сохранения пароля с детализированными ошибками
async function handlePasswordSave(container, editBtn) {
  const inputs = container.querySelectorAll('input');
  const currentPassword = inputs[0].value;
  const newPassword = inputs[1].value;
  const confirmPassword = inputs[2].value;

  try {
    // Проверка заполнения всех полей
    if (!currentPassword) {
      showInlineError(inputs[0], 'Введите текущий пароль');
      inputs[0].focus();
      return;
    } else {
      removeInlineError(inputs[0]);
    }

    if (!newPassword) {
      showInlineError(inputs[1], 'Введите новый пароль');
      inputs[1].focus();
      return;
    } else {
      removeInlineError(inputs[1]);
    }

    if (!confirmPassword) {
      showInlineError(inputs[2], 'Повторите новый пароль');
      inputs[2].focus();
      return;
    } else {
      removeInlineError(inputs[2]);
    }

    if (newPassword !== confirmPassword) {
      showInlineError(inputs[1], 'Пароли не совпадают');
      showInlineError(inputs[2], 'Пароли не совпадают');
      inputs[1].value = '';
      inputs[2].value = '';
      inputs[1].focus();
      return;
    }

    if (newPassword.length < 8) {
      showInlineError(inputs[1], 'Минимум 8 символов');
      showInlineError(inputs[2], '');
      inputs[1].value = '';
      inputs[2].value = '';
      inputs[1].focus();
      return;
    }

    editBtn.disabled = true;
    editBtn.textContent = 'Сохранение...';

    const response = await fetch('/profile/api/update-password', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Неверный пароль';

      if (response.status === 401) {
        showInlineError(inputs[0], 'Неверный текущий пароль');
        inputs[0].value = '';
        inputs[0].focus();
        return;
      } else {
        showInlineError(inputs[0], errorMessage);
        inputs[0].focus();
        return;
      }
    }

    // Успешное сохранение
    const newSpan = document.createElement('span');
    newSpan.id = 'password';
    newSpan.className = 'info-value';
    newSpan.textContent = '•••••••••';

    container.replaceWith(newSpan);
    editBtn.textContent = '✎ Изменить'; // Возвращаем текст кнопки
    showNotification('Пароль успешно изменен');

  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
    showErrorMessage('Что-то пошло не так. Попробуйте снова.');
  } finally {
    editBtn.disabled = false;
  }
}

// Не забудьте вызвать эту функцию в initUserInterface()


// Класс для детализированных ошибок
class DetailedError extends Error {
  constructor(message, focusHandler) {
    super(message);
    this.focusHandler = focusHandler;
    this.name = 'DetailedError';
  }
}

// Функции для отображения сообщений
function showSuccessMessage(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert success';
  alertBox.textContent = message;
  document.body.prepend(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

function showErrorMessage(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert error';
  alertBox.textContent = message;
  document.body.prepend(alertBox);
  setTimeout(() => alertBox.remove(), 5000);
}

function showInlineError(inputElement, message) {
  removeInlineError(inputElement); // сначала удалим старое сообщение, если есть

  const errorMsg = document.createElement('div');
  errorMsg.className = 'input-error-message';
  errorMsg.textContent = message;
  inputElement.insertAdjacentElement('afterend', errorMsg);
}

function removeInlineError(inputElement) {
  const nextEl = inputElement.nextElementSibling;
  if (nextEl && nextEl.classList.contains('input-error-message')) {
    nextEl.remove();
  }
}


// Вспомогательные функции валидации
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateName(name) {
  return name.trim().length > 0;
}