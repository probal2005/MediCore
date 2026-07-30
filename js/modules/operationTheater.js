const OTModule = {
  render() {
    const theaters = Store.get('theaters');
    const schedule = Store.get('surgerySchedule');

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Operation Theater Management</h2><p class="section-subtitle">Manage OT rooms, surgeries, and schedules</p></div>
          <div class="action-bar">
            <span class="badge badge-info" style="font-size:var(--font-size-sm)">${theaters.length} Theaters</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:16px">
          ${theaters.map(t => {
            const statusColors = { in_use: 'var(--danger)', available: 'var(--success)', scheduled: 'var(--primary)' };
            const statusLabels = { in_use: 'In Use', available: 'Available', scheduled: 'Scheduled' };
            const theaterSchedule = schedule.filter(s => s.otId === t.id);
            return `
              <div class="card" style="border-top:4px solid ${statusColors[t.status] || 'var(--text-tertiary)'}">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
                  <strong style="font-size:var(--font-size-lg)">${t.name}</strong>
                  <span class="badge" style="background:${statusColors[t.status] || 'var(--text-tertiary)'};color:#fff">${statusLabels[t.status] || t.status}</span>
                </div>
                <div class="card-body">
                  <div style="font-size:var(--font-size-sm);color:var(--text-tertiary);margin-bottom:4px"><strong>Type:</strong> ${t.type}</div>
                  ${t.currentSurgery ? `<div style="font-size:var(--font-size-sm);margin-bottom:4px"><strong>Current:</strong> ${t.currentSurgery}</div>` : ''}
                  ${t.patientName ? `<div style="font-size:var(--font-size-sm);margin-bottom:4px"><strong>Patient:</strong> ${t.patientName}</div>` : ''}
                  ${t.surgeon ? `<div style="font-size:var(--font-size-sm);margin-bottom:4px"><strong>Surgeon:</strong> ${t.surgeon}</div>` : ''}
                  ${t.startTime ? `<div style="font-size:var(--font-size-sm);margin-bottom:4px"><strong>Started:</strong> ${Formatters.time(t.startTime)}</div>` : ''}
                  ${t.estimatedEnd ? `<div style="font-size:var(--font-size-sm);margin-bottom:8px"><strong>Est. End:</strong> ${Formatters.time(t.estimatedEnd)}</div>` : ''}
                  ${theaterSchedule.length > 0 ? `
                    <div style="margin-top:12px">
                      <div style="font-weight:600;font-size:var(--font-size-sm);margin-bottom:8px">Schedule Timeline</div>
                      ${theaterSchedule.slice(0, 5).map(s => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-radius:var(--radius-sm);background:var(--bg-hover);margin-bottom:4px;font-size:var(--font-size-xs)">
                          <span style="font-weight:500">${s.startTime}</span>
                          <span>${s.patientName} - ${s.procedure}</span>
                          <span class="badge ${s.status === 'completed' ? 'badge-success' : s.status === 'in_progress' ? 'badge-info' : 'badge-warning'}">${s.status.replace('_', ' ')}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : '<div style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-top:8px">No scheduled surgeries</div>'}
                </div>
                <div class="card-footer" style="display:flex;gap:8px">
                  <button class="btn btn-sm btn-outline" onclick="OTModule._viewDetails('${t.id}')"><i class="fas fa-eye"></i> Details</button>
                  <button class="btn btn-sm btn-primary" onclick="OTModule._scheduleSurgery('${t.id}')"><i class="fas fa-plus"></i> Schedule</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  _viewDetails(theaterId) {
    const theaters = Store.get('theaters');
    const schedule = Store.get('surgerySchedule');
    const t = theaters.find(th => th.id === theaterId);
    if (!t) return;
    const theaterSchedule = schedule.filter(s => s.otId === theaterId);

    Modal.open(`
      <div style="padding:20px">
        <h3 style="margin-bottom:16px">${t.name} - Details</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          <div><strong>Type:</strong> ${t.type}</div>
          <div><strong>Status:</strong> ${t.status}</div>
          <div><strong>Current Surgery:</strong> ${t.currentSurgery || 'None'}</div>
          <div><strong>Surgeon:</strong> ${t.surgeon || 'N/A'}</div>
        </div>
        <h4 style="font-weight:600;margin-bottom:8px">Full Schedule</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Time</th><th>Patient</th><th>Procedure</th><th>Surgeon</th><th>Status</th></tr></thead>
            <tbody>
              ${theaterSchedule.map(s => `
                <tr>
                  <td>${s.startTime}</td>
                  <td>${s.patientName}</td>
                  <td>${s.procedure}</td>
                  <td>${s.surgeon}</td>
                  <td><span class="badge ${s.status === 'completed' ? 'badge-success' : s.status === 'in_progress' ? 'badge-info' : 'badge-warning'}">${s.status.replace('_', ' ')}</span></td>
                </tr>
              `).join('')}
              ${theaterSchedule.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:var(--text-tertiary)">No surgeries scheduled</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `);
  },

  _scheduleSurgery(theaterId) {
    Modal.open(`
      <div style="padding:20px">
        <h3 style="margin-bottom:16px">Schedule New Surgery</h3>
        <form id="scheduleSurgeryForm">
          <input type="hidden" name="theaterId" value="${theaterId}">
          <div class="form-group"><label class="form-label">Patient Name</label><input type="text" class="form-input" name="patientName" required></div>
          <div class="form-group"><label class="form-label">Surgeon</label><input type="text" class="form-input" name="surgeon" required></div>
          <div class="form-group"><label class="form-label">Procedure</label><input type="text" class="form-input" name="procedure" required></div>
          <div class="form-group"><label class="form-label">Scheduled Date/Time</label><input type="datetime-local" class="form-input" name="scheduledTime" required></div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Schedule</button>
            <button type="button" class="btn btn-outline" onclick="Modal.close()">Cancel</button>
          </div>
        </form>
      </div>
    `);
    setTimeout(() => {
      document.getElementById('scheduleSurgeryForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.close();
        NotificationCenter.success('Surgery scheduled successfully');
      });
    }, 50);
  },

  attachEvents() {}
};
