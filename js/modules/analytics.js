const AnalyticsModule = {
  render() {
    const patients = Store.getAllPatients();
    const appointments = Store.getAllAppointments();
    const doctors = Store.getAllDoctors();
    const billing = Store.get('billing');
    const avgPatientsPerDay = Math.round(patients.length / 30) || 1;
    const completedAppts = appointments.filter(a => a.status === 'completed').length;
    const completionRate = appointments.length > 0 ? Math.round(completedAppts / appointments.length * 100) : 0;
    const newThisMonth = patients.filter(p => p.registrationDate.startsWith(new Date().toISOString().slice(0, 7))).length;
    const avgRevenuePerPatient = patients.length > 0 ? billing.reduce((s, b) => s + b.paid, 0) / patients.length : 0;

    return `
      <div class="dashboard-content">
        <div class="section-header">
          <div><h2 class="section-title">Analytics</h2><p class="section-subtitle">Comprehensive data analysis and insights</p></div>
          <div class="action-bar">
            <select class="form-select" id="analyticsPeriod" style="width:140px" onchange="AnalyticsModule.refreshAll()">
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
            <button class="btn btn-outline" onclick="AnalyticsModule.exportAnalytics()"><i class="fas fa-download"></i> Export</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card animate-fadeInUp stagger-1">
            <div class="stat-card-icon" style="background:var(--primary-bg);color:var(--primary)"><i class="fas fa-chart-line"></i></div>
            <div class="stat-card-value">${avgPatientsPerDay}</div>
            <div class="stat-card-label">Avg Patients / Day</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> ${Math.round(avgPatientsPerDay * 1.15)} projected</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-2">
            <div class="stat-card-icon" style="background:var(--success-bg);color:var(--success)"><i class="fas fa-check-circle"></i></div>
            <div class="stat-card-value">${completionRate}%</div>
            <div class="stat-card-label">Appt Completion Rate</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> ${completedAppts} completed</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-3">
            <div class="stat-card-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="fas fa-user-plus"></i></div>
            <div class="stat-card-value">${newThisMonth}</div>
            <div class="stat-card-label">New Patients / Month</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> ${patients.length} total active</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-4">
            <div class="stat-card-icon" style="background:var(--info-bg);color:var(--info)"><i class="fas fa-coins"></i></div>
            <div class="stat-card-value">${Formatters.currency(avgRevenuePerPatient)}</div>
            <div class="stat-card-label">Avg Revenue / Patient</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> Lifetime value</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card animate-fadeInUp stagger-5">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Patient Admission Trends</h3>
            </div>
            <div class="card-body">
              <canvas id="admissionTrendChart" height="280"></canvas>
            </div>
          </div>
          <div class="card animate-fadeInUp stagger-6">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Department-wise Patients</h3>
            </div>
            <div class="card-body">
              <canvas id="deptPatientsChart" height="280"></canvas>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card animate-fadeInUp stagger-7">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Appointment Status Breakdown</h3>
            </div>
            <div class="card-body">
              <canvas id="apptStatusChart" height="260"></canvas>
            </div>
          </div>
          <div class="card animate-fadeInUp stagger-8">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Monthly Comparison</h3>
            </div>
            <div class="card-body">
              <canvas id="monthlyComparisonChart" height="260"></canvas>
            </div>
          </div>
        </div>

        <div class="card animate-fadeInUp stagger-9">
          <div class="card-header">
            <h3 style="font-weight:600;font-size:var(--font-size-lg)">Department Performance Summary</h3>
          </div>
          <div class="card-body" style="padding:0">
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Department</th><th>Total Patients</th><th>Appointments</th><th>Completion Rate</th><th>Revenue</th><th>Avg Rating</th></tr></thead>
                <tbody>
                  ${doctors.map(d => d.department).filter((v, i, a) => a.indexOf(v) === i).map(dept => {
                    const deptDoctors = doctors.filter(d => d.department === dept);
                    const deptAppts = appointments.filter(a => a.department === dept);
                    const deptCompleted = deptAppts.filter(a => a.status === 'completed').length;
                    const deptRate = deptAppts.length > 0 ? Math.round(deptCompleted / deptAppts.length * 100) : 0;
                    const deptRevenue = billing.filter(b => deptDoctors.some(d => b.patientId && true)).reduce((s, b) => s + b.paid, 0);
                    const avgRating = deptDoctors.reduce((s, d) => s + d.rating, 0) / (deptDoctors.length || 1);
                    return `<tr>
                      <td><span class="font-medium">${dept}</span></td>
                      <td>${deptDoctors.reduce((s, d) => s + d.patientsCount, 0)}</td>
                      <td>${deptAppts.length}</td>
                      <td><div class="flex items-center gap-sm"><div class="progress" style="flex:1;max-width:100px"><div class="progress-bar progress-bar-success" style="width:${deptRate}%"></div></div><span style="font-size:var(--font-size-xs)">${deptRate}%</span></div></td>
                      <td>${Formatters.currency(deptRevenue)}</td>
                      <td><span style="color:var(--warning)">${'★'.repeat(Math.round(avgRating))}</span> ${avgRating.toFixed(1)}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    this._initAdmissionTrend();
    this._initDeptPatients();
    this._initApptStatus();
    this._initMonthlyComparison();
  },

  _initAdmissionTrend() {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const admissions = [65, 72, 80, 68, 85, 78];
    const discharges = [58, 66, 74, 62, 79, 72];
    ChartComponent.createLineChart('admissionTrendChart', months, [
      { label: 'Admissions', data: admissions, borderColor: 'var(--primary)', backgroundColor: 'rgba(79,70,229,0.08)', fill: true },
      { label: 'Discharges', data: discharges, borderColor: 'var(--success)', backgroundColor: 'rgba(16,185,129,0.08)', fill: true }
    ], { plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') } } } });
  },

  _initDeptPatients() {
    const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Oncology', 'Dermatology', 'Psychiatry'];
    const counts = [145, 98, 210, 167, 320, 192, 89, 76];
    ChartComponent.createBarChart('deptPatientsChart', depts, [
      { label: 'Patients', data: counts, backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'] }
    ], { plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 45 } } } });
  },

  _initApptStatus() {
    const appts = Store.getAllAppointments();
    const scheduled = appts.filter(a => a.status === 'scheduled').length;
    const confirmed = appts.filter(a => a.status === 'confirmed').length;
    const completed = appts.filter(a => a.status === 'completed').length;
    const cancelled = appts.filter(a => a.status === 'cancelled').length;
    const pending = appts.filter(a => a.status === 'pending').length;
    ChartComponent.createDoughnutChart('apptStatusChart',
      ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Pending'],
      [scheduled, confirmed, completed, cancelled, pending],
      ['#4f46e5', '#0ea5e9', '#10b981', '#ef4444', '#f59e0b'],
      { plugins: { legend: { display: true, position: 'bottom', labels: { padding: 16, usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') } } } }
    );
  },

  _initMonthlyComparison() {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const current = [12, 15, 18, 14, 20, 16];
    const previous = [10, 13, 15, 12, 17, 14];
    ChartComponent.createBarChart('monthlyComparisonChart', months, [
      { label: 'This Year', data: current, backgroundColor: 'rgba(79,70,229,0.7)' },
      { label: 'Last Year', data: previous, backgroundColor: 'rgba(203,213,225,0.5)' }
    ], { plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') } } } });
  },

  refreshAll() {
    ChartComponent.destroyAll();
    this.attachEvents();
  },

  exportAnalytics() {
    const data = [
      { Metric: 'Avg Patients/Day', Value: Store.getAllPatients().length / 30 },
      { Metric: 'Appt Completion Rate', Value: (Store.getAllAppointments().filter(a => a.status === 'completed').length / Store.getAllAppointments().length * 100).toFixed(1) + '%' },
      { Metric: 'New Patients/Month', Value: Store.getAllPatients().filter(p => p.registrationDate.startsWith(new Date().toISOString().slice(0, 7))).length },
      { Metric: 'Avg Revenue/Patient', Value: Formatters.currency(Store.get('billing').reduce((s, b) => s + b.paid, 0) / (Store.getAllPatients().length || 1)) }
    ];
    Exporters.toCSV(data, 'analytics-summary');
  }
};
