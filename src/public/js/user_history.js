document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('user-info')) {
      document.querySelector('button[onclick*="user-info"]').classList.add('active');
    } else if (currentPath.includes('user-history')) {
      document.querySelector('button[onclick*="user-history"]').classList.add('active');
    }
  });
  