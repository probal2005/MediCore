const BloodBankModule = {
  render() {
    const inventory = Store.get('bloodInventory');
    const donors = Store.get('bloodDonors');
    const requests = Store.get('bloodRequests');

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Blood Bank</h2><p class="section-subtitle">Manage blood inventory, donors, and requests</p></div>
          <div class="action-bar">
            <button class="btn btn-primary" onclick="BloodBankModule.showAddUnitModal()"><i class="fas fa-plus"></i> Add Blood Unit</button>
            <button class="btn btn-secondary" onclick="BloodBankModule.showRegisterDonorModal()"><i class="fas fa-user-plus"></i> Register Donor</button>
            <button class="btn btn-info" onclick="BloodBankModule.showNewRequestModal()"><i class="fas fa-tint"></i> Blood Request</button>
          </div>
        </div>

        <div class="tab-nav mb-md" id="bbTabs">
          <button class="tab-btn active" data-tab="inventory"><i class="fas fa-warehouse"></i> Inventory</button>
          <button class="tab-btn" data-tab="donors"><i class="fas fa-users"></i> Donors (${donors.length})</button>
          <button class="tab-btn" data-tab="requests"><i class="fas fa-clipboard-list"></i> Requests (${requests.length})</button>
        </div>

        <div id="bbTabContent">
          ${this._renderInventoryTab(inventory)}
        </div>
      </div>
    `;
  },

  _renderInventoryTab(inventory) {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return `
      <div class="card">
        <div class="card-header">
          <h3 style="font-weight:600;font-size:var(--font-size-lg)">Blood Inventory</h3>
          <div class="flex gap-sm">
            <span class="badge badge-success" style="font-size:var(--font-size-xs)"><i class="fas fa-check-circle"></i> Available</span>
            <span class="badge badge-warning" style="font-size:var(--font-size-xs)"><i class="fas fa-exclamation-triangle"></i> Low</span>
            <span class="badge badge-danger" style="font-size:var(--font-size-xs)"><i class="fas fa-times-circle"></i> Critical</span>
          </div>
        </div>
        <div class="card-body">
          <div class="blood-group-grid">
            ${bloodGroups.map(bg => {
              const item = inventory.find(i => i.bloodGroup === bg);
              const units = item ? item.units : 0;
              const status = item ? item.status : 'none';
              const location = item ? item.location : 'N/A';
              const expiry = item ? item.expiryDate : null;
              const statusColor = status === 'available' ? 'success' : status === 'low' ? 'warning' : status === 'critical' ? 'danger' : 'secondary';
              return `
                <div class="blood-group-card ${status !== 'none' ? 'has-stock' : ''}" data-bg="${bg}" onclick="BloodBankModule.showInventoryDetail('${bg}')">
                  <div class="blood-group-type">${bg}</div>
                  <div class="blood-group-units">${units} <span style="font-size:var(--font-size-xs);font-weight:400;color:var(--text-tertiary)">units</span></div>
                  <div class="blood-group-status">
                    <span class="badge badge-${statusColor}" style="text-transform:uppercase">${status === 'none' ? 'No Stock' : status}</span>
                  </div>
                  <div class="blood-group-location" style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-top:4px">${location}</div>
                  ${expiry ? `<div class="blood-group-expiry" style="font-size:10px;color:var(--text-muted);margin-top:2px">Exp: ${Formatters.date(expiry)}</div>` : ''}
                  <div class="blood-group-bar">
                    <div class="blood-group-bar-fill status-${statusColor}" style="width:${Math.min(100, (units / 60) * 100)}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="card-footer" style="justify-content:space-between">
          <div class="data-table-info">${inventory.reduce((s, i) => s + i.units, 0)} total units in stock</div>
          <button class="btn btn-sm btn-ghost" onclick="BloodBankModule.showAddUnitModal()"><i class="fas fa-plus"></i> Add Units</button>
        </div>
      </div>
    `;
  },

  _renderDonorsTab(donors) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 style="font-weight:600;font-size:var(--font-size-lg)">Donor Registry</h3>
          <div class="input-group" style="min-width:200px">
            <span class="input-group-prepend"><i class="fas fa-search"></i></span>
            <input type="text" class="form-input" id="donorSearch" placeholder="Search donors...">
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Donor</th><th>Blood Group</th><th>Phone</th><th>Last Donation</th><th>Total Donations</th><th>Status</th><th>Next Eligible</th><th>Actions</th></tr></thead>
            <tbody id="donorTableBody">
              ${donors.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:40px;color:var(--text-tertiary)">No donors registered</td></tr>' : donors.map(d => `
                <tr>
                  <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(d.name)};width:28px;height:28px;font-size:10px">${Helpers.getInitials(d.name)}</div><span class="font-medium">${d.name}</span></div></td>
                  <td><span class="badge badge-danger">${d.bloodGroup}</span></td>
                  <td>${d.phone}</td>
                  <td>${Formatters.date(d.lastDonation)}</td>
                  <td><span class="font-medium">${d.totalDonations}</span></td>
                  <td><span class="badge badge-${d.status === 'eligible' ? 'success' : 'warning'}">${Formatters.status(d.status)}</span></td>
                  <td style="font-size:var(--font-size-xs)">${Formatters.date(d.nextEligible)}</td>
                  <td class="actions">
                    <button class="btn btn-sm btn-ghost" onclick="BloodBankModule.viewDonor('${d.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="BloodBankModule.recordDonation('${d.id}')" title="Record Donation"><i class="fas fa-syringe"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="data-table-footer"><div class="data-table-info">${donors.length} donors registered</div></div>
      </div>
    `;
  },

  _renderRequestsTab(requests) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 style="font-weight:600;font-size:var(--font-size-lg)">Blood Requests</h3>
          <button class="btn btn-sm btn-primary" onclick="BloodBankModule.showNewRequestModal()"><i class="fas fa-plus"></i> New Request</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Request ID</th><th>Patient</th><th>Blood Group</th><th>Units</th><th>Urgency</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${requests.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:40px;color:var(--text-tertiary)">No blood requests</td></tr>' : requests.map(r => {
                const urgencyColor = r.urgency === 'critical' ? 'danger' : r.urgency === 'urgent' ? 'warning' : 'info';
                return `
                  <tr>
                    <td style="font-family:monospace;font-size:var(--font-size-xs)">${r.id}</td>
                    <td>${r.patientName}</td>
                    <td><span class="badge badge-danger">${r.bloodGroup}</span></td>
                    <td class="font-medium">${r.units}</td>
                    <td><span class="badge badge-${urgencyColor}">${Formatters.status(r.urgency)}</span></td>
                    <td>${Formatters.date(r.date)}</td>
                    <td><span class="badge badge-${r.status === 'fulfilled' ? 'success' : r.status === 'cancelled' ? 'danger' : 'warning'}">${Formatters.status(r.status)}</span></td>
                    <td class="actions">
                      ${r.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="BloodBankModule.fulfillRequest('${r.id}')"><i class="fas fa-check"></i> Fulfill</button>` : ''}
                      ${r.status === 'pending' ? `<button class="btn btn-sm btn-danger" onclick="BloodBankModule.cancelRequest('${r.id}')"><i class="fas fa-times"></i></button>` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="data-table-footer"><div class="data-table-info">${requests.filter(r => r.status === 'pending').length} pending, ${requests.filter(r => r.status === 'fulfilled').length} fulfilled</div></div>
      </div>
    `;
  },

  attachEvents() {
    document.querySelectorAll('#bbTabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#bbTabs .tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tab = this.dataset.tab;
        const content = document.getElementById('bbTabContent');
        if (tab === 'inventory') content.innerHTML = BloodBankModule._renderInventoryTab(Store.get('bloodInventory'));
        else if (tab === 'donors') { content.innerHTML = BloodBankModule._renderDonorsTab(Store.get('bloodDonors')); BloodBankModule.attachDonorEvents(); }
        else if (tab === 'requests') content.innerHTML = BloodBankModule._renderRequestsTab(Store.get('bloodRequests'));
      });
    });
  },

  attachDonorEvents() {
    document.getElementById('donorSearch')?.addEventListener('input', Helpers.debounce(() => this._filterDonors(), 200));
  },

  _filterDonors() {
    const search = (document.getElementById('donorSearch')?.value || '').toLowerCase();
    document.querySelectorAll('#donorTableBody tr').forEach(row => {
      const name = row.querySelector('td:first-child')?.textContent?.toLowerCase() || '';
      const bg = row.querySelector('.badge-danger')?.textContent?.toLowerCase() || '';
      row.style.display = name.includes(search) || bg.includes(search) ? '' : 'none';
    });
  },

  showInventoryDetail(bloodGroup) {
    const item = Store.get('bloodInventory').find(i => i.bloodGroup === bloodGroup);
    if (!item) {
      Modal.open(`
        <div class="empty-state" style="padding:40px"><i class="fas fa-tint empty-state-icon" style="color:var(--text-tertiary)"></i>
        <div class="empty-state-title">No Stock</div>
        <div class="empty-state-text">No ${bloodGroup} units currently in inventory</div>
        <button class="btn btn-primary mt-md" onclick="Modal.close();BloodBankModule.showAddUnitModal()"><i class="fas fa-plus"></i> Add ${bloodGroup} Units</button></div>
      `, { title: bloodGroup + ' - Blood Group Detail', size: 'sm' });
      return;
    }
    const eligibleDonors = Store.get('bloodDonors').filter(d => d.bloodGroup === bloodGroup && d.status === 'eligible');
    Modal.open(`
      <div class="blood-detail">
        <div class="profile-card">
          <div class="profile-avatar" style="background:var(--danger);font-size:1.5rem;width:64px;height:64px">${bloodGroup}</div>
          <div class="profile-name" style="font-size:var(--font-size-xl)">${bloodGroup}</div>
          <div class="profile-role">Blood Group</div>
          <div class="profile-stats">
            <div><div class="profile-stat-value" style="color:${item.status === 'available' ? 'var(--success)' : item.status === 'low' ? 'var(--warning)' : 'var(--danger)'}">${item.units}</div><div class="profile-stat-label">Units</div></div>
            <div><div class="profile-stat-value">${eligibleDonors.length}</div><div class="profile-stat-label">Eligible Donors</div></div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="detail-grid">
          <div class="detail-field"><div class="detail-label">Status</div><div class="detail-value"><span class="badge badge-${item.status === 'available' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}">${Formatters.status(item.status)}</span></div></div>
          <div class="detail-field"><div class="detail-label">Storage Location</div><div class="detail-value">${item.location}</div></div>
          <div class="detail-field"><div class="detail-label">Expiry Date</div><div class="detail-value">${Formatters.date(item.expiryDate)}</div></div>
          <div class="detail-field"><div class="detail-label">Unit ID</div><div class="detail-value" style="font-family:monospace;font-size:var(--font-size-xs)">${item.id}</div></div>
        </div>
        <div class="flex gap-sm mt-md justify-end">
          <button class="btn btn-sm btn-secondary" onclick="BloodBankModule.showAddUnitModal()"><i class="fas fa-plus"></i> Add Units</button>
        </div>
      </div>
    `, { title: 'Blood Group ' + bloodGroup, size: 'md' });
  },

  showAddUnitModal() {
    Modal.open(`
      <form id="addBloodUnitForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Blood Group *</label>
            <select class="form-select" id="buGroup" required>
              <option value="">Select Group</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Units *</label>
            <input type="number" class="form-input" id="buUnits" value="5" min="1" max="100" required>
          </div>
          <div class="form-group"><label class="form-label">Expiry Date *</label>
            <input type="date" class="form-input" id="buExpiry" required>
          </div>
          <div class="form-group"><label class="form-label">Storage Location</label>
            <select class="form-select" id="buLocation"><option>Freezer-1</option><option>Freezer-2</option><option>Freezer-3</option><option>Freezer-4</option></select>
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add to Inventory</button>
        </div>
      </form>
    `, { title: 'Add Blood Units' });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 35);
    document.getElementById('buExpiry') && (document.getElementById('buExpiry').value = expiryDate.toISOString().split('T')[0]);
    document.getElementById('addBloodUnitForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const group = document.getElementById('buGroup').value;
      const units = parseInt(document.getElementById('buUnits').value);
      const location = document.getElementById('buLocation').value;
      const expiry = document.getElementById('buExpiry').value;
      const existing = Store.get('bloodInventory').find(i => i.bloodGroup === group);
      if (existing) {
        Store.update('bloodInventory', inv => inv.map(i => {
          if (i.bloodGroup === group) {
            const newUnits = i.units + units;
            const newStatus = newUnits > 20 ? 'available' : newUnits > 5 ? 'low' : 'critical';
            return { ...i, units: newUnits, status: newStatus, expiryDate: expiry > i.expiryDate ? expiry : i.expiryDate, location };
          }
          return i;
        }));
      } else {
        const newStatus = units > 20 ? 'available' : units > 5 ? 'low' : 'critical';
        Store.update('bloodInventory', inv => [...inv, { id: 'BB' + Date.now().toString(36).toUpperCase(), bloodGroup: group, units, status: newStatus, expiryDate: expiry, location }]);
      }
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'added', target: units + ' units of ' + group + ' to blood bank', type: 'lab' });
      Modal.close();
      NotificationCenter.success(units + ' units of ' + group + ' added to inventory');
      this._renderContent();
    });
  },

  showRegisterDonorModal() {
    Modal.open(`
      <form id="registerDonorForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Full Name *</label><input type="text" class="form-input" id="rdName" placeholder="Donor full name" required></div>
          <div class="form-group"><label class="form-label">Blood Group *</label>
            <select class="form-select" id="rdGroup" required>
              <option value="">Select Group</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Phone *</label><input type="text" class="form-input" id="rdPhone" placeholder="(555) 000-0000" required></div>
          <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="rdEmail" placeholder="donor@example.com"></div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-user-plus"></i> Register Donor</button>
        </div>
      </form>
    `, { title: 'Register New Donor' });
    document.getElementById('registerDonorForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const donor = {
        id: 'BD' + Date.now().toString(36).toUpperCase(),
        name: document.getElementById('rdName').value,
        bloodGroup: document.getElementById('rdGroup').value,
        phone: document.getElementById('rdPhone').value,
        email: document.getElementById('rdEmail')?.value || '',
        lastDonation: null,
        totalDonations: 0,
        status: 'eligible',
        nextEligible: new Date().toISOString().split('T')[0]
      };
      Store.update('bloodDonors', d => [...d, donor]);
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'registered', target: donor.name + ' as blood donor', type: 'lab' });
      Modal.close();
      NotificationCenter.success('Donor registered successfully');
      this._renderContent();
    });
  },

  showNewRequestModal() {
    const patients = Store.get('patients').filter(p => p.status === 'active');
    const doctors = Store.get('doctors').filter(d => d.status === 'active');
    Modal.open(`
      <form id="newBloodRequestForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Patient *</label>
            <select class="form-select" id="brPatient" required>
              <option value="">Select Patient</option>
              ${patients.map(p => `<option value="${p.id}" data-bg="${p.bloodGroup}">${p.name} (${p.bloodGroup})</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Blood Group *</label>
            <select class="form-select" id="brGroup" required>
              <option value="">Select Group</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Units *</label><input type="number" class="form-input" id="brUnits" value="1" min="1" max="50" required></div>
          <div class="form-group"><label class="form-label">Urgency *</label>
            <select class="form-select" id="brUrgency" required>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Requesting Doctor *</label>
            <select class="form-select" id="brDoctor" required>
              <option value="">Select Doctor</option>
              ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-tint"></i> Create Request</button>
        </div>
      </form>
    `, { title: 'New Blood Request', size: 'md' });
    document.getElementById('brPatient')?.addEventListener('change', function() {
      const opt = this.options[this.selectedIndex];
      const bg = opt ? opt.dataset.bg : '';
      if (bg) document.getElementById('brGroup').value = bg;
    });
    document.getElementById('newBloodRequestForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientId = document.getElementById('brPatient').value;
      const patient = Store.getPatient(patientId);
      const request = {
        id: 'BR' + Date.now().toString(36).toUpperCase(),
        patientId,
        patientName: patient.name,
        bloodGroup: document.getElementById('brGroup').value,
        units: parseInt(document.getElementById('brUnits').value),
        urgency: document.getElementById('brUrgency').value,
        requestedBy: document.getElementById('brDoctor').value,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      Store.update('bloodRequests', r => [...r, request]);
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'requested', target: request.units + ' units of ' + request.bloodGroup + ' for ' + patient.name, type: 'lab' });
      Modal.close();
      NotificationCenter.success('Blood request created (' + request.urgency + ')');
      this._renderContent();
    });
  },

  viewDonor(donorId) {
    const d = Store.get('bloodDonors').find(don => don.id === donorId);
    if (!d) return;
    Modal.open(`
      <div class="profile-card">
        <div class="profile-avatar" style="background:${Helpers.getAvatarColor(d.name)}">${Helpers.getInitials(d.name)}</div>
        <div class="profile-name">${d.name}</div>
        <div class="profile-role"><span class="badge badge-danger">${d.bloodGroup}</span> Donor</div>
        <div class="profile-stats">
          <div><div class="profile-stat-value">${d.totalDonations}</div><div class="profile-stat-label">Donations</div></div>
          <div><div class="profile-stat-value">${Formatters.date(d.lastDonation || d.nextEligible)}</div><div class="profile-stat-label">Last Donation</div></div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="detail-grid">
        <div class="detail-field"><div class="detail-label">Phone</div><div class="detail-value">${d.phone}</div></div>
        <div class="detail-field"><div class="detail-label">Email</div><div class="detail-value">${d.email || 'N/A'}</div></div>
        <div class="detail-field"><div class="detail-label">Status</div><div class="detail-value"><span class="badge badge-${d.status === 'eligible' ? 'success' : 'warning'}">${Formatters.status(d.status)}</span></div></div>
        <div class="detail-field"><div class="detail-label">Next Eligible</div><div class="detail-value">${Formatters.date(d.nextEligible)}</div></div>
      </div>
    `, { title: 'Donor Profile', size: 'md' });
  },

  recordDonation(donorId) {
    Modal.open(`
      <form id="recordDonationForm">
        <p style="color:var(--text-secondary);margin-bottom:16px">Record a new donation and automatically update the blood inventory.</p>
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Units Donated</label>
            <input type="number" class="form-input" id="rdUnits" value="1" min="1" max="3">
          </div>
          <div class="form-group"><label class="form-label">Donation Date</label>
            <input type="date" class="form-input" id="rdDate" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-success"><i class="fas fa-syringe"></i> Record Donation</button>
        </div>
      </form>
    `, { title: 'Record Donation' });
    document.getElementById('recordDonationForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const units = parseInt(document.getElementById('rdUnits').value);
      const date = document.getElementById('rdDate').value;
      const donor = Store.get('bloodDonors').find(d => d.id === donorId);
      if (!donor) return;
      const nextEligible = new Date(date);
      nextEligible.setDate(nextEligible.getDate() + 56);
      Store.update('bloodDonors', donors => donors.map(d => {
        if (d.id === donorId) return { ...d, lastDonation: date, totalDonations: d.totalDonations + units, status: 'eligible', nextEligible: nextEligible.toISOString().split('T')[0] };
        return d;
      }));
      const existing = Store.get('bloodInventory').find(i => i.bloodGroup === donor.bloodGroup);
      if (existing) {
        Store.update('bloodInventory', inv => inv.map(i => {
          if (i.bloodGroup === donor.bloodGroup) {
            const newUnits = i.units + units;
            const newStatus = newUnits > 20 ? 'available' : newUnits > 5 ? 'low' : 'critical';
            return { ...i, units: newUnits, status: newStatus };
          }
          return i;
        }));
      } else {
        Store.update('bloodInventory', inv => [...inv, { id: 'BB' + Date.now().toString(36).toUpperCase(), bloodGroup: donor.bloodGroup, units, status: 'available', expiryDate: nextEligible.toISOString().split('T')[0], location: 'Freezer-1' }]);
      }
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'donated', target: units + ' units of ' + donor.bloodGroup + ' by ' + donor.name, type: 'lab' });
      Modal.close();
      NotificationCenter.success('Donation recorded and inventory updated');
      this._renderContent();
    });
  },

  fulfillRequest(requestId) {
    const request = Store.get('bloodRequests').find(r => r.id === requestId);
    if (!request) return;
    const inventory = Store.get('bloodInventory').find(i => i.bloodGroup === request.bloodGroup);
    if (!inventory || inventory.units < request.units) {
      NotificationCenter.error('Insufficient ' + request.bloodGroup + ' units in inventory');
      return;
    }
    Store.update('bloodRequests', requests => requests.map(r => {
      if (r.id === requestId) return { ...r, status: 'fulfilled' };
      return r;
    }));
    Store.update('bloodInventory', inv => inv.map(i => {
      if (i.bloodGroup === request.bloodGroup) {
        const newUnits = i.units - request.units;
        const newStatus = newUnits > 20 ? 'available' : newUnits > 5 ? 'low' : newUnits > 0 ? 'critical' : 'none';
        return { ...i, units: newUnits, status: newStatus };
      }
      return i;
    }));
    Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'fulfilled', target: 'blood request ' + requestId + ' for ' + request.patientName, type: 'lab' });
    NotificationCenter.success('Request fulfilled - ' + request.units + ' units of ' + request.bloodGroup + ' issued');
    this._renderContent();
  },

  cancelRequest(requestId) {
    Store.update('bloodRequests', requests => requests.map(r => {
      if (r.id === requestId) return { ...r, status: 'cancelled' };
      return r;
    }));
    NotificationCenter.info('Blood request cancelled');
    this._renderContent();
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('bloodbank'); App.attachEvents(); }
  }
};
