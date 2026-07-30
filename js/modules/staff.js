const StaffModule = {
  render() {
    const staff = Store.get('staff');
    const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Staff Directory</h2><p class="section-subtitle">Manage hospital staff and employees</p></div>
          <div class="action-bar">
            <span class="badge badge-info" style="font-size:var(--font-size-sm)">${staff.length} Total Staff</span>
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;gap:12px;flex-wrap:wrap">
            <select class="form-select form-select-sm" id="staffDeptFilter" style="width:auto">
              <option value="">All Departments</option>
              ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
            <div class="input-group" style="min-width:200px">
              <span class="input-group-prepend"><i class="fas fa-search"></i></span>
              <input type="text" class="form-input" id="staffSearch" placeholder="Search by name, email, role...">
            </div>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Department</th><th>Role</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
              <tbody id="staffTableBody">
                ${staff.map(s => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(s.name)};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:var(--font-size-xs)">${Helpers.getInitials(s.name)}</div>
                        <strong>${s.name}</strong>
                      </div>
                    </td>
                    <td>${s.department}</td>
                    <td>${s.role}</td>
                    <td><a href="mailto:${s.email}" style="text-decoration:none;color:var(--primary)">${s.email}</a></td>
                    <td>${s.phone}</td>
                    <td><span class="badge ${s.status === 'active' ? 'badge-success' : s.status === 'inactive' ? 'badge-danger' : 'badge-secondary'}">${s.status ? s.status.replace('_', ' ') : 'Unknown'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="data-table-footer">
            <div class="data-table-info">${staff.length} employees</div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('staffDeptFilter')?.addEventListener('change', () => this._filterStaff());
    document.getElementById('staffSearch')?.addEventListener('input', Helpers.debounce(() => this._filterStaff(), 200));
  },

  _filterStaff() {
    const dept = document.getElementById('staffDeptFilter')?.value || '';
    const search = (document.getElementById('staffSearch')?.value || '').toLowerCase();
    const staff = Store.get('staff').filter(s => {
      if (dept && s.department !== dept) return false;
      if (search && !s.name.toLowerCase().includes(search) && !s.email.toLowerCase().includes(search) && !s.role.toLowerCase().includes(search)) return false;
      return true;
    });
    const tbody = document.getElementById('staffTableBody');
    if (tbody) {
      tbody.innerHTML = staff.map(s => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(s.name)};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:var(--font-size-xs)">${Helpers.getInitials(s.name)}</div>
              <strong>${s.name}</strong>
            </div>
          </td>
          <td>${s.department}</td>
          <td>${s.role}</td>
          <td><a href="mailto:${s.email}" style="text-decoration:none;color:var(--primary)">${s.email}</a></td>
          <td>${s.phone}</td>
          <td><span class="badge ${s.status === 'active' ? 'badge-success' : s.status === 'inactive' ? 'badge-danger' : 'badge-secondary'}">${s.status ? s.status.replace('_', ' ') : 'Unknown'}</span></td>
        </tr>
      `).join('');
    }
  }
};
