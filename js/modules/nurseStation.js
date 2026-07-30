const NurseStationModule = {
  _activeTab: 'tasks',

  render() {
    const tasks = Store.get('nurseTasks');
    const shifts = Store.get('nurseShifts');
    const activeTasks = tasks.filter(t => t.status !== 'completed').length;
    const onDuty = shifts.filter(s => s.status === 'on_duty').length;

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Nurse Station</h2><p class="section-subtitle">Manage nurse tasks, shifts, and handoffs</p></div>
          <div class="action-bar">
            <span class="badge badge-info" style="font-size:var(--font-size-sm)">${activeTasks} Active Tasks</span>
            <span class="badge badge-primary" style="font-size:var(--font-size-sm)">${onDuty} On Duty</span>
          </div>
        </div>
        <div class="tab-nav mb-md" id="nsTabs">
          <button class="tab-btn ${this._activeTab === 'tasks' ? 'active' : ''}" data-tab="tasks"><i class="fas fa-list"></i> Tasks</button>
          <button class="tab-btn ${this._activeTab === 'shifts' ? 'active' : ''}" data-tab="shifts"><i class="fas fa-calendar-week"></i> Shifts</button>
        </div>
        <div id="nsTabContent">
          ${this._activeTab === 'tasks' ? this._renderTasksTab(tasks) : this._renderShiftsTab(shifts)}
        </div>
      </div>
    `;
  },

  _renderTasksTab(tasks) {
    const priorities = [...new Set(tasks.map(t => t.priority).filter(Boolean))];
    return `
      <div class="card">
        <div class="card-header" style="display:flex;gap:12px">
          <select class="form-select form-select-sm" id="taskPriorityFilter" style="width:auto">
            <option value="">All Priorities</option>
            ${priorities.map(p => `<option value="${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('')}
          </select>
          <select class="form-select form-select-sm" id="taskStatusFilter" style="width:auto">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Patient</th><th>Task</th><th>Priority</th><th>Assigned Nurse</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="nsTaskTableBody">
              ${tasks.map(t => `
                <tr>
                  <td><strong>${t.patientName || '-'}</strong></td>
                  <td>${t.task}</td>
                  <td><span class="badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-success'}">${t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Routine'}</span></td>
                  <td>${t.assignedTo}</td>
                  <td><span class="badge ${t.status === 'completed' ? 'badge-success' : t.status === 'in_progress' ? 'badge-info' : 'badge-secondary'}">${t.status ? t.status.replace('_', ' ') : 'pending'}</span></td>
                  <td>
                    ${t.status !== 'completed' ? `<button class="btn btn-sm btn-success" onclick="NurseStationModule._markTaskComplete('${t.id}')"><i class="fas fa-check"></i></button>` : ''}
                  </td>
                </tr>
              `).join('')}
              ${tasks.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-tertiary);padding:20px">No tasks found</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _renderShiftsTab(shifts) {
    return `
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Nurse Name</th><th>Department</th><th>Shift</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${shifts.map(s => `
                <tr>
                  <td><strong>${s.nurseName}</strong></td>
                  <td>${s.department}</td>
                  <td>${s.shift}</td>
                  <td>${Formatters.date(s.date)}</td>
                  <td><span class="badge ${s.status === 'on_duty' ? 'badge-success' : s.status === 'on_break' ? 'badge-warning' : 'badge-secondary'}">${s.status ? s.status.replace('_', ' ') : ''}</span></td>
                </tr>
              `).join('')}
              ${shifts.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:var(--text-tertiary);padding:20px">No shifts found</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _markTaskComplete(taskId) {
    if (!confirm('Mark this task as completed?')) return;
    NotificationCenter.success('Task marked as completed');
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = this.render();
      this.attachEvents();
    }
  },

  attachEvents() {
    document.getElementById('nsTabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-btn');
      if (tab) {
        this._activeTab = tab.dataset.tab;
        const content = document.getElementById('moduleContent');
        if (content) {
          content.innerHTML = this.render();
          this.attachEvents();
        }
      }
    });

    document.getElementById('taskPriorityFilter')?.addEventListener('change', () => this._filterTasks());
    document.getElementById('taskStatusFilter')?.addEventListener('change', () => this._filterTasks());
  },

  _filterTasks() {
    const priority = document.getElementById('taskPriorityFilter')?.value || '';
    const status = document.getElementById('taskStatusFilter')?.value || '';
    const tasks = Store.get('nurseTasks').filter(t => {
      if (priority && t.priority !== priority) return false;
      if (status && t.status !== status) return false;
      return true;
    });
    const tbody = document.getElementById('nsTaskTableBody');
    if (tbody) {
      tbody.innerHTML = tasks.map(t => `
        <tr>
          <td><strong>${t.patientName || '-'}</strong></td>
          <td>${t.task}</td>
          <td><span class="badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-success'}">${t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Routine'}</span></td>
          <td>${t.assignedTo}</td>
          <td><span class="badge ${t.status === 'completed' ? 'badge-success' : t.status === 'in_progress' ? 'badge-info' : 'badge-secondary'}">${t.status ? t.status.replace('_', ' ') : 'pending'}</span></td>
          <td>
            ${t.status !== 'completed' ? `<button class="btn btn-sm btn-success" onclick="NurseStationModule._markTaskComplete('${t.id}')"><i class="fas fa-check"></i></button>` : ''}
          </td>
        </tr>
      `).join('');
    }
  }
};
