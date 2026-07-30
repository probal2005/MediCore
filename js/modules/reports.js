const ReportsModule = {
  _activeReport: 'patient',

  render() {
    const reportTypes = [
      { id: 'patient', icon: 'fa-users', label: 'Patient Report', desc: 'Complete list of all registered patients with demographics and status', color: 'var(--primary)' },
      { id: 'doctor', icon: 'fa-user-md', label: 'Doctor Report', desc: 'Overview of medical staff including specializations and performance', color: 'var(--success)' },
      { id: 'appointment', icon: 'fa-calendar-check', label: 'Appointment Report', desc: 'Appointment analytics with status breakdown and trends', color: 'var(--info)' },
      { id: 'financial', icon: 'fa-dollar-sign', label: 'Financial Report', desc: 'Revenue analysis, payment tracking, and billing summaries', color: 'var(--warning)' },
      { id: 'inventory', icon: 'fa-pills', label: 'Inventory Report', desc: 'Medicine stock levels, expiring items, and supplier info', color: 'var(--secondary)' },
      { id: 'lab', icon: 'fa-flask', label: 'Lab Report', desc: 'Laboratory test orders, results, and turnaround statistics', color: 'var(--danger)' }
    ];

    return `
      <div class="dashboard-content">
        <div class="section-header">
          <div><h2 class="section-title">Reports</h2><p class="section-subtitle">Generate and export detailed reports</p></div>
          <div class="action-bar">
            <button class="btn btn-outline" onclick="ReportsModule.printReport()"><i class="fas fa-print"></i> Print</button>
            <button class="btn btn-outline" onclick="ReportsModule.exportCSV()"><i class="fas fa-file-csv"></i> CSV</button>
            <button class="btn btn-outline" onclick="ReportsModule.exportJSON()"><i class="fas fa-file-code"></i> JSON</button>
          </div>
        </div>

        <div class="card animate-fadeIn">
          <div class="card-body">
            <div class="grid-auto" style="margin-bottom:24px">
              ${reportTypes.map(r => `
                <div class="report-type-card ${this._activeReport === r.id ? 'active' : ''}" onclick="ReportsModule.selectReport('${r.id}')">
                  <div class="report-type-icon" style="background:${r.color}15;color:${r.color}"><i class="fas ${r.icon}"></i></div>
                  <div class="report-type-info">
                    <div class="report-type-name">${r.label}</div>
                    <div class="report-type-desc">${r.desc}</div>
                  </div>
                  <i class="fas fa-chevron-right report-type-arrow"></i>
                </div>
              `).join('')}
            </div>

            <div id="reportPreview" class="report-preview">
              ${this._getReportPreview()}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {},

  selectReport(id) {
    this._activeReport = id;
    const preview = document.getElementById('reportPreview');
    if (preview) preview.innerHTML = this._getReportPreview();
    document.querySelectorAll('.report-type-card').forEach(c => c.classList.toggle('active', c.getAttribute('onclick')?.includes(id)));
  },

  _getReportPreview() {
    switch (this._activeReport) {
      case 'patient': return this._patientReport();
      case 'doctor': return this._doctorReport();
      case 'appointment': return this._appointmentReport();
      case 'financial': return this._financialReport();
      case 'inventory': return this._inventoryReport();
      case 'lab': return this._labReport();
      default: return '<div class="empty-state"><i class="fas fa-file-alt empty-state-icon"></i><div class="empty-state-title">Select a report type</div></div>';
    }
  },

  _patientReport() {
    const patients = Store.getAllPatients();
    const activePatients = patients.filter(p => p.status === 'active').length;
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Patient Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | Total: ${patients.length} patients</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${patients.length}</div><div class="report-stat-label">Total Patients</div></div>
        <div class="report-stat"><div class="report-stat-value">${activePatients}</div><div class="report-stat-label">Active</div></div>
        <div class="report-stat"><div class="report-stat-value">${patients.filter(p => p.gender === 'M').length}</div><div class="report-stat-label">Male</div></div>
        <div class="report-stat"><div class="report-stat-value">${patients.filter(p => p.gender === 'F').length}</div><div class="report-stat-label">Female</div></div>
        <div class="report-stat"><div class="report-stat-value">${patients.reduce((s, p) => s + p.totalVisits, 0)}</div><div class="report-stat-label">Total Visits</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Patient</th><th>ID</th><th>Age</th><th>Gender</th><th>Blood</th><th>Phone</th><th>Visits</th><th>Status</th></tr></thead>
          <tbody>${patients.slice(0, 20).map(p => `
            <tr><td>${p.name}</td><td style="font-family:monospace;font-size:var(--font-size-xs)">${p.id}</td><td>${Formatters.age(p.dob)}</td><td>${Formatters.gender(p.gender)}</td><td>${p.bloodGroup}</td><td>${p.phone}</td><td>${p.totalVisits}</td><td><span class="badge badge-${p.status === 'active' ? 'success' : 'danger'}">${p.status}</span></td></tr>
          `).join('')}</tbody>
        </table>
      </div>
      ${patients.length > 20 ? '<div style="text-align:center;padding:12px;color:var(--text-tertiary);font-size:var(--font-size-sm)">Showing 20 of ' + patients.length + ' patients</div>' : ''}
    `;
  },

  _doctorReport() {
    const doctors = Store.getAllDoctors();
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Doctor Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | Total: ${doctors.length} doctors</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${doctors.length}</div><div class="report-stat-label">Total Doctors</div></div>
        <div class="report-stat"><div class="report-stat-value">${doctors.filter(d => d.status === 'active').length}</div><div class="report-stat-label">Active</div></div>
        <div class="report-stat"><div class="report-stat-value">${[...new Set(doctors.map(d => d.department))].length}</div><div class="report-stat-label">Departments</div></div>
        <div class="report-stat"><div class="report-stat-value">${doctors.reduce((s, d) => s + d.patientsCount, 0)}</div><div class="report-stat-label">Total Patients</div></div>
        <div class="report-stat"><div class="report-stat-value">${(doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1)}</div><div class="report-stat-label">Avg Rating</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Doctor</th><th>Department</th><th>Specialization</th><th>Experience</th><th>Patients</th><th>Fee</th><th>Rating</th><th>Status</th></tr></thead>
          <tbody>${doctors.map(d => `
            <tr><td>${d.name}</td><td>${d.department}</td><td>${d.specialization}</td><td>${d.experience} yrs</td><td>${d.patientsCount}</td><td>${Formatters.currency(d.consultationFee)}</td><td>${d.rating}</td><td><span class="badge badge-${d.status === 'active' ? 'success' : 'danger'}">${d.status}</span></td></tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
  },

  _appointmentReport() {
    const appts = Store.getAllAppointments();
    const scheduled = appts.filter(a => a.status === 'scheduled').length;
    const confirmed = appts.filter(a => a.status === 'confirmed').length;
    const completed = appts.filter(a => a.status === 'completed').length;
    const cancelled = appts.filter(a => a.status === 'cancelled').length;
    const pending = appts.filter(a => a.status === 'pending').length;
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Appointment Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | Total: ${appts.length} appointments</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${appts.length}</div><div class="report-stat-label">Total</div></div>
        <div class="report-stat"><div class="report-stat-value">${scheduled}</div><div class="report-stat-label">Scheduled</div></div>
        <div class="report-stat"><div class="report-stat-value">${confirmed}</div><div class="report-stat-label">Confirmed</div></div>
        <div class="report-stat"><div class="report-stat-value">${completed}</div><div class="report-stat-label">Completed</div></div>
        <div class="report-stat"><div class="report-stat-value">${cancelled + pending}</div><div class="report-stat-label">Other</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>${appts.slice(0, 20).map(a => `
            <tr><td>${a.patientName}</td><td>${a.doctorName}</td><td>${a.department}</td><td>${Formatters.date(a.date)}</td><td>${a.type}</td><td><span class="badge badge-${Helpers.getStatusColor(a.status)}">${Formatters.status(a.status)}</span></td></tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
  },

  _financialReport() {
    const billing = Store.get('billing');
    const totalRevenue = billing.reduce((s, b) => s + b.paid, 0);
    const totalPending = billing.reduce((s, b) => s + b.due, 0);
    const paidCount = billing.filter(b => b.status === 'paid').length;
    const partialCount = billing.filter(b => b.status === 'partial').length;
    const unpaidCount = billing.filter(b => b.status === 'unpaid').length;
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Financial Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | ${billing.length} transactions</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${Formatters.currency(totalRevenue)}</div><div class="report-stat-label">Total Revenue</div></div>
        <div class="report-stat"><div class="report-stat-value">${Formatters.currency(totalPending)}</div><div class="report-stat-label">Pending</div></div>
        <div class="report-stat"><div class="report-stat-value">${paidCount}</div><div class="report-stat-label">Paid Bills</div></div>
        <div class="report-stat"><div class="report-stat-value">${partialCount}</div><div class="report-stat-label">Partial</div></div>
        <div class="report-stat"><div class="report-stat-value">${unpaidCount}</div><div class="report-stat-label">Unpaid</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>${billing.map(b => `
            <tr><td style="font-family:monospace;font-size:var(--font-size-xs)">${b.id}</td><td>${b.patientName}</td><td>${Formatters.date(b.date)}</td><td>${Formatters.currency(b.amount)}</td><td>${Formatters.currency(b.paid)}</td><td>${Formatters.currency(b.due)}</td><td><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${Formatters.status(b.status)}</span></td></tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
  },

  _inventoryReport() {
    const meds = Store.get('medicines');
    const lowStock = meds.filter(m => m.stock <= m.minStock).length;
    const totalValue = meds.reduce((s, m) => s + m.price * m.stock, 0);
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Inventory Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | ${meds.length} medicines</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${meds.length}</div><div class="report-stat-label">Total Items</div></div>
        <div class="report-stat"><div class="report-stat-value">${lowStock}</div><div class="report-stat-label">Low Stock</div></div>
        <div class="report-stat"><div class="report-stat-value">${Formatters.currency(totalValue)}</div><div class="report-stat-label">Inventory Value</div></div>
        <div class="report-stat"><div class="report-stat-value">${meds.filter(m => new Date(m.expiry) < new Date(Date.now() + 90 * 86400000)).length}</div><div class="report-stat-label">Expiring Soon</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Medicine</th><th>Category</th><th>Price</th><th>Stock</th><th>Min Stock</th><th>Expiry</th><th>Status</th></tr></thead>
          <tbody>${meds.map(m => {
            const isLow = m.stock <= m.minStock;
            const isExpiring = new Date(m.expiry) < new Date(Date.now() + 90 * 86400000);
            return `<tr><td>${m.name}</td><td>${m.category}</td><td>${Formatters.currency(m.price)}</td><td>${m.stock}</td><td>${m.minStock}</td><td>${Formatters.date(m.expiry)}</td><td><span class="badge badge-${isLow ? 'danger' : isExpiring ? 'warning' : 'success'}">${isLow ? 'Low Stock' : isExpiring ? 'Expiring' : 'OK'}</span></td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>
    `;
  },

  _labReport() {
    const orders = Store.get('labOrders');
    const tests = Store.get('labTests');
    const completed = orders.filter(o => o.status === 'completed').length;
    const inProgress = orders.filter(o => o.status === 'in_progress').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    return `
      <div class="report-header">
        <h3 style="font-weight:600;font-size:var(--font-size-xl)">Lab Report</h3>
        <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">Generated on ${Formatters.date(new Date())} | ${orders.length} lab orders</p>
      </div>
      <div class="report-stats">
        <div class="report-stat"><div class="report-stat-value">${tests.length}</div><div class="report-stat-label">Test Types</div></div>
        <div class="report-stat"><div class="report-stat-value">${completed}</div><div class="report-stat-label">Completed</div></div>
        <div class="report-stat"><div class="report-stat-value">${inProgress}</div><div class="report-stat-label">In Progress</div></div>
        <div class="report-stat"><div class="report-stat-value">${pending}</div><div class="report-stat-label">Pending</div></div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Order ID</th><th>Patient</th><th>Test</th><th>Doctor</th><th>Ordered</th><th>Status</th><th>Result</th></tr></thead>
          <tbody>${orders.map(o => `
            <tr><td style="font-family:monospace;font-size:var(--font-size-xs)">${o.id}</td><td>${o.patientName}</td><td>${o.testName}</td><td>${o.doctorName}</td><td>${Formatters.date(o.orderedDate)}</td><td><span class="badge badge-${o.status === 'completed' ? 'success' : o.status === 'in_progress' ? 'warning' : 'danger'}">${Formatters.status(o.status)}</span></td><td>${o.result || '-'}</td></tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
  },

  _getReportData() {
    switch (this._activeReport) {
      case 'patient': return Store.getAllPatients().map(p => ({ Name: p.name, ID: p.id, Age: Formatters.age(p.dob), Gender: p.gender, Blood: p.bloodGroup, Phone: p.phone, Status: p.status }));
      case 'doctor': return Store.getAllDoctors().map(d => ({ Name: d.name, Department: d.department, Specialization: d.specialization, Experience: d.experience, Patients: d.patientsCount, Fee: d.consultationFee, Rating: d.rating }));
      case 'appointment': return Store.getAllAppointments().map(a => ({ Patient: a.patientName, Doctor: a.doctorName, Department: a.department, Date: a.date, Type: a.type, Status: a.status }));
      case 'financial': return Store.get('billing').map(b => ({ Invoice: b.id, Patient: b.patientName, Date: b.date, Amount: b.amount, Paid: b.paid, Due: b.due, Status: b.status }));
      case 'inventory': return Store.get('medicines').map(m => ({ Name: m.name, Category: m.category, Price: m.price, Stock: m.stock, MinStock: m.minStock, Expiry: m.expiry }));
      case 'lab': return Store.get('labOrders').map(o => ({ ID: o.id, Patient: o.patientName, Test: o.testName, Doctor: o.doctorName, Date: o.orderedDate, Status: o.status, Result: o.result || 'N/A' }));
      default: return [];
    }
  },

  exportCSV() {
    const data = this._getReportData();
    if (data.length) Exporters.toCSV(data, `${this._activeReport}-report`);
    else NotificationCenter.warning('No data to export');
  },

  exportJSON() {
    const data = this._getReportData();
    if (data.length) Exporters.toJSON(data, `${this._activeReport}-report`);
    else NotificationCenter.warning('No data to export');
  },

  printReport() {
    const preview = document.getElementById('reportPreview');
    if (preview) Exporters.print(preview);
  }
};
