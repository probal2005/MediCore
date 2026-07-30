const DoctorsModule = {
  render() {
    const doctors = Store.getAllDoctors();
    const depts = [...new Set(doctors.map(d => d.department))];
    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Doctors</h2><p class="section-subtitle">Manage hospital medical staff</p></div>
          <div class="action-bar">
            <div class="input-group" style="min-width:200px">
              <span class="input-group-prepend"><i class="fas fa-search"></i></span>
              <input type="text" class="form-input" id="doctorSearch" placeholder="Search doctors...">
            </div>
            <select class="form-select" id="doctorDeptFilter" style="width:160px">
              <option value="">All Departments</option>
              ${depts.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
            <button class="btn btn-primary" onclick="DoctorsModule.showAddModal()"><i class="fas fa-plus"></i> Add Doctor</button>
          </div>
        </div>
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Doctor</th><th>Department</th><th>Specialization</th><th>Experience</th><th>Patients</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="doctorTableBody">
                ${doctors.map(d => `
                  <tr>
                    <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(d.name)}">${Helpers.getInitials(d.name)}</div><div><div class="font-medium">${d.name}</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${d.email}</div></div></div></td>
                    <td>${d.department}</td>
                    <td>${d.specialization}</td>
                    <td>${d.experience} years</td>
                    <td>${d.patientsCount}</td>
                    <td>${Formatters.currency(d.consultationFee)}</td>
                    <td><span class="badge badge-${d.status === 'active' ? 'success' : 'danger'}">${d.status}</span></td>
                    <td class="actions">
                      <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.viewDoctor('${d.id}')" data-tooltip="View"><i class="fas fa-eye"></i></button>
                      <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.editDoctor('${d.id}')" data-tooltip="Edit"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.toggleDoctorStatus('${d.id}')" data-tooltip="${d.status === 'active' ? 'Deactivate' : 'Activate'}"><i class="fas fa-${d.status === 'active' ? 'pause' : 'play'}"></i></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="data-table-footer">
            <div class="data-table-info">${doctors.length} doctors total</div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('doctorSearch')?.addEventListener('input', Helpers.debounce(() => this._filterDoctors(), 200));
    document.getElementById('doctorDeptFilter')?.addEventListener('change', () => this._filterDoctors());
  },

  _filterDoctors() {
    const search = (document.getElementById('doctorSearch')?.value || '').toLowerCase();
    const dept = document.getElementById('doctorDeptFilter')?.value || '';
    const doctors = Store.getAllDoctors().filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search) || d.email.toLowerCase().includes(search) || d.specialization.toLowerCase().includes(search);
      const matchDept = !dept || d.department === dept;
      return matchSearch && matchDept;
    });
    const tbody = document.getElementById('doctorTableBody');
    if (tbody) {
      tbody.innerHTML = doctors.map(d => `
        <tr><td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(d.name)}">${Helpers.getInitials(d.name)}</div><div><div class="font-medium">${d.name}</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${d.email}</div></div></div></td>
        <td>${d.department}</td><td>${d.specialization}</td><td>${d.experience} years</td><td>${d.patientsCount}</td>
        <td>${Formatters.currency(d.consultationFee)}</td>
        <td><span class="badge badge-${d.status === 'active' ? 'success' : 'danger'}">${d.status}</span></td>
        <td class="actions">
          <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.viewDoctor('${d.id}')"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.editDoctor('${d.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-ghost" onclick="DoctorsModule.toggleDoctorStatus('${d.id}')"><i class="fas fa-${d.status === 'active' ? 'pause' : 'play'}"></i></button>
        </td></tr>
      `).join('');
    }
  },

  viewDoctor(id) {
    const d = Store.getDoctor(id);
    if (!d) return;
    Modal.open(`
      <div class="profile-card"><div class="profile-avatar" style="background:${Helpers.getAvatarColor(d.name)}">${Helpers.getInitials(d.name)}</div>
      <div class="profile-name">${d.name}</div><div class="profile-role">${d.specialization}</div>
      <div class="profile-stats"><div><div class="profile-stat-value">${d.experience}</div><div class="profile-stat-label">Years Exp</div></div>
      <div><div class="profile-stat-value">${d.patientsCount}</div><div class="profile-stat-label">Patients</div></div>
      <div><div class="profile-stat-value">${d.rating}</div><div class="profile-stat-label">Rating</div></div></div></div>
      <div class="divider"></div>
      <div class="detail-grid"><div class="detail-field"><div class="detail-label">Department</div><div class="detail-value">${d.department}</div></div>
      <div class="detail-field"><div class="detail-label">Email</div><div class="detail-value">${d.email}</div></div>
      <div class="detail-field"><div class="detail-label">Phone</div><div class="detail-value">${d.phone}</div></div>
      <div class="detail-field"><div class="detail-label">Availability</div><div class="detail-value">${d.availability}</div></div>
      <div class="detail-field"><div class="detail-label">Education</div><div class="detail-value">${d.education}</div></div>
      <div class="detail-field"><div class="detail-label">Consultation Fee</div><div class="detail-value">${Formatters.currency(d.consultationFee)}</div></div></div>
    `, { title: 'Doctor Profile', size: 'md' });
  },

  editDoctor(id) {
    const d = Store.getDoctor(id);
    if (!d) return;
    Modal.open(`
      <form id="editDoctorForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="edName" value="${d.name}"></div>
        <div class="form-group"><label class="form-label">Department</label><input type="text" class="form-input" id="edDept" value="${d.department}"></div>
        <div class="form-group"><label class="form-label">Specialization</label><input type="text" class="form-input" id="edSpec" value="${d.specialization}"></div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="edEmail" value="${d.email}"></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" class="form-input" id="edPhone" value="${d.phone}"></div>
        <div class="form-group"><label class="form-label">Fee ($)</label><input type="number" class="form-input" id="edFee" value="${d.consultationFee}"></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button></div></form>
    `, { title: 'Edit Doctor' });
    document.getElementById('editDoctorForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.updateDoctor(id, { name: document.getElementById('edName').value, department: document.getElementById('edDept').value, specialization: document.getElementById('edSpec').value, email: document.getElementById('edEmail').value, phone: document.getElementById('edPhone').value, consultationFee: parseFloat(document.getElementById('edFee').value) });
      Modal.close();
      NotificationCenter.success('Doctor updated successfully');
      this._renderContent();
    });
  },

  toggleDoctorStatus(id) {
    const d = Store.getDoctor(id);
    if (d) {
      const newStatus = d.status === 'active' ? 'inactive' : 'active';
      Store.updateDoctor(id, { status: newStatus });
      NotificationCenter.success(`${d.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      this._renderContent();
    }
  },

  showAddModal() {
    Modal.open(`
      <form id="addDoctorForm"><div class="detail-grid">
        <div class="form-group"><label class="form-label">Name *</label><input type="text" class="form-input" id="adName" placeholder="Dr. Full Name" required></div>
        <div class="form-group"><label class="form-label">Department *</label><select class="form-select" id="adDept"><option>Cardiology</option><option>Neurology</option><option>Pediatrics</option><option>Orthopedics</option><option>Dermatology</option><option>Emergency Medicine</option><option>Ophthalmology</option><option>Psychiatry</option><option>OB-GYN</option><option>Oncology</option><option>Radiology</option><option>Anesthesiology</option></select></div>
        <div class="form-group"><label class="form-label">Specialization</label><input type="text" class="form-input" id="adSpec" placeholder="e.g., Interventional Cardiology"></div>
        <div class="form-group"><label class="form-label">Email *</label><input type="email" class="form-input" id="adEmail" placeholder="doctor@medicore.com" required></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" class="form-input" id="adPhone" placeholder="(555) 000-0000"></div>
        <div class="form-group"><label class="form-label">Consultation Fee ($)</label><input type="number" class="form-input" id="adFee" placeholder="200" value="200"></div>
        <div class="form-group"><label class="form-label">Experience (years)</label><input type="number" class="form-input" id="adExp" value="10"></div>
        <div class="form-group"><label class="form-label">Education</label><input type="text" class="form-input" id="adEdu" placeholder="Medical School"></div>
      </div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Doctor</button></div></form>
    `, { title: 'Add New Doctor' });
    document.getElementById('addDoctorForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newDoctor = { id: Helpers.generateDoctorId(), name: document.getElementById('adName').value, department: document.getElementById('adDept').value, specialization: document.getElementById('adSpec').value, email: document.getElementById('adEmail').value, phone: document.getElementById('adPhone').value, consultationFee: parseFloat(document.getElementById('adFee').value) || 200, experience: parseInt(document.getElementById('adExp').value) || 10, education: document.getElementById('adEdu').value || '', patientsCount: 0, rating: 5, status: 'active', availability: 'Mon-Fri 9AM-5PM', nextAvailable: new Date().toISOString(), avatar: null };
      Store.addDoctor(newDoctor);
      Modal.close();
      NotificationCenter.success('Doctor added successfully');
      this._renderContent();
    });
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('doctors'); App.attachEvents(); }
  }
};
