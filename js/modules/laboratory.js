const LaboratoryModule = {
  render() {
    const tests = Store.get('labTests');
    const orders = Store.get('labOrders');
    const patients = Store.getAllPatients();
    const doctors = Store.getAllDoctors();
    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Laboratory</h2><p class="section-subtitle">Lab test management and order tracking</p></div>
          <div class="action-bar">
            <button class="btn btn-primary" onclick="LaboratoryModule.showNewOrder()"><i class="fas fa-plus"></i> New Lab Order</button>
          </div>
        </div>
        <div class="tabs" id="labTabs">
          <div class="tab active" data-tab="orders">Orders (${orders.filter(o => o.status !== 'completed').length})</div>
          <div class="tab" data-tab="tests">Test Catalog (${tests.length})</div>
          <div class="tab" data-tab="results">Results</div>
        </div>
        <div class="tab-content active" id="tab-orders">
          <div class="card mt-md">
            <div class="table-responsive"><table class="data-table"><thead><tr><th>Order ID</th><th>Patient</th><th>Test</th><th>Doctor</th><th>Ordered</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>${orders.map(o => `<tr><td style="font-family:monospace;font-size:var(--font-size-xs)">${o.id}</td>
                <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(o.patientName)}">${Helpers.getInitials(o.patientName)}</div>${o.patientName}</div></td>
                <td>${o.testName}</td><td>${o.doctorName}</td>
                <td>${Formatters.date(o.orderedDate)}</td>
                <td><span class="badge badge-${o.status === 'completed' ? 'success' : o.status === 'in_progress' ? 'warning' : 'info'}">${Formatters.status(o.status)}</span></td>
                <td class="actions">
                  ${o.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="LaboratoryModule.startTest('${o.id}')"><i class="fas fa-play"></i></button>` : ''}
                  ${o.status === 'in_progress' ? `<button class="btn btn-sm btn-primary" onclick="LaboratoryModule.addResult('${o.id}')"><i class="fas fa-flask"></i></button>` : ''}
                  ${o.result ? `<button class="btn btn-sm btn-info" onclick="LaboratoryModule.viewResult('${o.id}')"><i class="fas fa-file-medical"></i></button>` : ''}
                </td></tr>`).join('')}
              </tbody>
            </table></div>
          </div>
        </div>
        <div class="tab-content" id="tab-tests">
          <div class="card mt-md">
            <div class="table-responsive"><table class="data-table"><thead><tr><th>Test Name</th><th>Category</th><th>Sample</th><th>Price</th><th>Turnaround</th><th>Preparation</th></tr></thead>
              <tbody>${tests.map(t => `<tr><td class="font-medium">${t.name}</td><td><span class="badge badge-info">${t.category}</span></td><td>${t.sampleType}</td><td>${Formatters.currency(t.price)}</td><td>${t.turnaround}</td><td style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${t.preparation}</td></tr>`).join('')}</tbody>
            </table></div>
          </div>
        </div>
        <div class="tab-content" id="tab-results">
          <div class="card mt-md">
            <div class="table-responsive"><table class="data-table"><thead><tr><th>Patient</th><th>Test</th><th>Result</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>${orders.filter(o => o.status === 'completed').map(o => `<tr><td>${o.patientName}</td><td>${o.testName}</td><td class="font-medium">${o.result || 'Normal'}</td><td>${o.doctorName}</td><td>${Formatters.date(o.orderedDate)}</td><td><span class="badge badge-success">Completed</span></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty-state" style="padding:32px"><i class="fas fa-flask empty-state-icon"></i><div class="empty-state-title">No completed tests</div></div></td></tr>'}</tbody>
            </table></div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.querySelectorAll('#labTabs .tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('#labTabs .tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('tab-' + this.dataset.tab)?.classList.add('active');
      });
    });
  },

  startTest(id) {
    Store.update('labOrders', orders => orders.map(o => o.id === id ? { ...o, status: 'in_progress', technician: Store.getCurrentUser()?.name || 'Lab Technician' } : o));
    NotificationCenter.info('Test started');
    App.refresh();
  },

  addResult(id) {
    Modal.open(`<form id="resultForm"><div class="form-group"><label class="form-label">Test Result</label><textarea class="form-textarea" id="lrResult" placeholder="Enter test results..." rows="4"></textarea></div>
      <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="lrNotes" rows="2"></textarea></div>
      <div class="flex justify-end gap-sm"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Result</button></div></form>`, { title: 'Add Test Result' });
    document.getElementById('resultForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.update('labOrders', orders => orders.map(o => o.id === id ? { ...o, status: 'completed', result: document.getElementById('lrResult').value || 'Normal', notes: document.getElementById('lrNotes').value } : o));
      Modal.close(); NotificationCenter.success('Result saved'); App.refresh();
    });
  },

  viewResult(id) {
    const o = Store.get('labOrders').find(x => x.id === id);
    if (!o) return;
    Modal.open(`<div class="detail-grid"><div class="detail-field"><div class="detail-label">Patient</div><div class="detail-value">${o.patientName}</div></div>
      <div class="detail-field"><div class="detail-label">Test</div><div class="detail-value">${o.testName}</div></div>
      <div class="detail-field"><div class="detail-label">Doctor</div><div class="detail-value">${o.doctorName}</div></div>
      <div class="detail-field"><div class="detail-label">Date</div><div class="detail-value">${Formatters.date(o.orderedDate)}</div></div>
      <div class="detail-field" style="grid-column:1/-1"><div class="detail-label">Result</div><div class="detail-value" style="font-size:var(--font-size-base);padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-md)">${o.result || 'Pending'}</div></div>
      ${o.notes ? `<div class="detail-field" style="grid-column:1/-1"><div class="detail-label">Notes</div><div class="detail-value">${o.notes}</div></div>` : ''}
    </div>`, { title: 'Lab Result', size: 'md' });
  },

  showNewOrder() {
    const patients = Store.getAllPatients();
    const doctors = Store.getAllDoctors();
    const tests = Store.get('labTests');
    Modal.open(`<form id="newLabOrder"><div class="detail-grid">
      <div class="form-group"><label class="form-label">Patient *</label><select class="form-select" id="loPatient" required><option value="">Select...</option>${patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Doctor *</label><select class="form-select" id="loDoctor" required><option value="">Select...</option>${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">Test *</label><select class="form-select" id="loTest" required><option value="">Select test...</option>${tests.map(t => `<option value="${t.id}">${t.name} - ${Formatters.currency(t.price)}</option>`).join('')}</select></div>
    </div><div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
    <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Create Order</button></div></form>`, { title: 'New Lab Order' });
    document.getElementById('newLabOrder')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const patient = Store.getPatient(document.getElementById('loPatient').value);
      const doctor = Store.getDoctor(document.getElementById('loDoctor').value);
      const test = tests.find(t => t.id === document.getElementById('loTest').value);
      if (patient && doctor && test) {
        const order = { id: 'LO' + Date.now().toString(36).toUpperCase(), patientId: patient.id, patientName: patient.name, doctorId: doctor.id, doctorName: doctor.name, testId: test.id, testName: test.name, orderedDate: new Date().toISOString(), status: 'pending', result: null, technician: null, notes: '' };
        Store.update('labOrders', orders => [...orders, order]);
        Modal.close(); NotificationCenter.success('Lab order created'); App.refresh();
      }
    });
  }
};
