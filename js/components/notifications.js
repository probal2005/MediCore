const NotificationCenter = {
  show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const colors = { success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--primary)' };
    const id = 'notif-' + Date.now();
    const html = `
      <div class="toast-notification" id="${id}" style="border-left:4px solid ${colors[type] || colors.info}">
        <i class="fas ${icons[type] || icons.info}" style="color:${colors[type] || colors.info}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        <div class="toast-progress" style="animation:progressBar ${duration}ms linear forwards;background:${colors[type] || colors.info}"></div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); }, duration);
  },

  success(msg, duration) { this.show(msg, 'success', duration); },
  error(msg, duration) { this.show(msg, 'error', duration); },
  warning(msg, duration) { this.show(msg, 'warning', duration); },
  info(msg, duration) { this.show(msg, 'info', duration); }
};

// Inject toast CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  #notification-container {
    position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; max-width: 400px;
  }
  .toast-notification {
    display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-card);
    border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
    animation: notificationSlideIn 0.3s ease; position: relative; overflow: hidden;
  }
  .toast-message { flex: 1; font-size: var(--font-size-sm); color: var(--text-primary); }
  .toast-close { color: var(--text-tertiary); cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0 4px; }
  .toast-close:hover { color: var(--text-primary); }
  .toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; }
`;
document.head.appendChild(toastStyle);
