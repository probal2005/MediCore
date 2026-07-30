const SettingsModule = {
  _activeTab: 'general',

  render() {
    const settings = Store.get('settings');
    const isDark = ThemeManager.isDark();
    return `
      <div class="dashboard-content">
        <div class="section-header">
          <div><h2 class="section-title">Settings</h2><p class="section-subtitle">Manage system preferences and configuration</p></div>
        </div>

        <div class="card animate-fadeIn">
          <div class="tabs">
            <div class="tab ${this._activeTab === 'general' ? 'active' : ''}" onclick="SettingsModule.switchTab('general')"><i class="fas fa-cog"></i> General</div>
            <div class="tab ${this._activeTab === 'notifications' ? 'active' : ''}" onclick="SettingsModule.switchTab('notifications')"><i class="fas fa-bell"></i> Notifications</div>
            <div class="tab ${this._activeTab === 'theme' ? 'active' : ''}" onclick="SettingsModule.switchTab('theme')"><i class="fas fa-palette"></i> Theme</div>
            <div class="tab ${this._activeTab === 'data' ? 'active' : ''}" onclick="SettingsModule.switchTab('data')"><i class="fas fa-database"></i> Data Management</div>
          </div>

          <div class="card-body">
            <div class="tab-content ${this._activeTab === 'general' ? 'active' : ''}" id="tabGeneral">
              <form id="generalSettingsForm">
                <div class="detail-grid">
                  <div class="form-group">
                    <label class="form-label">Hospital Name</label>
                    <input type="text" class="form-input" id="sHospitalName" value="MediCore Hospital">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Hospital Address</label>
                    <input type="text" class="form-input" id="sAddress" value="123 Healthcare Ave, Medical District">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Language</label>
                    <select class="form-select" id="sLanguage">
                      <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                      <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Spanish</option>
                      <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>French</option>
                      <option value="de" ${settings.language === 'de' ? 'selected' : ''}>German</option>
                      <option value="zh" ${settings.language === 'zh' ? 'selected' : ''}>Chinese</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Timezone</label>
                    <select class="form-select" id="sTimezone">
                      <option value="UTC" ${settings.timezone === 'UTC' ? 'selected' : ''}>UTC (Coordinated Universal Time)</option>
                      <option value="EST" ${settings.timezone === 'EST' ? 'selected' : ''}>EST (Eastern Standard Time)</option>
                      <option value="CST" ${settings.timezone === 'CST' ? 'selected' : ''}>CST (Central Standard Time)</option>
                      <option value="PST" ${settings.timezone === 'PST' ? 'selected' : ''}>PST (Pacific Standard Time)</option>
                      <option value="GMT" ${settings.timezone === 'GMT' ? 'selected' : ''}>GMT (Greenwich Mean Time)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date Format</label>
                    <select class="form-select" id="sDateFormat">
                      <option value="MM/DD/YYYY" ${settings.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY" ${settings.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD" ${settings.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Time Format</label>
                    <select class="form-select" id="sTimeFormat">
                      <option value="12h" ${settings.timeFormat === '12h' ? 'selected' : ''}>12-hour (AM/PM)</option>
                      <option value="24h" ${settings.timeFormat === '24h' ? 'selected' : ''}>24-hour</option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-end gap-sm mt-lg">
                  <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Settings</button>
                </div>
              </form>
            </div>

            <div class="tab-content ${this._activeTab === 'notifications' ? 'active' : ''}" id="tabNotifications">
              <div class="settings-section">
                <h4 style="font-weight:600;margin-bottom:16px">Notification Preferences</h4>
                <div class="settings-item">
                  <div class="settings-item-info">
                    <i class="fas fa-envelope" style="color:var(--primary);width:24px"></i>
                    <div><div class="font-medium">Email Notifications</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Receive updates via email</div></div>
                  </div>
                  <label class="toggle"><input type="checkbox" id="sEmailNotif" ${settings.emailNotifications ? 'checked' : ''}><span class="toggle-slider"></span></label>
                </div>
                <div class="settings-item">
                  <div class="settings-item-info">
                    <i class="fas fa-mobile-alt" style="color:var(--success);width:24px"></i>
                    <div><div class="font-medium">Push Notifications</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Receive push notifications on your device</div></div>
                  </div>
                  <label class="toggle"><input type="checkbox" id="sPushNotif" ${settings.pushNotifications ? 'checked' : ''}><span class="toggle-slider"></span></label>
                </div>
                <div class="settings-item">
                  <div class="settings-item-info">
                    <i class="fas fa-sms" style="color:var(--warning);width:24px"></i>
                    <div><div class="font-medium">SMS Notifications</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Receive SMS alerts for urgent matters</div></div>
                  </div>
                  <label class="toggle"><input type="checkbox" id="sSmsNotif" ${settings.smsNotifications ? 'checked' : ''}><span class="toggle-slider"></span></label>
                </div>
                <div class="flex justify-end gap-sm mt-lg">
                  <button class="btn btn-primary" onclick="SettingsModule.saveNotificationSettings()"><i class="fas fa-save"></i> Save Preferences</button>
                </div>
              </div>
            </div>

            <div class="tab-content ${this._activeTab === 'theme' ? 'active' : ''}" id="tabTheme">
              <div class="settings-section">
                <h4 style="font-weight:600;margin-bottom:16px">Appearance</h4>
                <div class="theme-selector">
                  <div class="theme-option ${!isDark ? 'active' : ''}" onclick="SettingsModule.setTheme('light')">
                    <div class="theme-preview" style="background:#ffffff;border:2px solid #e2e8f0">
                      <div style="height:8px;width:60%;background:#f1f5f9;border-radius:4px;margin-bottom:8px"></div>
                      <div style="height:4px;width:80%;background:#e2e8f0;border-radius:2px;margin-bottom:4px"></div>
                      <div style="height:4px;width:60%;background:#e2e8f0;border-radius:2px"></div>
                    </div>
                    <div class="theme-name"><i class="fas fa-sun"></i> Light Mode</div>
                  </div>
                  <div class="theme-option ${isDark ? 'active' : ''}" onclick="SettingsModule.setTheme('dark')">
                    <div class="theme-preview" style="background:#1e293b;border:2px solid #334155">
                      <div style="height:8px;width:60%;background:#334155;border-radius:4px;margin-bottom:8px"></div>
                      <div style="height:4px;width:80%;background:#475569;border-radius:2px;margin-bottom:4px"></div>
                      <div style="height:4px;width:60%;background:#475569;border-radius:2px"></div>
                    </div>
                    <div class="theme-name"><i class="fas fa-moon"></i> Dark Mode</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-content ${this._activeTab === 'data' ? 'active' : ''}" id="tabData">
              <div class="settings-section">
                <h4 style="font-weight:600;margin-bottom:16px">Data Management</h4>
                <div class="settings-item">
                  <div class="settings-item-info">
                    <i class="fas fa-file-export" style="color:var(--primary);width:24px"></i>
                    <div><div class="font-medium">Export All Data</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Download all system data as a JSON file</div></div>
                  </div>
                  <button class="btn btn-outline" onclick="SettingsModule.exportAllData()"><i class="fas fa-download"></i> Export</button>
                </div>
                <div class="settings-item">
                  <div class="settings-item-info">
                    <i class="fas fa-trash-alt" style="color:var(--danger);width:24px"></i>
                    <div><div class="font-medium">Clear All Data</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Remove all data and reset to defaults. This action cannot be undone.</div></div>
                  </div>
                  <button class="btn btn-danger" onclick="SettingsModule.confirmClearData()"><i class="fas fa-exclamation-triangle"></i> Clear Data</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('generalSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._saveGeneralSettings();
    });
  },

  switchTab(tab) {
    this._activeTab = tab;
    this._renderContent();
  },

  _saveGeneralSettings() {
    const settings = {
      language: document.getElementById('sLanguage').value,
      timezone: document.getElementById('sTimezone').value,
      dateFormat: document.getElementById('sDateFormat').value,
      timeFormat: document.getElementById('sTimeFormat').value,
      weekStartsOn: Store.get('settings').weekStartsOn || 'monday',
      rowsPerPage: Store.get('settings').rowsPerPage || 10,
      emailNotifications: Store.get('settings').emailNotifications,
      pushNotifications: Store.get('settings').pushNotifications,
      smsNotifications: Store.get('settings').smsNotifications
    };
    Store.set('settings', settings);
    NotificationCenter.success('Settings saved successfully');
  },

  saveNotificationSettings() {
    const s = Store.get('settings');
    s.emailNotifications = document.getElementById('sEmailNotif').checked;
    s.pushNotifications = document.getElementById('sPushNotif').checked;
    s.smsNotifications = document.getElementById('sSmsNotif').checked;
    Store.set('settings', s);
    NotificationCenter.success('Notification preferences saved');
  },

  setTheme(theme) {
    ThemeManager.set(theme);
    this._renderContent();
    NotificationCenter.success(`${theme === 'dark' ? 'Dark' : 'Light'} mode activated`);
  },

  exportAllData() {
    const data = {};
    const keys = ['doctors', 'patients', 'appointments', 'medicines', 'billing', 'staff', 'labTests', 'labOrders'];
    keys.forEach(k => data[k] = Store.get(k));
    Exporters.toJSON(data, 'medicore-full-backup');
    NotificationCenter.success('Data exported successfully');
  },

  confirmClearData() {
    Modal.open(`
      <div style="text-align:center;padding:20px">
        <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px"></i>
        <h3 style="font-weight:600;margin-bottom:8px">Clear All Data?</h3>
        <p style="color:var(--text-secondary);margin-bottom:24px">This will permanently delete all system data including patients, doctors, appointments, and billing records. This action cannot be undone.</p>
        <div class="flex justify-center gap-sm">
          <button class="btn btn-secondary btn-lg" onclick="Modal.close()">Cancel</button>
          <button class="btn btn-danger btn-lg" onclick="SettingsModule.clearAllData()"><i class="fas fa-trash"></i> Yes, Clear Everything</button>
        </div>
      </div>
    `, { title: 'Confirm Data Clear', size: 'sm' });
  },

  clearAllData() {
    Modal.close();
    Store.clearAll();
    ThemeManager.set('light');
    location.reload();
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('settings'); App.attachEvents(); }
  }
};
