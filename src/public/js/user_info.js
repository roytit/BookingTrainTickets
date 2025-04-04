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
  initEmailEditing();
  initNameFieldEditing('lastName', 'last_name');
  initNameFieldEditing('firstName', 'first_name');
  initNameFieldEditing('middleName', 'middle_name');
  initPasswordEditing();
}

// Редактирование email
function initEmailEditing() {
  const emailBlock = document.querySelector('.info-block.full-width:first-child');
  const emailSpan = document.getElementById('email');
  const editBtn = emailBlock.querySelector('.edit-btn');
  
  let currentEmail = emailSpan.textContent;
  let isEditing = false;
  let inputElement = null;

  const toggleEditMode = (editMode, newEmail = null) => {
    if (editMode) {
      inputElement = document.createElement('input');
      inputElement.type = 'email';
      inputElement.className = 'email-input';
      inputElement.value = currentEmail;
      
      emailSpan.replaceWith(inputElement);
      editBtn.textContent = '✎ Сохранить';
      isEditing = true;
      
      inputElement.focus();
    } else {
      const newSpan = document.createElement('span');
      newSpan.id = 'email';
      newSpan.className = 'info-value';
      newSpan.textContent = newEmail || currentEmail;
      
      if (inputElement) inputElement.replaceWith(newSpan);
      editBtn.textContent = '✎ Изменить';
      isEditing = false;
      inputElement = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      toggleEditMode(false);
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    const newEmail = inputElement.value.trim();
    
    if (!validateEmail(newEmail)) {
      alert('Пожалуйста, введите корректный email');
      return;
    }
    
    if (newEmail === currentEmail) {
      toggleEditMode(false);
      return;
    }
    
    try {
      editBtn.disabled = true;
      editBtn.textContent = 'Сохранение...';
      
      const response = await fetch('/profile/api/update-email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
        throw new Error(error.message);
      }
      
      currentEmail = newEmail;
      toggleEditMode(false, newEmail);
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.message);
    } finally {
      editBtn.disabled = false;
    }
  };

  editBtn.addEventListener('click', async () => {
    if (isEditing) {
      await handleSave();
    } else {
      toggleEditMode(true);
      inputElement.addEventListener('keydown', handleKeyDown);
    }
  });
}

// Редактирование полей ФИО
function initNameFieldEditing(fieldId, fieldName) {
  const fieldBlock = document.getElementById(fieldId).closest('.info-block');
  const fieldSpan = document.getElementById(fieldId);
  const editBtn = fieldBlock.querySelector('.edit-btn');
  
  let currentValue = fieldSpan.textContent === 'Не указано' ? '' : fieldSpan.textContent;
  let isEditing = false;
  let inputElement = null;

  const toggleEditMode = (editMode, newValue = null) => {
    if (editMode) {
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.className = `${fieldId}-input`;
      inputElement.value = currentValue;
      
      fieldSpan.replaceWith(inputElement);
      editBtn.textContent = '✎ Сохранить';
      isEditing = true;
      
      inputElement.focus();
    } else {
      const newSpan = document.createElement('span');
      newSpan.id = fieldId;
      newSpan.className = 'info-value';
      newSpan.textContent = newValue || currentValue || 'Не указано';
      
      if (inputElement) inputElement.replaceWith(newSpan);
      editBtn.textContent = '✎ Изменить';
      isEditing = false;
      inputElement = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      toggleEditMode(false);
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    const newValue = inputElement.value.trim();
    
    if (!validateName(newValue)) {
      alert('Поле не может быть пустым');
      return;
    }
    
    if (newValue === currentValue) {
      toggleEditMode(false);
      return;
    }
    
    try {
      editBtn.disabled = true;
      editBtn.textContent = 'Сохранение...';
      
      const response = await fetch('/profile/api/update-profile', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldName]: newValue })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
        throw new Error(error.message);
      }
      
      currentValue = newValue;
      toggleEditMode(false, newValue);
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.message);
    } finally {
      editBtn.disabled = false;
    }
  };

  editBtn.addEventListener('click', async () => {
    if (isEditing) {
      await handleSave();
    } else {
      toggleEditMode(true);
      inputElement.addEventListener('keydown', handleKeyDown);
    }
  });
}

// Редактирование пароля
function initPasswordEditing() {
  const passwordBlock = document.getElementById('password').closest('.info-block');
  const passwordSpan = document.getElementById('password');
  const editBtn = passwordBlock.querySelector('.edit-btn');
  
  const defaultValue = '•••••••••';
  let isEditing = false;
  let containerElement = null;

  const toggleEditMode = (editMode) => {
    if (editMode) {
      containerElement = document.createElement('div');
      containerElement.className = 'password-inputs-container';
      
      const inputs = [
        { type: 'password', className: 'current-password-input', placeholder: 'Текущий пароль' },
        { type: 'password', className: 'new-password-input', placeholder: 'Новый пароль' },
        { type: 'password', className: 'confirm-password-input', placeholder: 'Повторите пароль' }
      ].map(config => {
        const input = document.createElement('input');
        Object.assign(input, config);
        return input;
      });
      
      inputs.forEach(input => containerElement.appendChild(input));
      passwordSpan.replaceWith(containerElement);
      editBtn.textContent = '✎ Сохранить';
      isEditing = true;
      
      inputs[0].focus();
    } else {
      const newSpan = document.createElement('span');
      newSpan.id = 'password';
      newSpan.className = 'info-value';
      newSpan.textContent = defaultValue;
      
      if (containerElement) containerElement.replaceWith(newSpan);
      editBtn.textContent = '✎ Изменить';
      isEditing = false;
      containerElement = null;
    }
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    const inputs = containerElement.querySelectorAll('input');
    const currentPassword = inputs[0].value;
    const newPassword = inputs[1].value;
    const confirmPassword = inputs[2].value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Все поля обязательны для заполнения');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      alert('Пароль должен содержать минимум 8 символов');
      return;
    }
    
    try {
      editBtn.disabled = true;
      editBtn.textContent = 'Сохранение...';
      
      const response = await fetch('/profile/api/update-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
        throw new Error(error.message);
      }
      
      toggleEditMode(false);
      alert('Пароль успешно изменен');
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.message);
    } finally {
      editBtn.disabled = false;
    }
  };

  editBtn.addEventListener('click', async () => {
    if (isEditing) {
      await handleSave();
    } else {
      toggleEditMode(true);
    }
  });
}

// Вспомогательные функции
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateName(name) {
  return name.trim().length > 0;
}