const PatientsModule = {
  render() {
    const patients = Store.getAllPatients();
    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Patients</h2><p class="section-subtitle">Manage patient records and medical history</p></div>
          <div class="action-bar">
            <div class="input-group" style="min-width:200px"><span class="input-group-prepend"><i class="fas fa-search"></i></span>
            <input type="text" class="form-input" id="patientSearch" placeholder="Search patients..."></div>
            <select class="form-select" id="patientStatusFilter" style="width:140px">
              <option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
            <button class="btn btn-primary" onclick="PatientsModule.showAddModal()"><i class="fas fa-plus"></i> Register Patient</button>
          </div>
        </div>
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Patient</th><th>ID</th><th>Age/Gender</th><th>Blood</th><th>Phone</th><th>Last Visit</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="patientTableBody">
                ${patients.map(p => `
                  <tr><td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(p.name)}">${Helpers.getInitials(p.name)}</div><span class="font-medium">${p.name}</span></div></td>
                  <td style="font-family:monospace;font-size:var(--font-size-xs)">${p.id}</td>
                  <td>${Formatters.age(p.dob)} / ${p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}</td>
                  <td><span class="badge badge-info">${p.bloodGroup}</span></td>
                  <td>${p.phone}</td>
                  <td>${Formatters.date(p.lastVisit)}</td>
                  <td><span class="badge badge-${p.status === 'active' ? 'success' : 'danger'}">${p.status}</span></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-ghost" onclick="PatientsModule.viewPatient('${p.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="PatientsModule.editPatient('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="PatientsModule.showTimeline('${p.id}')"><i class="fas fa-history"></i></button>
                  </td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="data-table-footer"><div class="data-table-info">${patients.length} patients registered</div></div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('patientSearch')?.addEventListener('input', Helpers.debounce(() => this._filterPatients(), 200));
    document.getElementById('patientStatusFilter')?.addEventListener('change', () => this._filterPatients());
  },

  _filterPatients() {
    const search = (document.getElementById('patientSearch')?.value || '').toLowerCase();
    const status = document.getElementById('patientStatusFilter')?.value || '';
    const patients = Store.getAllPatients().filter(p => {
      const ms = p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search) || p.phone.includes(search);
      const ms2 = !status || p.status === status;
      return ms && ms2;
    });
    const tbody = document.getElementById('patientTableBody');
    if (tbody) tbody.innerHTML = patients.map(p => `
      <tr><td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(p.name)}">${Helpers.getInitials(p.name)}</div><span class="font-medium">${p.name}</span></div></td>
      <td style="font-family:monospace;font-size:var(--font-size-xs)">${p.id}</td>
      <td>${Formatters.age(p.dob)} / ${p.gender === 'M' ? 'Male' : 'Female'}</td>
      <td><span class="badge badge-info">${p.bloodGroup}</span></td>
      <td>${p.phone}</td>
      <td>${Formatters.date(p.lastVisit)}</td>
      <td><span class="badge badge-${p.status === 'active' ? 'success' : 'danger'}">${p.status}</span></td>
      <td class="actions">
        <button class="btn btn-sm btn-ghost" onclick="PatientsModule.viewPatient('${p.id}')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-sm btn-ghost" onclick="PatientsModule.editPatient('${p.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-ghost" onclick="PatientsModule.showTimeline('${p.id}')"><i class="fas fa-history"></i></button>
      </td></tr>
    `).join('');
  },

  viewPatient(id) {
    const p = Store.getPatient(id);
    if (!p) return;
    Modal.open(`
      <div class="profile-card"><div class="profile-avatar" style="background:${Helpers.getAvatarColor(p.name)}">${Helpers.getInitials(p.name)}</div>
      <div class="profile-name">${p.name}</div><div class="profile-role">Patient ID: ${p.id}</div>
      <div class="profile-stats"><div><div class="profile-stat-value">${Formatters.age(p.dob)}</div><div class="profile-stat-label">Age</div></div>
      <div><div class="profile-stat-value">${p.totalVisits}</div><div class="profile-stat-label">Visits</div></div>
      <div><div class="profile-stat-value">${p.bloodGroup}</div><div class="profile-stat-label">Blood Group</div></div></div></div>
      <div class="divider"></div>
      <div class="detail-grid">
        <div class="detail-field"><div class="detail-label">Date of Birth</div><div class="detail-value">${Formatters.date(p.dob)}</div></div>
        <div class="detail-field"><div class="detail-label">Gender</div><div class="detail-value">${Formatters.gender(p.gender)}</div></div>
        <div class="detail-field"><div class="detail-label">Email</div><div class="detail-value">${p.email}</div></div>
        <div class="detail-field"><div class="detail-label">Phone</div><div class="detail-value">${p.phone}</div></div>
        <div class="detail-field"><div class="detail-label">Address</div><div class="detail-value">${p.address}</div></div>
        <div class="detail-field"><div class="detail-label">Registration Date</div><div class="detail-value">${Formatters.date(p.registrationDate)}</div></div>
        <div class="detail-field"><div class="detail-label">Insurance</div><div class="detail-value">${p.insurance} (${p.insuranceId})</div></div>
        <div class="detail-field"><div class="detail-label">Emergency Contact</div><div class="detail-value">${p.emergencyName} - ${p.emergencyContact}</div></div>
      </div>
      ${p.allergies.length ? `<div class="mt-md"><div class="detail-label mb-sm">Allergies</div><div class="flex gap-sm">${p.allergies.map(a => `<span class="badge badge-danger"><i class="fas fa-exclamation-triangle"></i> ${a}</span>`).join('')}</div></div>` : ''}
      ${p.medicalConditions.length ? `<div class="mt-md"><div class="detail-label mb-sm">Medical Conditions</div><div class="flex gap-sm">${p.medicalConditions.map(m => `<span class="badge badge-warning">${m}</span>`).join('')}</div></div>` : ''}
    `, { title: 'Patient Profile', size: 'lg' });
  },

  editPatient(id) {
    const p = Store.getPatient(id);
    if (!p) return;
    Modal.open(`
      <form id="editPatientForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="epName" value="${p.name}"></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" class="form-input" id="epPhone" value="${p.phone}"></div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="epEmail" value="${p.email}"></div>
        <div class="form-group"><label class="form-label">Address</label><input type="text" class="form-input" id="epAddress" value="${p.address}"></div>
        <div class="form-group"><label class="form-label">Insurance</label><input type="text" class="form-input" id="epIns" value="${p.insurance}"></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="epStatus"><option value="active" ${p.status === 'active' ? 'selected' : ''}>Active</option><option value="inactive" ${p.status === 'inactive' ? 'selected' : ''}>Inactive</option></select></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update</button></div></form>
    `, { title: 'Edit Patient' });
    document.getElementById('editPatientForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.updatePatient(id, { name: document.getElementById('epName').value, phone: document.getElementById('epPhone').value, email: document.getElementById('epEmail').value, address: document.getElementById('epAddress').value, insurance: document.getElementById('epIns').value, status: document.getElementById('epStatus').value });
      Modal.close();
      NotificationCenter.success('Patient updated');
      this._renderContent();
    });
  },

  showTimeline(id) {
    const p = Store.getPatient(id);
    const appts = Store.get('appointments').filter(a => a.patientId === id);
    const labs = Store.get('labOrders').filter(l => l.patientId === id);
    const bills = Store.get('billing').filter(b => b.patientId === id);
    const events = [...appts.map(a => ({ date: a.date, title: a.type + ' with ' + a.doctorName, desc: a.notes, type: 'appointment' })), ...labs.map(l => ({ date: l.orderedDate, title: 'Lab: ' + l.testName, desc: l.result || 'In progress', type: 'lab' })), ...bills.map(b => ({ date: b.date, title: 'Bill - ' + Formatters.currency(b.amount), desc: b.status, type: 'billing' }))].sort((a,b) => new Date(b.date) - new Date(a.date));
    Modal.open(`
      <div class="profile-card" style="padding:16px"><div class="profile-avatar" style="width:56px;height:56px;font-size:1.25rem;background:${Helpers.getAvatarColor(p.name)}">${Helpers.getInitials(p.name)}</div>
      <div class="profile-name" style="font-size:var(--font-size-lg)">${p.name}</div><div class="profile-role">${p.id}</div></div>
      <div class="divider"></div>
      <div class="timeline">
        ${events.length ? events.map(e => `
          <div class="timeline-item"><div class="timeline-dot ${e.type === 'appointment' ? 'success' : e.type === 'lab' ? 'warning' : ''}"></div>
          <div class="timeline-date">${Formatters.date(e.date)}</div>
          <div class="timeline-title">${e.title}</div>
          <div class="timeline-text">${e.desc || 'No details'}</div></div>
        `).join('') : '<div class="empty-state"><i class="fas fa-history empty-state-icon"></i><div class="empty-state-title">No activity recorded</div></div>'}
      </div>
    `, { title: 'Patient Timeline', size: 'md' });
  },

  showAddModal() {
    Modal.open(`
      <form id="addPatientForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Full Name *</label><input type="text" class="form-input" id="apName" required></div>
        <div class="form-group"><label class="form-label">Date of Birth *</label><input type="date" class="form-input" id="apDob" required></div>
        <div class="form-group"><label class="form-label">Gender</label><select class="form-select" id="apGender"><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></div>
        <div class="form-group"><label class="form-label">Blood Group</label><select class="form-select" id="apBlood"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
        <div class="form-group"><label class="form-label">Phone *</label><input type="text" class="form-input" id="apPhone" required></div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="apEmail"></div>
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Address</label><input type="text" class="form-input" id="apAddress"></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Register</button></div></form>
    `, { title: 'Register New Patient' });
    document.getElementById('addPatientForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const p = { id: Helpers.generatePatientId(), name: document.getElementById('apName').value, dob: document.getElementById('apDob').value, gender: document.getElementById('apGender').value, bloodGroup: document.getElementById('apBlood').value, phone: document.getElementById('apPhone').value, email: document.getElementById('apEmail').value || '', address: document.getElementById('apAddress').value || '', emergencyContact: '', emergencyName: '', insurance: 'Self Pay', insuranceId: '', allergies: [], medicalConditions: [], status: 'active', lastVisit: new Date().toISOString(), registrationDate: new Date().toISOString(), totalVisits: 0, avatar: null };
      Store.addPatient(p);
      Modal.close();
      NotificationCenter.success('Patient registered successfully');
      this._renderContent();
    });
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('patients'); App.attachEvents(); }
  }
};
