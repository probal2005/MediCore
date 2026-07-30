const App = {
  currentModule: null,

  init() {
    this._injectModalStyles();
    this._initRouter();
    Router.init();
  },

  _injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
      .modal-content { background:var(--bg-card); border-radius:var(--radius-xl); max-height:90vh; overflow-y:auto; width:100%; box-shadow:var(--shadow-2xl); }
      .modal-sm { max-width:400px; }
      .modal-md { max-width:600px; }
      .modal-lg { max-width:800px; }
      .modal-xl { max-width:1000px; }
      .modal-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border-color); position:sticky; top:0; background:var(--bg-card); z-index:1; }
      .modal-header h3 { font-size:var(--font-size-lg); font-weight:600; }
      .modal-close { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); color:var(--text-tertiary); font-size:1.25rem; cursor:pointer; transition:all var(--transition-fast); }
      .modal-close:hover { background:var(--bg-hover); color:var(--text-primary); }
      .modal-body { padding:20px; }
      .unread { background:var(--primary-bg); }
    `;
    document.head.appendChild(style);
  },

  _initRouter() {
    Router.register('login', () => this._renderAuth());
    Router.register('dashboard', () => this._renderApp('dashboard'));
    Router.register('doctors', () => this._renderApp('doctors'));
    Router.register('patients', () => this._renderApp('patients'));
    Router.register('appointments', () => this._renderApp('appointments'));
    Router.register('pharmacy', () => this._renderApp('pharmacy'));
    Router.register('laboratory', () => this._renderApp('laboratory'));
    Router.register('radiology', () => this._renderApp('radiology'));
    Router.register('blood-bank', () => this._renderApp('bloodBank'));
    Router.register('wards', () => this._renderApp('ward'));
    Router.register('icu', () => this._renderApp('icu'));
    Router.register('emergency', () => this._renderApp('emergency'));
    Router.register('operation-theater', () => this._renderApp('operationTheater'));
    Router.register('nurse-station', () => this._renderApp('nurseStation'));
    Router.register('staff', () => this._renderApp('staff'));
    Router.register('hr-payroll', () => this._renderApp('hrPayroll'));
    Router.register('attendance', () => this._renderApp('attendance'));
    Router.register('insurance', () => this._renderApp('insurance'));
    Router.register('billing', () => this._renderApp('billing'));
    Router.register('finance', () => this._renderApp('finance'));
    Router.register('analytics', () => this._renderApp('analytics'));
    Router.register('settings', () => this._renderApp('settings'));
    Router.register('reports', () => this._renderApp('reports'));

    Router.before((path) => {
      if (path !== 'login' && !Store.isAuthenticated()) {
        Router.navigate('login');
        return false;
      }
    });
  },

  _renderAuth() {
    const app = document.getElementById('app');
    app.innerHTML = AuthModule.render();
    AuthModule.attachEvents();
  },

  _renderApp(module) {
    const app = document.getElementById('app');
    app.innerHTML = this._getAppShell(module);
    this._renderModule(module);
    this.currentModule = module;
    this.attachEvents();
  },

  _getAppShell(module) {
    return `
      <div class="app-layout">
        ${Sidebar.render()}
        <div class="main-content">
          ${HeaderComponent.render()}
          <main class="module-page active" id="moduleContent">${this._getModuleContent(module)}</main>
          ${SearchModal.render()}
        </div>
      </div>
      <div class="chat-widget" id="chatWidget">
        <div class="chat-box" id="chatBox">
          <div class="chat-header">
            <span><i class="fas fa-robot"></i> MediCore Assistant</span>
            <button class="btn btn-sm btn-ghost" style="color:white" onclick="document.getElementById('chatBox').classList.remove('open')">&times;</button>
          </div>
          <div class="chat-messages" id="chatMessages">
            <div class="chat-message received">Hello! I'm MediCore AI Assistant. How can I help you today?</div>
            <div class="chat-message received">You can ask me about patients, appointments, or navigate to any module.</div>
          </div>
          <div class="chat-input-area">
            <input type="text" class="form-input" id="chatInput" placeholder="Type a message...">
            <button class="btn btn-primary btn-sm" onclick="App.sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
        <button class="chat-button" onclick="App.toggleChat()"><i class="fas fa-comment-dots"></i></button>
      </div>
    `;
  },

  _getModuleContent(module) {
    const modules = {
      dashboard: DashboardModule,
      doctors: DoctorsModule,
      patients: PatientsModule,
      appointments: AppointmentsModule,
      pharmacy: PharmacyModule,
      laboratory: LaboratoryModule,
      radiology: RadiologyModule,
      bloodBank: BloodBankModule,
      ward: WardModule,
      icu: ICUModule,
      emergency: EmergencyModule,
      operationTheater: OTModule,
      nurseStation: NurseStationModule,
      staff: StaffModule,
      hrPayroll: HRPayrollModule,
      attendance: AttendanceModule,
      insurance: InsuranceModule,
      billing: BillingModule,
      finance: FinanceModule,
      analytics: AnalyticsModule,
      settings: SettingsModule,
      reports: ReportsModule
    };
    const mod = modules[module];
    return mod ? mod.render() : `<div class="content-area"><div class="empty-state"><i class="fas fa-construction empty-state-icon"></i><div class="empty-state-title">Module under construction</div><div class="empty-state-text">This module is being developed and will be available soon.</div></div></div>`;
  },

  _renderModule(module) {
    const modules = {
      dashboard: DashboardModule,
      doctors: DoctorsModule,
      patients: PatientsModule,
      appointments: AppointmentsModule,
      pharmacy: PharmacyModule,
      laboratory: LaboratoryModule,
      radiology: RadiologyModule,
      bloodBank: BloodBankModule,
      ward: WardModule,
      icu: ICUModule,
      emergency: EmergencyModule,
      operationTheater: OTModule,
      nurseStation: NurseStationModule,
      staff: StaffModule,
      hrPayroll: HRPayrollModule,
      attendance: AttendanceModule,
      insurance: InsuranceModule,
      billing: BillingModule,
      finance: FinanceModule,
      analytics: AnalyticsModule,
      settings: SettingsModule,
      reports: ReportsModule
    };
    const mod = modules[module];
    if (mod && mod.attachEvents) {
      setTimeout(() => mod.attachEvents(), 50);
    }
  },

  attachEvents() {
    Sidebar.attachEvents();
    HeaderComponent.attachEvents();
    SearchModal.attachEvents();
    this._initGlobalShortcuts();
  },

  _initGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        SearchModal.close();
      }
    });
  },

  refresh() {
    const route = Router.getCurrentRoute();
    if (route === 'login') {
      this._renderAuth();
    } else {
      this._renderApp(route);
    }
  },

  toggleChat() {
    document.getElementById('chatBox')?.classList.toggle('open');
  },

  sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    if (!input || !messages || !input.value.trim()) return;

    const msg = input.value.trim();
    messages.innerHTML += `<div class="chat-message sent">${msg}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      const responses = [
        "I'll look into that for you right away.",
        "Let me check the system. Please hold on.",
        "I've found the relevant information. You can check the dashboard for more details.",
        "Would you like me to navigate to the relevant module?",
        "I've noted your request. Is there anything else I can help with?"
      ];
      messages.innerHTML += `<div class="chat-message received">${responses[Math.floor(Math.random() * responses.length)]}</div>`;
      messages.scrollTop = messages.scrollHeight;
    }, 1000);
  }
};
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
