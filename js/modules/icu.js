const ICUModule = {
  _activeTab: 'beds',

  render() {
    const icuBeds = Store.get('icuBeds');
    const equipment = Store.get('icuEquipment');
    const occupied = icuBeds.filter(b => b.status === 'occupied').length;
    const available = icuBeds.filter(b => b.status === 'available').length;

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Intensive Care Unit</h2><p class="section-subtitle">Monitor ICU beds, vitals, and equipment</p></div>
          <div class="action-bar">
            <span class="stat-pill" style="background:var(--danger-bg);color:var(--danger);padding:4px 12px;border-radius:999px;font-size:var(--font-size-sm)">${occupied} Occupied</span>
            <span class="stat-pill" style="background:var(--success-bg);color:var(--success);padding:4px 12px;border-radius:999px;font-size:var(--font-size-sm)">${available} Available</span>
            <span class="stat-pill" style="background:var(--primary-bg);color:var(--primary);padding:4px 12px;border-radius:999px;font-size:var(--font-size-sm)">${icuBeds.length} Total Beds</span>
          </div>
        </div>
        <div class="tab-nav mb-md" id="icuTabs">
          <button class="tab-btn ${this._activeTab === 'beds' ? 'active' : ''}" data-tab="beds"><i class="fas fa-bed"></i> ICU Beds</button>
          <button class="tab-btn ${this._activeTab === 'equipment' ? 'active' : ''}" data-tab="equipment"><i class="fas fa-tools"></i> Equipment</button>
        </div>
        <div id="icuTabContent">
          ${this._activeTab === 'beds' ? this._renderBedsView(icuBeds) : this._renderEquipmentView(equipment)}
        </div>
      </div>
    `;
  },

  _renderBedsView(icuBeds) {
    return `
      <div class="icu-bed-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        ${icuBeds.map(bed => this._renderBedCard(bed)).join('')}
      </div>
    `;
  },

  _renderBedCard(bed) {
    if (bed.status === 'available') {
      return `
        <div class="card" style="border-left:4px solid var(--success)">
          <div class="card-body" style="text-align:center;padding:24px">
            <div style="font-size:var(--font-size-xl);font-weight:700;margin-bottom:4px">${bed.bedNumber}</div>
            <span class="badge badge-success">Available</span>
            <div style="margin-top:16px;color:var(--text-tertiary);font-size:var(--font-size-sm)">Bed is ready for admission</div>
            <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="ICUModule._admitPatient('${bed.id}')">Admit Patient</button>
          </div>
        </div>
      `;
    }

    const v = bed.vitals;
    const isAbnormalBP = (bp) => { const p = bp.split('/'); return parseInt(p[0]) < 90 || parseInt(p[0]) > 160 || parseInt(p[1]) < 60 || parseInt(p[1]) > 100; };
    const isAbnormalHR = (hr) => hr < 60 || hr > 100;
    const isAbnormalRR = (rr) => rr < 12 || rr > 24;
    const isAbnormalTemp = (t) => t < 36 || t > 38;
    const isAbnormalO2 = (o2) => o2 < 92;

    const doctors = Store.get('doctors');
    const doc = doctors.find(d => d.id === bed.doctorId);

    return `
      <div class="card" style="border-left:4px solid ${bed.condition === 'Critical' ? 'var(--danger)' : 'var(--warning)'}">
        <div class="card-body" style="padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div>
              <span style="font-weight:700;font-size:var(--font-size-lg)">${bed.bedNumber}</span>
              <span class="badge ${bed.status === 'occupied' ? 'badge-danger' : 'badge-success'}" style="margin-left:8px">${bed.status}</span>
            </div>
            <span style="font-family:monospace;font-size:var(--font-size-xs);color:var(--text-tertiary)">${bed.patientId || ''}</span>
          </div>
          <div style="margin-bottom:12px">
            <div style="font-weight:600;font-size:var(--font-size-md)">${bed.patientName}</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">Condition: <span style="color:${bed.condition === 'Critical' ? 'var(--danger)' : 'var(--success)'}">${bed.condition}</span></div>
            <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">Admitted: ${Formatters.date(bed.admittedDate)}</div>
          </div>
          ${v ? `
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px">
            <div style="text-align:center;padding:8px 4px;border-radius:var(--radius-md);background:${isAbnormalBP(v.bp) ? 'var(--danger-bg)' : 'var(--bg-hover)'}">
              <div style="font-size:10px;color:var(--text-tertiary)">BP</div>
              <div style="font-weight:600;font-size:var(--font-size-sm);color:${isAbnormalBP(v.bp) ? 'var(--danger)' : 'inherit'}">${v.bp}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;border-radius:var(--radius-md);background:${isAbnormalHR(v.hr) ? 'var(--danger-bg)' : 'var(--bg-hover)'}">
              <div style="font-size:10px;color:var(--text-tertiary)">HR</div>
              <div style="font-weight:600;font-size:var(--font-size-sm);color:${isAbnormalHR(v.hr) ? 'var(--danger)' : 'inherit'}">${v.hr}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;border-radius:var(--radius-md);background:${isAbnormalRR(v.rr) ? 'var(--danger-bg)' : 'var(--bg-hover)'}">
              <div style="font-size:10px;color:var(--text-tertiary)">RR</div>
              <div style="font-weight:600;font-size:var(--font-size-sm);color:${isAbnormalRR(v.rr) ? 'var(--danger)' : 'inherit'}">${v.rr}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;border-radius:var(--radius-md);background:${isAbnormalTemp(v.temp) ? 'var(--danger-bg)' : 'var(--bg-hover)'}">
              <div style="font-size:10px;color:var(--text-tertiary)">Temp</div>
              <div style="font-weight:600;font-size:var(--font-size-sm);color:${isAbnormalTemp(v.temp) ? 'var(--danger)' : 'inherit'}">${v.temp}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;border-radius:var(--radius-md);background:${isAbnormalO2(v.o2) ? 'var(--danger-bg)' : 'var(--bg-hover)'}">
              <div style="font-size:10px;color:var(--text-tertiary)">O2</div>
              <div style="font-weight:600;font-size:var(--font-size-sm);color:${isAbnormalO2(v.o2) ? 'var(--danger)' : 'inherit'}">${v.o2}%</div>
            </div>
          </div>
          ` : ''}
          <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:8px">
            <span><strong>Nurse:</strong> ${bed.assignedNurse || 'Unassigned'}</span>
            <span><strong>Doctor:</strong> ${doc ? doc.name : 'Unassigned'}</span>
          </div>
          ${bed.ventilator ? `
          <div style="padding:8px 12px;border-radius:var(--radius-md);background:${bed.ventilator ? 'var(--info-bg)' : 'var(--bg-hover)'};font-size:var(--font-size-sm);margin-bottom:8px">
            <strong>Ventilator:</strong> ${bed.ventilator ? 'Active' : 'Inactive'}
          </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  _renderEquipmentView(equipment) {
    const totalInUse = equipment.reduce((s, e) => s + e.inUse, 0);
    const totalAvailable = equipment.reduce((s, e) => s + e.available, 0);
    const totalMaintenance = equipment.reduce((s, e) => s + (e.total - e.inUse - e.available), 0);

    return `
      <div class="card">
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
            <div class="stat-card" style="border-left:4px solid var(--primary);padding:16px">
              <div style="font-size:var(--font-size-2xl);font-weight:700;color:var(--primary)">${totalInUse}</div>
              <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">In Use</div>
            </div>
            <div class="stat-card" style="border-left:4px solid var(--success);padding:16px">
              <div style="font-size:var(--font-size-2xl);font-weight:700;color:var(--success)">${totalAvailable}</div>
              <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">Available</div>
            </div>
            <div class="stat-card" style="border-left:4px solid var(--warning);padding:16px">
              <div style="font-size:var(--font-size-2xl);font-weight:700;color:var(--warning)">${totalMaintenance}</div>
              <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">Maintenance</div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Equipment</th><th>Total</th><th>In Use</th><th>Available</th><th>Status</th></tr></thead>
              <tbody>
                ${equipment.map(eq => `
                  <tr>
                    <td><strong>${eq.name}</strong></td>
                    <td>${eq.total}</td>
                    <td>${eq.inUse}</td>
                    <td>${eq.available}</td>
                    <td><span class="badge ${eq.status === 'operational' ? 'badge-success' : 'badge-warning'}">${eq.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  _admitPatient(bedId) {
    Modal.open(`
      <h3>Admit Patient to ICU</h3>
      <p style="color:var(--text-tertiary);margin-bottom:16px">Bed: ${bedId}</p>
      <form id="icuAdmitForm">
        <div class="form-group"><label class="form-label">Patient Name</label><input type="text" class="form-input" id="icuPatientName" required></div>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Admit</button></div>
      </form>
    `);
    setTimeout(() => {
      document.getElementById('icuAdmitForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.close();
        NotificationCenter.success('Patient admitted to ICU');
      });
    }, 50);
  },

  attachEvents() {
    document.getElementById('icuTabs')?.addEventListener('click', (e) => {
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
  }
};
