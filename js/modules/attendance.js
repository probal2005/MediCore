const AttendanceModule = {
  _filterStatus: '',
  _filterSearch: '',

  render() {
    const attendance = Store.get('attendance');
    const staff = Store.get('staff');

    const todayRecords = attendance.filter(r => {
      const dateStr = typeof r.date === 'string' ? r.date : '';
      return dateStr === (attendance.length > 0 ? attendance[0].date : '');
    });
    const present = todayRecords.filter(r => r.status === 'present').length;
    const absent = todayRecords.filter(r => r.status === 'absent').length;
    const late = todayRecords.filter(r => r.status === 'late').length;
    const leave = todayRecords.filter(r => r.status === 'leave').length;

    const resolveName = (record) => {
      if (record.staffName) return record.staffName;
      const s = staff.find(st => st.id === record.staffId);
      return s ? s.name : record.staffId || 'Unknown';
    };

    const filtered = attendance.filter(r => {
      if (this._filterStatus && r.status !== this._filterStatus) return false;
      if (this._filterSearch) {
        const q = this._filterSearch.toLowerCase();
        const name = resolveName(r).toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Attendance</h2><p class="section-subtitle">Track staff attendance, late arrivals, and absences</p></div>
        </div>
        <div class="stats-grid" style="margin-bottom:20px">
          <div class="stat-card" style="border-left:4px solid var(--success);padding:16px">
            <div class="stat-card-value" style="color:var(--success)">${present}</div>
            <div class="stat-card-label">Present Today</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--danger);padding:16px">
            <div class="stat-card-value" style="color:var(--danger)">${absent}</div>
            <div class="stat-card-label">Absent</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--warning);padding:16px">
            <div class="stat-card-value" style="color:var(--warning)">${late}</div>
            <div class="stat-card-label">Late</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--info);padding:16px">
            <div class="stat-card-value" style="color:var(--info)">${leave}</div>
            <div class="stat-card-label">On Leave</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;gap:12px">
            <div class="input-group" style="min-width:200px">
              <span class="input-group-prepend"><i class="fas fa-search"></i></span>
              <input type="text" class="form-input" id="attendanceSearch" placeholder="Search by name..." value="${this._filterSearch}">
            </div>
            <select class="form-select form-select-sm" id="attendanceStatusFilter" style="width:auto">
              <option value="">All Status</option>
              <option value="present" ${this._filterStatus === 'present' ? 'selected' : ''}>Present</option>
              <option value="late" ${this._filterStatus === 'late' ? 'selected' : ''}>Late</option>
              <option value="absent" ${this._filterStatus === 'absent' ? 'selected' : ''}>Absent</option>
              <option value="leave" ${this._filterStatus === 'leave' ? 'selected' : ''}>On Leave</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Date</th><th>Staff Name</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Hours</th></tr></thead>
              <tbody id="attendanceTableBody">
                ${filtered.map(r => {
                  const name = resolveName(r);
                  return `
                    <tr>
                      <td>${r.date}</td>
                      <td><strong>${name}</strong></td>
                      <td>${r.checkIn || '--:--'}</td>
                      <td>${r.checkOut || '--:--'}</td>
                      <td><span class="badge ${r.status === 'present' ? 'badge-success' : r.status === 'late' ? 'badge-warning' : r.status === 'absent' ? 'badge-danger' : 'badge-info'}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
                      <td>${r.hours > 0 ? r.hours + 'h' : '--'}</td>
                    </tr>
                  `;
                }).join('')}
                ${filtered.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-tertiary);padding:20px">No attendance records found</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('attendanceSearch')?.addEventListener('input', Helpers.debounce(() => {
      this._filterSearch = document.getElementById('attendanceSearch').value;
      this._refresh();
    }, 200));
    document.getElementById('attendanceStatusFilter')?.addEventListener('change', (e) => {
      this._filterStatus = e.target.value;
      this._refresh();
    });
  },

  _refresh() {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = this.render();
      this.attachEvents();
    }
  }
};
