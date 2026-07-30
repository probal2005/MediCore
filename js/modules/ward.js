const WardModule = {
  _activeWardId: null,

  render() {
    const wards = Store.get('wards');
    const beds = Store.get('beds');
    if (!this._activeWardId && wards.length > 0) this._activeWardId = wards[0].id;

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Ward & Bed Management</h2><p class="section-subtitle">Manage ward occupancy and bed assignments</p></div>
          <div class="action-bar">
            <button class="btn btn-outline" onclick="WardModule._refreshData()"><i class="fas fa-sync"></i> Refresh</button>
          </div>
        </div>
        <div class="ward-overview" id="wardOverviewCards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:20px">
          ${wards.map(w => `
            <div class="card ward-overview-card ${this._activeWardId === w.id ? 'active' : ''}" data-ward-id="${w.id}" style="cursor:pointer;${this._activeWardId === w.id ? 'border-color:var(--primary)' : ''}" onclick="WardModule._selectWard('${w.id}')">
              <div class="card-body" style="padding:16px">
                <div style="font-weight:600;font-size:var(--font-size-md)">${w.name}</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-bottom:8px">Floor: ${w.floor}</div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px">
                  <div style="text-align:center"><div style="font-weight:700">${w.totalBeds}</div><div style="font-size:10px;color:var(--text-tertiary)">Total</div></div>
                  <div style="text-align:center"><div style="font-weight:700;color:var(--success)">${w.availableBeds}</div><div style="font-size:10px;color:var(--text-tertiary)">Free</div></div>
                  <div style="text-align:center"><div style="font-weight:700;color:var(--danger)">${w.occupiedBeds}</div><div style="font-size:10px;color:var(--text-tertiary)">Occ.</div></div>
                  <div style="text-align:center"><div style="font-weight:700;color:var(--warning)">${w.maintenanceBeds || 0}</div><div style="font-size:10px;color:var(--text-tertiary)">Maint.</div></div>
                </div>
                <div style="height:6px;border-radius:3px;background:var(--bg-hover);overflow:hidden;margin-bottom:4px">
                  <div style="height:100%;width:${(w.occupiedBeds / w.totalBeds) * 100}%;background:var(--danger);display:inline-block"></div>
                  <div style="height:100%;width:${(w.availableBeds / w.totalBeds) * 100}%;background:var(--success);display:inline-block"></div>
                </div>
                <div style="font-size:10px;color:var(--text-tertiary)">${Math.round((w.occupiedBeds / w.totalBeds) * 100)}% Occupied</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="font-weight:600;font-size:var(--font-size-lg)">${this._getActiveWardName(wards)} - Bed List</h3>
            <select class="form-select" style="width:auto" id="wardFilterSelect" onchange="WardModule._selectWard(this.value)">
              ${wards.map(w => `<option value="${w.id}" ${this._activeWardId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
            </select>
          </div>
          <div class="card-body" style="padding:0">
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Bed Number</th><th>Ward</th><th>Status</th><th>Patient Name</th><th>Actions</th></tr></thead>
                <tbody>
                  ${this._getActiveWardBeds(wards).map(bed => `
                    <tr>
                      <td><strong>${bed.number || bed.bedNumber}</strong></td>
                      <td>${this._getActiveWardName(wards)}</td>
                      <td><span class="badge ${bed.status === 'occupied' ? 'badge-danger' : bed.status === 'available' ? 'badge-success' : 'badge-warning'}">${bed.status}</span></td>
                      <td>${bed.patient ? bed.patient.name : (bed.patientName || '-')}</td>
                      <td>
                        ${bed.status === 'available' ? `<button class="btn btn-sm btn-primary" onclick="WardModule._assignBed('${bed.id}')">Assign</button>` : ''}
                        ${bed.status === 'occupied' ? `<button class="btn btn-sm btn-outline" onclick="WardModule._dischargePatient('${bed.id}')">Discharge</button>` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop" id="assignBedModal" style="display:none"></div>
    `;
  },

  _getActiveWardName(wards) {
    const w = wards.find(w => w.id === this._activeWardId);
    return w ? w.name : 'Select a ward';
  },

  _getActiveWardBeds(wards) {
    const w = wards.find(w => w.id === this._activeWardId);
    return w ? (w.beds || []) : [];
  },

  _selectWard(wardId) {
    this._activeWardId = wardId;
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = this.render();
      this.attachEvents();
    }
  },

  _assignBed(bedId) {
    const wardContent = `
      <div style="padding:20px">
        <h3 style="margin-bottom:16px">Assign Patient to Bed</h3>
        <form id="assignBedForm">
          <input type="hidden" name="bedId" value="${bedId}">
          <div class="form-group"><label class="form-label">Select Patient</label>
            <select class="form-input" id="assignPatientSelect" required>
              <option value="">-- Select Patient --</option>
              ${Store.get('patients').filter(p => p.status === 'active').map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Assign Bed</button>
            <button type="button" class="btn btn-outline" onclick="Modal.close()">Cancel</button>
          </div>
        </form>
      </div>
    `;
    Modal.open(wardContent);
    setTimeout(() => {
      document.getElementById('assignBedForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.close();
        NotificationCenter.success('Patient assigned to bed successfully');
        this._refreshData();
      });
    }, 50);
  },

  _dischargePatient(bedId) {
    if (!confirm('Are you sure you want to discharge this patient?')) return;
    NotificationCenter.success('Patient discharged from bed');
    this._refreshData();
  },

  _refreshData() {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = this.render();
      this.attachEvents();
    }
  },

  attachEvents() {
    document.getElementById('wardFilterSelect')?.addEventListener('change', (e) => {
      this._selectWard(e.target.value);
    });
  }
};
