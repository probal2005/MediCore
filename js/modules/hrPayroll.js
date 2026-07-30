const HRPayrollModule = {
  _departmentFilter: '',

  render() {
    const staff = Store.get('staff');
    const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];
    const filtered = this._departmentFilter ? staff.filter(s => s.department === this._departmentFilter) : staff;
    const totalPayroll = filtered.reduce((sum, s) => sum + (parseFloat(s.salary) || 0), 0);
    const avgSalary = filtered.length > 0 ? totalPayroll / filtered.length : 0;
    const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">HR & Payroll</h2><p class="section-subtitle">Staff payroll and salary management</p></div>
          <div class="action-bar">
            <span class="badge badge-info" style="font-size:var(--font-size-sm)">${staff.length} Records</span>
          </div>
        </div>
        <div class="stats-grid" style="margin-bottom:20px">
          <div class="stat-card" style="border-left:4px solid var(--primary);padding:16px">
            <div class="stat-card-value" style="color:var(--primary);font-size:var(--font-size-xl)">${formatCurrency(totalPayroll)}</div>
            <div class="stat-card-label">Total Payroll</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--success);padding:16px">
            <div class="stat-card-value" style="color:var(--success);font-size:var(--font-size-xl)">${formatCurrency(avgSalary)}</div>
            <div class="stat-card-label">Average Salary</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--info);padding:16px">
            <div class="stat-card-value" style="color:var(--info);font-size:var(--font-size-xl)">${departments.length}</div>
            <div class="stat-card-label">Departments</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="font-weight:600;font-size:var(--font-size-lg)">Payroll Summary</h3>
            <select class="form-select form-select-sm" id="payrollDeptFilter" style="width:auto">
              <option value="">All Departments</option>
              ${departments.map(d => `<option value="${d}" ${this._departmentFilter === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Department</th><th>Role</th><th>Salary</th><th>Status</th></tr></thead>
              <tbody id="payrollTableBody">
                ${filtered.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.department}</td>
                    <td>${s.role}</td>
                    <td style="font-family:monospace">${formatCurrency(s.salary)}</td>
                    <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-secondary'}">${s.status}</span></td>
                  </tr>
                `).join('')}
                ${filtered.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:var(--text-tertiary);padding:20px">No records found</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('payrollDeptFilter')?.addEventListener('change', (e) => {
      this._departmentFilter = e.target.value;
      const content = document.getElementById('moduleContent');
      if (content) {
        content.innerHTML = this.render();
        this.attachEvents();
      }
    });
  }
};
