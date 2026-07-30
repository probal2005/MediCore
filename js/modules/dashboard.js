const DashboardModule = {
  render() {
    const user = Store.get('currentUser');
    const patients = Store.get('patients');
    const doctors = Store.get('doctors');
    const appointments = Store.get('appointments');
    const beds = Store.get('beds');
    const activities = Store.get('activities');
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date.startsWith(today) && a.status !== 'cancelled');
    const totalRevenue = Store.getTotalRevenue();
    const activePatients = patients.filter(p => p.status === 'active').length;
    const availableBeds = beds.filter(b => b.status === 'available').length;

    return `
      <div class="dashboard-content">
        <div class="welcome-section animate-fadeIn">
          <h1 class="welcome-title">Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user ? user.name.split(' ')[0] : 'Guest'}!</h1>
          <p class="welcome-subtitle">Here's what's happening at MediCore Hospital today.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card animate-fadeInUp stagger-1">
            <div class="stat-card-icon" style="background:var(--primary-bg);color:var(--primary)"><i class="fas fa-users"></i></div>
            <div class="stat-card-value" id="statPatients">${activePatients}</div>
            <div class="stat-card-label">Active Patients</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> 12% from last month</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-2">
            <div class="stat-card-icon" style="background:var(--success-bg);color:var(--success)"><i class="fas fa-user-md"></i></div>
            <div class="stat-card-value">${doctors.length}</div>
            <div class="stat-card-label">Available Doctors</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> 2 new this week</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-3">
            <div class="stat-card-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="fas fa-calendar-check"></i></div>
            <div class="stat-card-value">${todayAppts.length}</div>
            <div class="stat-card-label">Today's Appointments</div>
            <div class="stat-card-change ${todayAppts.filter(a => a.status === 'completed').length > 0 ? 'up' : 'down'}">
              <i class="fas fa-${todayAppts.filter(a => a.status === 'completed').length > 0 ? 'arrow-up' : 'minus'}"></i>
              ${todayAppts.filter(a => a.status === 'completed').length} completed
            </div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-4">
            <div class="stat-card-icon" style="background:var(--info-bg);color:var(--info)"><i class="fas fa-bed"></i></div>
            <div class="stat-card-value">${availableBeds}</div>
            <div class="stat-card-label">Available Beds</div>
            <div class="stat-card-change ${availableBeds > 5 ? 'up' : 'down'}">
              <i class="fas fa-${availableBeds > 5 ? 'arrow-up' : 'arrow-down'}"></i>
              ${Math.round(availableBeds / beds.length * 100)}% occupancy
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card animate-fadeInUp stagger-5">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Today's Appointments</h3>
              <button class="btn btn-sm btn-ghost" onclick="Router.navigate('appointments')">View All <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="card-body" style="padding:0">
              ${todayAppts.length === 0 ? '<div class="empty-state" style="padding:40px"><i class="fas fa-calendar-check empty-state-icon"></i><div class="empty-state-title">No appointments today</div></div>' : `
                <div style="padding:8px 16px">
                  ${todayAppts.slice(0, 5).map(a => `
                    <div class="appointment-item">
                      <div class="appointment-time">${Formatters.time(a.date)}</div>
                      <div><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(a.patientName)}">${Helpers.getInitials(a.patientName)}</div></div>
                      <div class="appointment-info">
                        <div class="appointment-doctor">${a.patientName}</div>
                        <div class="appointment-type">${a.doctorName} - ${a.type}</div>
                      </div>
                      <span class="badge badge-${Helpers.getStatusColor(a.status)}">${Formatters.status(a.status)}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>

          <div class="card animate-fadeInUp stagger-6">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Recent Activity</h3>
            </div>
            <div class="card-body" style="padding:0">
              <div style="padding:8px 16px">
                ${activities.slice(0, 5).map(a => `
                  <div class="activity-item">
                    <div class="activity-dot" style="background:${a.type === 'appointment' ? 'var(--primary)' : a.type === 'registration' ? 'var(--success)' : a.type === 'lab' ? 'var(--info)' : a.type === 'pharmacy' ? 'var(--warning)' : 'var(--text-tertiary)'}"></div>
                    <div class="activity-content">
                      <div class="activity-text"><strong>${a.user}</strong> ${a.action} <strong>${a.target}</strong></div>
                      <div class="activity-time">${Helpers.getTimeAgo(a.time)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="card-footer" style="justify-content:center">
              <button class="btn btn-sm btn-ghost" onclick="NotificationCenter.info('Viewing full activity log')">View all activity</button>
            </div>
          </div>
        </div>

        <div class="card animate-fadeInUp stagger-7">
          <div class="card-header">
            <h3 style="font-weight:600;font-size:var(--font-size-lg)">Weekly Overview</h3>
            <div class="flex gap-sm">
              <button class="btn btn-sm btn-ghost active" id="revenueBtn">Revenue</button>
              <button class="btn btn-sm btn-ghost" id="appointmentsBtn">Appointments</button>
            </div>
          </div>
          <div class="card-body">
            <canvas id="weeklyChart" height="250"></canvas>
          </div>
        </div>

        <div class="grid-3 mt-lg">
          <div class="card animate-fadeInUp stagger-1">
            <div class="card-header"><h3 style="font-weight:600;font-size:var(--font-size-base)">Department Overview</h3></div>
            <div class="card-body">
              <canvas id="deptChart" height="200"></canvas>
            </div>
          </div>
          <div class="card animate-fadeInUp stagger-2">
            <div class="card-header"><h3 style="font-weight:600;font-size:var(--font-size-base)">Patient Admissions</h3></div>
            <div class="card-body">
              <canvas id="admissionChart" height="200"></canvas>
            </div>
          </div>
          <div class="card animate-fadeInUp stagger-3">
            <div class="card-header"><h3 style="font-weight:600;font-size:var(--font-size-base)">Bed Occupancy</h3></div>
            <div class="card-body">
              <canvas id="bedChart" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Weekly chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueData = [4200, 3800, 5100, 4600, 5400, 3200, 2800];
    const apptData = [12, 15, 18, 14, 20, 8, 6];
    let currentView = 'revenue';

    ChartComponent.createBarChart('weeklyChart', days, [{ label: 'Revenue', data: revenueData, backgroundColor: 'rgba(79,70,229,0.7)' }]);

    document.getElementById('revenueBtn')?.addEventListener('click', function() {
      this.classList.add('active');
      document.getElementById('appointmentsBtn').classList.remove('active');
      ChartComponent.destroy('weeklyChart');
      ChartComponent.createBarChart('weeklyChart', days, [{ label: 'Revenue ($)', data: revenueData, backgroundColor: 'rgba(79,70,229,0.7)' }]);
    });

    document.getElementById('appointmentsBtn')?.addEventListener('click', function() {
      this.classList.add('active');
      document.getElementById('revenueBtn').classList.remove('active');
      ChartComponent.destroy('weeklyChart');
      ChartComponent.createBarChart('weeklyChart', days, [{ label: 'Appointments', data: apptData, backgroundColor: 'rgba(16,185,129,0.7)' }]);
    });

    // Department chart
    const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Oncology'];
    ChartComponent.createDoughnutChart('deptChart', depts, [25, 18, 22, 20, 30, 15], ['#4f46e5','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6']);

    // Admission chart
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    ChartComponent.createLineChart('admissionChart', months, [{ label: 'Admissions', data: [65, 72, 80, 68, 85, 78], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)' }]);

    // Bed occupancy chart
    const totalBeds = Store.get('beds').length;
    const occBeds = Store.get('beds').filter(b => b.status === 'occupied').length;
    const availBeds = Store.get('beds').filter(b => b.status === 'available').length;
    const maintBeds = Store.get('beds').filter(b => b.status === 'maintenance').length;
    ChartComponent.createDoughnutChart('bedChart', ['Occupied', 'Available', 'Maintenance'], [occBeds, availBeds, maintBeds], ['#ef4444', '#10b981', '#f59e0b']);
  },

  refresh() {
    const content = document.querySelector('.dashboard-content');
    if (content) {
      const parent = content.parentElement;
      const newContent = DashboardModule.render();
      content.outerHTML = newContent;
      DashboardModule.attachEvents();
    }
  }
};
