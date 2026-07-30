const Sidebar = {
  render() {
    const collapsed = Store.get('sidebarCollapsed');
    const user = Store.get('currentUser');
    const role = user ? user.role : 'guest';
    const items = this._getNavItems(role);

    return `
      <aside class="sidebar ${collapsed ? 'collapsed' : ''}">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon"><i class="fas fa-hospital"></i></div>
          <span class="sidebar-logo-text">MediCore</span>
        </div>
        <nav class="sidebar-nav">
          ${Object.entries(items).map(([section, navItems]) => `
            <div class="sidebar-section">
              <div class="sidebar-section-title">${section}</div>
              ${navItems.map(item => `
                <div class="sidebar-item" data-route="${item.route}" data-tooltip="${item.label}">
                  <i class="${item.icon}"></i>
                  <span>${item.label}</span>
                  ${item.badge ? `<span class="badge badge-${item.badgeType || 'primary'}">${item.badge}</span>` : ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="avatar" style="background:${Helpers.getAvatarColor(user ? user.name : 'User')}">${user ? Helpers.getInitials(user.name) : 'U'}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user ? user.name : 'Guest'}</div>
              <div class="sidebar-user-role">${user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not logged in'}</div>
            </div>
          </div>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;
  },

  _getNavItems(role) {
    const items = {
      'Main': [
        { route: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' }
      ],
      'Medical': [
        { route: 'doctors', label: 'Doctors', icon: 'fas fa-user-md' },
        { route: 'patients', label: 'Patients', icon: 'fas fa-users' },
        { route: 'appointments', label: 'Appointments', icon: 'fas fa-calendar-check', badge: Store.get('appointments').filter(a => a.status === 'scheduled').length, badgeType: 'primary' }
      ],
      'Departments': [
        { route: 'pharmacy', label: 'Pharmacy', icon: 'fas fa-pills' },
        { route: 'laboratory', label: 'Laboratory', icon: 'fas fa-flask' },
        { route: 'radiology', label: 'Radiology', icon: 'fas fa-x-ray' },
        { route: 'blood-bank', label: 'Blood Bank', icon: 'fas fa-droplet' }
      ],
      'Facilities': [
        { route: 'wards', label: 'Ward Management', icon: 'fas fa-bed' },
        { route: 'icu', label: 'ICU', icon: 'fas fa-heartbeat' },
        { route: 'emergency', label: 'Emergency', icon: 'fas fa-ambulance', badge: Store.get('emergencyCases').filter(c => c.status !== 'discharged' && c.triage === 'critical').length, badgeType: 'danger' },
        { route: 'operation-theater', label: 'OT', icon: 'fas fa-syringe' },
        { route: 'nurse-station', label: 'Nurse Station', icon: 'fas fa-user-nurse' }
      ],
      'Administration': [
        { route: 'staff', label: 'Staff', icon: 'fas fa-id-badge' },
        { route: 'hr-payroll', label: 'HR & Payroll', icon: 'fas fa-money-bill-wave' },
        { route: 'attendance', label: 'Attendance', icon: 'fas fa-clipboard-list' }
      ],
      'Finance': [
        { route: 'billing', label: 'Billing', icon: 'fas fa-file-invoice-dollar' },
        { route: 'insurance', label: 'Insurance', icon: 'fas fa-shield-alt' },
        { route: 'finance', label: 'Finance', icon: 'fas fa-chart-line' }
      ],
      'Reports': [
        { route: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
        { route: 'reports', label: 'Reports', icon: 'fas fa-file-alt' }
      ],
      'System': [
        { route: 'settings', label: 'Settings', icon: 'fas fa-cog' }
      ]
    };
    return items;
  },

  attachEvents() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.dataset.route;
        Router.navigate(route);
        if (window.innerWidth <= 767) {
          document.querySelector('.sidebar').classList.remove('open');
          document.getElementById('sidebarOverlay').classList.remove('open');
        }
      });
    });

    document.querySelector('.sidebar-user')?.addEventListener('click', () => {
      document.querySelector('.sidebar-footer .dropdown-menu')?.classList.toggle('show');
    });
  }
};
