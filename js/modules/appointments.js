const AppointmentsModule = {
  render() {
    const appts = Store.getAllAppointments();
    const today = new Date().toISOString().split('T')[0];
    const statuses = ['all', 'scheduled', 'confirmed', 'pending', 'completed', 'cancelled'];
    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Appointments</h2><p class="section-subtitle">Schedule and manage patient appointments</p></div>
          <div class="action-bar">
            <select class="form-select" id="apptStatusFilter" style="width:150px">
              ${statuses.map(s => `<option value="${s}">${s === 'all' ? 'All Status' : Formatters.status(s)}</option>`).join('')}
            </select>
            <button class="btn btn-primary" onclick="AppointmentsModule.showAddModal()"><i class="fas fa-plus"></i> New Appointment</button>
          </div>
        </div>
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date & Time</th><th>Type</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="apptTableBody">
                ${appts.sort((a,b) => new Date(b.date) - new Date(a.date)).map(a => `
                  <tr><td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(a.patientName)}">${Helpers.getInitials(a.patientName)}</div><span class="font-medium">${a.patientName}</span></div></td>
                  <td>${a.doctorName}</td><td>${a.department}</td>
                  <td>${Formatters.date(a.date)} <span style="color:var(--text-tertiary)">${Formatters.time(a.date)}</span></td>
                  <td>${a.type}</td><td>${a.duration} min</td>
                  <td><span class="badge badge-${Helpers.getStatusColor(a.status)}">${Formatters.status(a.status)}</span></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.editAppt('${a.id}')"><i class="fas fa-edit"></i></button>
                    ${a.status === 'scheduled' || a.status === 'confirmed' ? `<button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.completeAppt('${a.id}')" style="color:var(--success)"><i class="fas fa-check"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.cancelAppt('${a.id}')" style="color:var(--danger)"><i class="fas fa-times"></i></button>` : ''}
                  </td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="data-table-footer"><div class="data-table-info">${appts.length} appointments total</div></div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('apptStatusFilter')?.addEventListener('change', () => this._filterAppts());
  },

  _filterAppts() {
    const status = document.getElementById('apptStatusFilter')?.value || 'all';
    const appts = status === 'all' ? Store.getAllAppointments() : Store.getAllAppointments().filter(a => a.status === status);
    const tbody = document.getElementById('apptTableBody');
    if (tbody) tbody.innerHTML = appts.sort((a,b) => new Date(b.date) - new Date(a.date)).map(a => `
      <tr><td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(a.patientName)}">${Helpers.getInitials(a.patientName)}</div><span class="font-medium">${a.patientName}</span></div></td>
      <td>${a.doctorName}</td><td>${a.department}</td>
      <td>${Formatters.date(a.date)} <span style="color:var(--text-tertiary)">${Formatters.time(a.date)}</span></td>
      <td>${a.type}</td><td>${a.duration} min</td>
      <td><span class="badge badge-${Helpers.getStatusColor(a.status)}">${Formatters.status(a.status)}</span></td>
      <td class="actions">
        <button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.editAppt('${a.id}')"><i class="fas fa-edit"></i></button>
        ${a.status === 'scheduled' || a.status === 'confirmed' ? `<button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.completeAppt('${a.id}')" style="color:var(--success)"><i class="fas fa-check"></i></button>
        <button class="btn btn-sm btn-ghost" onclick="AppointmentsModule.cancelAppt('${a.id}')" style="color:var(--danger)"><i class="fas fa-times"></i></button>` : ''}
      </td></tr>
    `).join('');
  },

  editAppt(id) {
    const a = Store.getAppointment(id);
    if (!a) return;
    Modal.open(`
      <form id="editApptForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Patient</label><input type="text" class="form-input" value="${a.patientName}" disabled></div>
        <div class="form-group"><label class="form-label">Doctor</label><input type="text" class="form-input" value="${a.doctorName}" disabled></div>
        <div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input" id="eaDate" value="${a.date.split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Time</label><input type="time" class="form-input" id="eaTime" value="${new Date(a.date).toTimeString().slice(0,5)}"></div>
        <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="eaType"><option ${a.type === 'Check-up' ? 'selected' : ''}>Check-up</option><option ${a.type === 'Consultation' ? 'selected' : ''}>Consultation</option><option ${a.type === 'Follow-up' ? 'selected' : ''}>Follow-up</option><option ${a.type === 'Procedure' ? 'selected' : ''}>Procedure</option><option ${a.type === 'Therapy' ? 'selected' : ''}>Therapy</option></select></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="eaStatus"><option value="scheduled" ${a.status === 'scheduled' ? 'selected' : ''}>Scheduled</option><option value="confirmed" ${a.status === 'confirmed' ? 'selected' : ''}>Confirmed</option><option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option><option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Cancelled</option></select></div>
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Notes</label><textarea class="form-textarea" id="eaNotes">${a.notes || ''}</textarea></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update</button></div></form>
    `, { title: 'Edit Appointment' });
    document.getElementById('editApptForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('eaDate').value;
      const time = document.getElementById('eaTime').value;
      Store.updateAppointment(id, { type: document.getElementById('eaType').value, status: document.getElementById('eaStatus').value, notes: document.getElementById('eaNotes').value, date: new Date(date + 'T' + time).toISOString() });
      Modal.close();
      NotificationCenter.success('Appointment updated');
      this._renderContent();
    });
  },

  completeAppt(id) {
    Store.updateAppointment(id, { status: 'completed' });
    NotificationCenter.success('Appointment marked as completed');
    this._renderContent();
  },

  cancelAppt(id) {
    Store.updateAppointment(id, { status: 'cancelled' });
    NotificationCenter.warning('Appointment cancelled');
    this._renderContent();
  },

  showAddModal() {
    const patients = Store.getAllPatients();
    const doctors = Store.getAllDoctors();
    Modal.open(`
      <form id="addApptForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Patient *</label><select class="form-select" id="aaPatient" required><option value="">Select patient...</option>${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Doctor *</label><select class="form-select" id="aaDoctor" required><option value="">Select doctor...</option>${doctors.map(d => `<option value="${d.id}">${d.name} - ${d.department}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Date *</label><input type="date" class="form-input" id="aaDate" required></div>
        <div class="form-group"><label class="form-label">Time *</label><input type="time" class="form-input" id="aaTime" required></div>
        <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="aaType"><option>Check-up</option><option>Consultation</option><option>Follow-up</option><option>Procedure</option><option>Therapy</option></select></div>
        <div class="form-group"><label class="form-label">Duration</label><select class="form-select" id="aaDuration"><option value="15">15 min</option><option value="30" selected>30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Schedule</button></div></form>
    `, { title: 'New Appointment' });
    document.getElementById('addApptForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientId = document.getElementById('aaPatient').value;
      const doctorId = document.getElementById('aaDoctor').value;
      const patient = Store.getPatient(patientId);
      const doctor = Store.getDoctor(doctorId);
      const date = document.getElementById('aaDate').value;
      const time = document.getElementById('aaTime').value;
      if (patient && doctor) {
        const appt = { id: 'APT' + Date.now().toString(36).toUpperCase(), patientId, patientName: patient.name, doctorId, doctorName: doctor.name, department: doctor.department, date: new Date(date + 'T' + time).toISOString(), type: document.getElementById('aaType').value, status: 'scheduled', duration: parseInt(document.getElementById('aaDuration').value), notes: '', createdAt: new Date().toISOString() };
        Store.addAppointment(appt);
        Store.addActivity({ user: Store.getCurrentUser()?.name || 'System', action: 'scheduled appointment', target: patient.name + ' with ' + doctor.name, type: 'appointment' });
        Modal.close();
        NotificationCenter.success('Appointment scheduled');
        this._renderContent();
      }
    });
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('appointments'); App.attachEvents(); }
  }
};
