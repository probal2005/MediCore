const Store = {
  _data: {},
  _listeners: {},

  init() {
    const saved = localStorage.getItem('medicore-data');
    if (saved) {
      try { this._data = JSON.parse(saved); }
      catch (e) { this._data = this._getDefaultData(); }
    } else {
      this._data = this._getDefaultData();
    }
    this.save();
    return this;
  },

  _getDefaultData() {
    return {
      users: JSON.parse(JSON.stringify(MockData.users)),
      doctors: JSON.parse(JSON.stringify(MockData.doctors)),
      patients: JSON.parse(JSON.stringify(MockData.patients)),
      appointments: JSON.parse(JSON.stringify(MockData.appointments)),
      medicines: JSON.parse(JSON.stringify(MockData.pharmacy.medicines)),
      suppliers: JSON.parse(JSON.stringify(MockData.pharmacy.suppliers)),
      labTests: JSON.parse(JSON.stringify(MockData.laboratory.tests)),
      labOrders: JSON.parse(JSON.stringify(MockData.laboratory.labOrders)),
      radiologyExams: JSON.parse(JSON.stringify(MockData.radiology.exams)),
      radOrders: JSON.parse(JSON.stringify(MockData.radiology.radOrders)),
      bloodInventory: JSON.parse(JSON.stringify(MockData.bloodBank.inventory)),
      bloodDonors: JSON.parse(JSON.stringify(MockData.bloodBank.donors)),
      bloodRequests: JSON.parse(JSON.stringify(MockData.bloodBank.requests)),
      wards: JSON.parse(JSON.stringify(MockData.wards)),
      beds: JSON.parse(JSON.stringify(MockData.beds)),
      icuBeds: JSON.parse(JSON.stringify(MockData.icu.beds)),
      icuEquipment: JSON.parse(JSON.stringify(MockData.icu.equipment)),
      emergencyCases: JSON.parse(JSON.stringify(MockData.emergency.cases)),
      emergencyStats: JSON.parse(JSON.stringify(MockData.emergency.stats)),
      theaters: JSON.parse(JSON.stringify(MockData.operationTheater.theaters)),
      surgerySchedule: JSON.parse(JSON.stringify(MockData.operationTheater.schedule)),
      nurseShifts: JSON.parse(JSON.stringify(MockData.nurseStation.shifts)),
      nurseTasks: JSON.parse(JSON.stringify(MockData.nurseStation.tasks)),
      staff: JSON.parse(JSON.stringify(MockData.staff)),
      attendance: JSON.parse(JSON.stringify(MockData.attendance)),
      billing: JSON.parse(JSON.stringify(MockData.billing)),
      insurance: JSON.parse(JSON.stringify(MockData.insurance)),
      notifications: JSON.parse(JSON.stringify(MockData.notifications)),
      activities: JSON.parse(JSON.stringify(MockData.activities)),
      currentUser: null,
      settings: { language: 'en', timezone: 'UTC', dateFormat: 'MM/DD/YYYY', timeFormat: '12h', weekStartsOn: 'monday', rowsPerPage: 10, emailNotifications: true, pushNotifications: true, smsNotifications: false }
    };
  },

  get(key) { return this._data[key]; },
  set(key, val) { this._data[key] = val; this.save(); this._notify(key, val); },
  update(key, fn) { this._data[key] = fn(this._data[key]); this.save(); this._notify(key, this._data[key]); },

  save() {
    try { localStorage.setItem('medicore-data', JSON.stringify(this._data)); } catch (e) {}
  },

  on(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(fn);
    return () => { this._listeners[key] = this._listeners[key].filter(l => l !== fn); };
  },

  _notify(key, val) {
    (this._listeners[key] || []).forEach(fn => fn(val));
  },

  getAllDoctors() { return this.get('doctors'); },
  getAllPatients() { return this.get('patients'); },
  getAllAppointments() { return this.get('appointments'); },
  getAllMedicines() { return this.get('medicines'); },

  getDoctor(id) { return this.get('doctors').find(d => d.id === id); },
  getPatient(id) { return this.get('patients').find(p => p.id === id); },
  getAppointment(id) { return this.get('appointments').find(a => a.id === id); },

  addDoctor(doctor) { this.update('doctors', d => [...d, doctor]); },
  addPatient(patient) { this.update('patients', p => [...p, patient]); },
  addAppointment(appt) { this.update('appointments', a => [...a, appt]); },

  updateDoctor(id, updates) { this.update('doctors', d => d.map(doc => doc.id === id ? { ...doc, ...updates } : doc)); },
  updatePatient(id, updates) { this.update('patients', p => p.map(pt => pt.id === id ? { ...pt, ...updates } : pt)); },
  updateAppointment(id, updates) { this.update('appointments', a => a.map(apt => apt.id === id ? { ...apt, ...updates } : apt)); },

  addNotification(notif) { this.update('notifications', n => [{ ...notif, id: Helpers.generateId(), time: new Date().toISOString(), read: false }, ...n]); },
  markNotificationRead(id) { this.update('notifications', n => n.map(not => not.id === id ? { ...not, read: true } : not)); },
  markAllNotificationsRead() { this.update('notifications', n => n.map(not => ({ ...not, read: true }))); },

  addActivity(activity) { this.update('activities', a => [{ id: Helpers.generateId(), time: new Date().toISOString(), ...activity }, ...a].slice(0, 50)); },

  getAppointmentsByDate(date) { return this.get('appointments').filter(a => a.date.startsWith(date)); },
  getAppointmentsByDoctor(doctorId) { return this.get('appointments').filter(a => a.doctorId === doctorId); },
  getAppointmentsByPatient(patientId) { return this.get('appointments').filter(a => a.patientId === patientId); },

  getLowStockMedicines() { return this.get('medicines').filter(m => m.stock <= m.minStock); },
  getExpiringMedicines(days = 90) { const cutoff = new Date(); cutoff.setDate(cutoff.getDate() + days); return this.get('medicines').filter(m => new Date(m.expiry) <= cutoff); },

  getAvailableBeds() { return this.get('beds').filter(b => b.status === 'available'); },
  getOccupiedBeds() { return this.get('beds').filter(b => b.status === 'occupied'); },

  getTotalRevenue() { return this.get('billing').reduce((sum, b) => sum + b.paid, 0); },
  getPendingRevenue() { return this.get('billing').reduce((sum, b) => sum + b.due, 0); },

  getCurrentUser() { return this.get('currentUser'); },
  isAuthenticated() { return !!this.get('currentUser'); },

  login(email, password) {
    const user = this.get('users').find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      this.set('currentUser', safeUser);
      this.addActivity({ user: user.name, action: 'logged in', target: '', type: 'auth' });
    }
    return user;
  },

  logout() {
    this.set('currentUser', null);
  },

  toggleSidebar() { this.set('sidebarCollapsed', !this.get('sidebarCollapsed')); },

  clearAll() {
    localStorage.removeItem('medicore-data');
    this._data = this._getDefaultData();
    this.save();
  }
};

Store.init();
