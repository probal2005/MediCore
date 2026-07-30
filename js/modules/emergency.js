const EmergencyModule = {
  _activeTab: 'triage',

  render() {
    const cases = Store.get('emergencyCases');
    const stats = this._computeStats(cases);

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Emergency Department</h2><p class="section-subtitle">Triage queue and patient management</p></div>
          <div class="action-bar">
            <span class="badge badge-danger" style="font-size:var(--font-size-sm)">${stats.criticalCount} Critical</span>
            <span class="badge badge-warning" style="font-size:var(--font-size-sm)">${stats.moderateCount} Moderate</span>
            <span class="badge badge-success" style="font-size:var(--font-size-sm)">${stats.minorCount} Minor</span>
            <span class="badge badge-info" style="font-size:var(--font-size-sm)">${stats.totalCases} Total</span>
          </div>
        </div>

        <div class="stats-grid" style="margin-bottom:20px">
          <div class="stat-card" style="border-left:4px solid var(--danger);padding:16px">
            <div class="stat-card-value" style="color:var(--danger)">${stats.criticalCount}</div>
            <div class="stat-card-label">Critical Cases</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--warning);padding:16px">
            <div class="stat-card-value" style="color:var(--warning)">${stats.moderateCount}</div>
            <div class="stat-card-label">Moderate Cases</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--success);padding:16px">
            <div class="stat-card-value" style="color:var(--success)">${stats.minorCount}</div>
            <div class="stat-card-label">Minor Cases</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--primary);padding:16px">
            <div class="stat-card-value">${stats.totalCases}</div>
            <div class="stat-card-label">Total Cases</div>
          </div>
        </div>

        <div class="triage-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          ${['critical', 'moderate', 'minor'].map(priority => {
            const labels = { critical: 'Critical', moderate: 'Moderate', minor: 'Minor' };
            const colors = { critical: 'var(--danger)', moderate: 'var(--warning)', minor: 'var(--success)' };
            const columnCases = cases.filter(c => (c.triage || c.priority) === priority);
            return `
              <div class="card">
                <div class="card-header" style="border-bottom:3px solid ${colors[priority]};display:flex;justify-content:space-between;align-items:center">
                  <strong style="color:${colors[priority]}">${labels[priority]}</strong>
                  <span class="badge" style="background:${colors[priority]};color:#fff">${columnCases.length}</span>
                </div>
                <div class="card-body" style="padding:12px;max-height:500px;overflow-y:auto">
                  ${columnCases.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--text-tertiary)">No cases</div>' : columnCases.map(c => `
                    <div class="emergency-case-card" style="padding:12px;margin-bottom:8px;border-radius:var(--radius-md);background:var(--bg-hover);border-left:3px solid ${colors[priority]}">
                      <div style="display:flex;justify-content:space-between;font-size:var(--font-size-xs);margin-bottom:4px">
                        <span style="font-family:monospace;color:var(--text-tertiary)">${c.id}</span>
                        <span style="color:var(--text-tertiary)">${Formatters.time(c.arrivalTime)}</span>
                      </div>
                      <div style="font-weight:600;font-size:var(--font-size-md)">${c.patientName}</div>
                      <div style="font-size:var(--font-size-sm);color:var(--text-tertiary);margin:4px 0">${c.complaint}</div>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">
                        ${c.vitals ? `
                          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-card)">BP ${c.vitals.bp}</span>
                          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-card)">HR ${c.vitals.hr}</span>
                          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-card)">RR ${c.vitals.rr}</span>
                          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-card)">Temp ${c.vitals.temp}</span>
                          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-card)">O2 ${c.vitals.o2}%</span>
                        ` : ''}
                      </div>
                      <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${c.doctorName || ''} ${c.status ? `| ${c.status.replace('_', ' ')}` : ''}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  _computeStats(cases) {
    const counts = { critical: 0, moderate: 0, minor: 0 };
    cases.forEach(c => {
      const key = c.triage || c.priority;
      if (counts[key] !== undefined) counts[key]++;
    });
    return {
      totalCases: cases.length,
      criticalCount: counts.critical,
      moderateCount: counts.moderate,
      minorCount: counts.minor
    };
  },

  attachEvents() {}
};
