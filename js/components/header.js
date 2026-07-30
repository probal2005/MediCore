const HeaderComponent = {
  render() {
    const user = Store.get('currentUser');
    const notifications = Store.get('notifications');
    const unreadCount = notifications.filter(n => !n.read).length;

    return `
      <header class="main-header">
        <div class="header-left">
          <button class="header-toggle" id="sidebarToggle" data-tooltip="Toggle Sidebar">
            <i class="fas fa-bars"></i>
          </button>
          <div class="header-search">
            <i class="fas fa-search"></i>
            <input type="text" class="form-input" placeholder="Search patients, doctors, appointments..." id="globalSearch">
          </div>
        </div>
        <div class="header-right">
          <button class="header-btn" data-tooltip="Notifications" id="notifBtn">
            <i class="fas fa-bell"></i>
            ${unreadCount > 0 ? `<span class="badge-dot" style="background:var(--danger)"></span>` : ''}
          </button>
          <div class="dropdown" id="notifDropdown">
            <div class="dropdown-menu notification-dropdown" id="notifMenu">
              <div class="dropdown-header" style="display:flex;justify-content:space-between;align-items:center;padding-right:12px">
                <span>Notifications</span>
                <button class="btn btn-sm btn-ghost" id="markAllRead">Mark all read</button>
              </div>
              <div class="divider" style="margin:0"></div>
              ${notifications.slice(0, 5).map(n => `
                <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                  <div class="notification-icon" style="background:${n.type === 'emergency' ? 'var(--danger-bg)' : n.type === 'appointment' ? 'var(--primary-bg)' : n.type === 'lab' ? 'var(--info-bg)' : 'var(--bg-tertiary)'};color:${n.type === 'emergency' ? 'var(--danger)' : n.type === 'appointment' ? 'var(--primary)' : 'var(--text-secondary)'}">
                    <i class="fas fa-${n.type === 'emergency' ? 'exclamation-triangle' : n.type === 'appointment' ? 'calendar' : n.type === 'lab' ? 'flask' : n.type === 'pharmacy' ? 'pills' : 'bell'}"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-text">${n.message}</div>
                    <div class="notification-time">${Helpers.getTimeAgo(n.time)}</div>
                  </div>
                </div>
              `).join('')}
              ${notifications.length === 0 ? '<div class="empty-state" style="padding:32px"><i class="fas fa-bell-slash empty-state-icon" style="font-size:2rem"></i><p>No notifications</p></div>' : ''}
            </div>
          </div>
          <button class="header-btn" data-tooltip="Theme" id="themeToggle">
            <i class="fas fa-moon theme-icon-dark"></i>
            <i class="fas fa-sun theme-icon-light"></i>
          </button>
          <button class="header-btn" data-tooltip="Full Screen" id="fullscreenToggle">
            <i class="fas fa-expand"></i>
          </button>
          <div class="divider-vertical" style="margin:0 4px"></div>
          <div class="dropdown" style="display:flex;align-items:center">
            <button class="header-btn" id="userMenuBtn" style="width:auto;gap:8px;padding:0 8px">
              <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(user ? user.name : 'User')}">${user ? Helpers.getInitials(user.name) : 'U'}</div>
            </button>
            <div class="dropdown-menu" id="userMenu">
              <div class="dropdown-header">${user ? user.name : 'Guest'}</div>
              <div class="dropdown-item" id="profileBtn"><i class="fas fa-user"></i> Profile</div>
              <div class="dropdown-item" id="settingsBtn"><i class="fas fa-cog"></i> Settings</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" id="logoutBtn"><i class="fas fa-sign-out-alt" style="color:var(--danger)"></i> <span style="color:var(--danger)">Logout</span></div>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  attachEvents() {
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (window.innerWidth <= 767) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
      } else {
        sidebar.classList.toggle('collapsed');
        Store.set('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });

    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('open');
    });

    document.getElementById('notifBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notifMenu').classList.toggle('show');
    });

    document.getElementById('markAllRead')?.addEventListener('click', () => {
      Store.markAllNotificationsRead();
      HeaderComponent.refresh();
    });

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      ThemeManager.toggle();
      const icon = document.getElementById('themeToggle').querySelector('i');
      if (icon) {
        if (ThemeManager.isDark()) { icon.className = 'fas fa-moon'; }
        else { icon.className = 'fas fa-sun'; }
      }
    });

    document.getElementById('fullscreenToggle')?.addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    });

    document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('userMenu').classList.toggle('show');
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      Store.logout();
      Router.navigate('login');
    });

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      Router.navigate('settings');
    });

    document.getElementById('globalSearch')?.addEventListener('focus', () => {
      SearchModal.open();
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        SearchModal.open();
      }
    });
  },

  refresh() {
    const header = document.querySelector('.main-header');
    if (header) {
      const parent = header.parentElement;
      const newHeader = HeaderComponent.render();
      header.outerHTML = newHeader;
      HeaderComponent.attachEvents();
    }
  }
};
