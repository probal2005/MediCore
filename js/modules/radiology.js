const RadiologyModule = {
  render() {
    const exams = Store.get('radiologyExams');
    const orders = Store.get('radOrders');
    const patients = Store.get('patients');
    const categories = [...new Set(exams.map(e => e.category))];

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Radiology</h2><p class="section-subtitle">Manage radiology exams, orders, and results</p></div>
          <div class="action-bar">
            <button class="btn btn-primary" onclick="RadiologyModule.showNewOrderModal()"><i class="fas fa-plus"></i> New Order</button>
            <button class="btn btn-secondary" onclick="RadiologyModule.showAddExamModal()"><i class="fas fa-flask"></i> Add Exam</button>
          </div>
        </div>

        <div class="tab-nav mb-md" id="radTabs">
          <button class="tab-btn active" data-tab="orders"><i class="fas fa-clipboard-list"></i> Orders (${orders.length})</button>
          <button class="tab-btn" data-tab="catalog"><i class="fas fa-book"></i> Exam Catalog</button>
          <button class="tab-btn" data-tab="results"><i class="fas fa-file-medical-alt"></i> Results</button>
        </div>

        <div id="radTabContent">
          ${this._renderOrdersTab(orders, patients)}
        </div>
      </div>
    `;
  },

  _renderOrdersTab(orders, patients) {
    return `
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Order ID</th><th>Patient</th><th>Exam</th><th>Ordered Date</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${orders.length === 0 ? '<tr><td colspan="7" class="text-center" style="padding:40px;color:var(--text-tertiary)">No radiology orders found</td></tr>' : orders.map(o => `
                <tr>
                  <td style="font-family:monospace;font-size:var(--font-size-xs)">${o.id}</td>
                  <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(o.patientName)};width:28px;height:28px;font-size:10px">${Helpers.getInitials(o.patientName)}</div><span class="font-medium">${o.patientName}</span></div></td>
                  <td>${o.examName}</td>
                  <td>${Formatters.date(o.orderedDate)}</td>
                  <td>${o.doctorName}</td>
                  <td><span class="badge badge-${Helpers.getStatusColor(o.status)}">${Formatters.status(o.status === 'in_progress' ? 'in progress' : o.status)}</span></td>
                  <td class="actions">
                    ${o.status === 'scheduled' ? `<button class="btn btn-sm btn-success" onclick="RadiologyModule.startExam('${o.id}')"><i class="fas fa-play"></i> Start</button>` : ''}
                    ${o.status === 'in_progress' ? `<button class="btn btn-sm btn-primary" onclick="RadiologyModule.showAddResultModal('${o.id}')"><i class="fas fa-pen"></i> Add Result</button>` : ''}
                    ${o.result ? `<button class="btn btn-sm btn-ghost" onclick="RadiologyModule.viewResult('${o.id}')"><i class="fas fa-eye"></i></button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="data-table-footer"><div class="data-table-info">${orders.length} orders total</div></div>
      </div>
    `;
  },

  _renderCatalogTab(exams, categories) {
    return `
      <div class="card">
        <div class="card-header">
          <div class="flex gap-sm">
            <button class="btn btn-sm btn-ghost active" data-cat="all">All</button>
            ${categories.map(c => `<button class="btn btn-sm btn-ghost" data-cat="${c}">${c}</button>`).join('')}
          </div>
          <div class="input-group" style="min-width:200px">
            <span class="input-group-prepend"><i class="fas fa-search"></i></span>
            <input type="text" class="form-input" id="examSearch" placeholder="Search exams...">
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Exam Name</th><th>Category</th><th>Duration</th><th>Price</th><th>Preparation</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="examTableBody">
              ${exams.map(e => `
                <tr data-category="${e.category}">
                  <td class="font-medium">${e.name}</td>
                  <td><span class="badge badge-info">${e.category}</span></td>
                  <td>${e.duration}</td>
                  <td>${Formatters.currency(e.price)}</td>
                  <td style="max-width:200px;white-space:normal;font-size:var(--font-size-xs);color:var(--text-tertiary)">${e.preparation}</td>
                  <td><span class="badge badge-${e.status === 'active' ? 'success' : 'danger'}">${e.status}</span></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-ghost" onclick="RadiologyModule.editExam('${e.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="RadiologyModule.toggleExamStatus('${e.id}')"><i class="fas fa-${e.status === 'active' ? 'pause' : 'play'}"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="data-table-footer"><div class="data-table-info">${exams.length} exams in catalog</div></div>
      </div>
    `;
  },

  _renderResultsTab(orders) {
    const results = orders.filter(o => o.result);
    return `
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Order ID</th><th>Patient</th><th>Exam</th><th>Completed Date</th><th>Radiologist</th><th>Result</th><th>Actions</th></tr></thead>
            <tbody>
              ${results.length === 0 ? '<tr><td colspan="7" class="text-center" style="padding:40px;color:var(--text-tertiary)">No completed results yet</td></tr>' : results.map(o => `
                <tr>
                  <td style="font-family:monospace;font-size:var(--font-size-xs)">${o.id}</td>
                  <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(o.patientName)};width:28px;height:28px;font-size:10px">${Helpers.getInitials(o.patientName)}</div><span class="font-medium">${o.patientName}</span></div></td>
                  <td>${o.examName}</td>
                  <td>${Formatters.date(o.orderedDate)}</td>
                  <td>${o.radiologist || 'N/A'}</td>
                  <td><div class="result-preview" style="max-width:250px;white-space:normal;font-size:var(--font-size-xs);color:var(--text-secondary)">${Helpers.truncate(o.result, 80)}</div></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-ghost" onclick="RadiologyModule.viewResult('${o.id}')"><i class="fas fa-eye"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="data-table-footer"><div class="data-table-info">${results.length} completed results</div></div>
      </div>
    `;
  },

  attachEvents() {
    document.querySelectorAll('#radTabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#radTabs .tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tab = this.dataset.tab;
        const content = document.getElementById('radTabContent');
        const exams = Store.get('radiologyExams');
        const orders = Store.get('radOrders');
        const categories = [...new Set(exams.map(e => e.category))];
        if (tab === 'orders') content.innerHTML = RadiologyModule._renderOrdersTab(orders, Store.get('patients'));
        else if (tab === 'catalog') { content.innerHTML = RadiologyModule._renderCatalogTab(exams, categories); RadiologyModule.attachCatalogEvents(); }
        else if (tab === 'results') content.innerHTML = RadiologyModule._renderResultsTab(orders);
      });
    });
  },

  attachCatalogEvents() {
    document.getElementById('examSearch')?.addEventListener('input', Helpers.debounce(() => this._filterExams(), 200));
    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.cat;
        document.querySelectorAll('#examTableBody tr').forEach(row => {
          row.style.display = cat === 'all' || row.dataset.category === cat ? '' : 'none';
        });
      });
    });
  },

  _filterExams() {
    const search = (document.getElementById('examSearch')?.value || '').toLowerCase();
    document.querySelectorAll('#examTableBody tr').forEach(row => {
      const name = row.querySelector('td:first-child')?.textContent?.toLowerCase() || '';
      row.style.display = name.includes(search) ? '' : 'none';
    });
  },

  showNewOrderModal() {
    const exams = Store.get('radiologyExams').filter(e => e.status === 'active');
    const doctors = Store.get('doctors').filter(d => d.status === 'active');
    const patients = Store.get('patients').filter(p => p.status === 'active');
    Modal.open(`
      <form id="newRadOrderForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Patient *</label>
            <select class="form-select" id="roPatient" required>
              <option value="">Select Patient</option>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Exam *</label>
            <select class="form-select" id="roExam" required>
              <option value="">Select Exam</option>
              ${exams.map(e => `<option value="${e.id}" data-price="${e.price}">${e.name} - ${Formatters.currency(e.price)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Referring Doctor *</label>
            <select class="form-select" id="roDoctor" required>
              <option value="">Select Doctor</option>
              ${doctors.map(d => `<option value="${d.id}">${d.name} - ${d.department}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Order Date</label>
            <input type="date" class="form-input" id="roDate" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Notes</label>
            <textarea class="form-input" id="roNotes" rows="2" placeholder="Clinical notes..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Create Order</button>
        </div>
      </form>
    `, { title: 'New Radiology Order', size: 'md' });
    document.getElementById('newRadOrderForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientId = document.getElementById('roPatient').value;
      const patient = Store.getPatient(patientId);
      const examId = document.getElementById('roExam').value;
      const exam = Store.get('radiologyExams').find(ex => ex.id === examId);
      const doctorId = document.getElementById('roDoctor').value;
      const doctor = Store.getDoctor(doctorId);
      const order = {
        id: 'RO' + Date.now().toString(36).toUpperCase(),
        patientId,
        patientName: patient.name,
        doctorId,
        doctorName: doctor.name,
        examId,
        examName: exam.name,
        orderedDate: document.getElementById('roDate').value,
        status: 'scheduled',
        result: null,
        radiologist: null
      };
      Store.update('radOrders', o => [...o, order]);
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'ordered', target: exam.name + ' for ' + patient.name, type: 'lab' });
      Modal.close();
      NotificationCenter.success('Radiology order created');
      this._renderContent();
    });
  },

  showAddExamModal() {
    Modal.open(`
      <form id="addExamForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Exam Name *</label><input type="text" class="form-input" id="aeName" placeholder="e.g., CT Chest" required></div>
          <div class="form-group"><label class="form-label">Category *</label>
            <select class="form-select" id="aeCategory"><option>X-Ray</option><option>MRI</option><option>CT Scan</option><option>Ultrasound</option><option>DEXA</option><option>Mammogram</option><option>Fluoroscopy</option></select>
          </div>
          <div class="form-group"><label class="form-label">Price ($) *</label><input type="number" class="form-input" id="aePrice" value="100" min="0" step="0.01" required></div>
          <div class="form-group"><label class="form-label">Duration</label><input type="text" class="form-input" id="aeDuration" placeholder="e.g., 30 min"></div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Preparation Instructions</label>
            <textarea class="form-input" id="aePrep" rows="2" placeholder="Patient preparation instructions..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Exam</button>
        </div>
      </form>
    `, { title: 'Add Radiology Exam' });
    document.getElementById('addExamForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const exam = {
        id: 'RAD' + Date.now().toString(36).toUpperCase(),
        name: document.getElementById('aeName').value,
        category: document.getElementById('aeCategory').value,
        price: parseFloat(document.getElementById('aePrice').value),
        duration: document.getElementById('aeDuration').value || '30 min',
        preparation: document.getElementById('aePrep').value || 'No special preparation',
        status: 'active'
      };
      Store.update('radiologyExams', ex => [...ex, exam]);
      Modal.close();
      NotificationCenter.success('Exam added to catalog');
      this._renderContent();
    });
  },

  startExam(orderId) {
    Store.update('radOrders', orders => orders.map(o => {
      if (o.id === orderId) return { ...o, status: 'in_progress', radiologist: Store.get('currentUser')?.name || 'Unknown' };
      return o;
    }));
    Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'started', target: 'exam for order ' + orderId, type: 'lab' });
    NotificationCenter.success('Exam started');
    this._renderContent();
  },

  showAddResultModal(orderId) {
    const order = Store.get('radOrders').find(o => o.id === orderId);
    Modal.open(`
      <form id="addResultForm">
        <div class="mb-md">
          <div class="detail-grid" style="grid-template-columns:1fr 1fr">
            <div class="detail-field"><div class="detail-label">Patient</div><div class="detail-value">${order.patientName}</div></div>
            <div class="detail-field"><div class="detail-label">Exam</div><div class="detail-value">${order.examName}</div></div>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Radiologist</label>
          <input type="text" class="form-input" id="rrRadiologist" value="${Store.get('currentUser')?.name || 'Dr. Unknown'}">
        </div>
        <div class="form-group"><label class="form-label">Findings / Result *</label>
          <textarea class="form-input" id="rrResult" rows="5" placeholder="Describe radiology findings..." required></textarea>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Result</button>
        </div>
      </form>
    `, { title: 'Add Radiology Result' });
    document.getElementById('addResultForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const result = document.getElementById('rrResult').value;
      const radiologist = document.getElementById('rrRadiologist').value;
      Store.update('radOrders', orders => orders.map(o => {
        if (o.id === orderId) return { ...o, status: 'completed', result, radiologist };
        return o;
      }));
      Store.addActivity({ user: Store.get('currentUser')?.name || 'System', action: 'completed', target: 'radiology: ' + order.examName + ' for ' + order.patientName, type: 'lab' });
      Modal.close();
      NotificationCenter.success('Result saved successfully');
      this._renderContent();
    });
  },

  viewResult(orderId) {
    const order = Store.get('radOrders').find(o => o.id === orderId);
    if (!order || !order.result) return;
    Modal.open(`
      <div class="detail-grid mb-md">
        <div class="detail-field"><div class="detail-label">Order ID</div><div class="detail-value" style="font-family:monospace">${order.id}</div></div>
        <div class="detail-field"><div class="detail-label">Patient</div><div class="detail-value">${order.patientName}</div></div>
        <div class="detail-field"><div class="detail-label">Exam</div><div class="detail-value">${order.examName}</div></div>
        <div class="detail-field"><div class="detail-label">Date</div><div class="detail-value">${Formatters.date(order.orderedDate)}</div></div>
        <div class="detail-field"><div class="detail-label">Radiologist</div><div class="detail-value">${order.radiologist || 'N/A'}</div></div>
        <div class="detail-field"><div class="detail-label">Referring Doctor</div><div class="detail-value">${order.doctorName}</div></div>
      </div>
      <div class="divider"></div>
      <div class="result-card" style="background:var(--bg-subtle);padding:16px;border-radius:var(--radius-md);margin-top:12px">
        <div style="font-weight:600;margin-bottom:8px;font-size:var(--font-size-sm);color:var(--text-secondary)"><i class="fas fa-file-medical-alt"></i> Findings</div>
        <div style="white-space:pre-wrap;line-height:1.6;color:var(--text-primary)">${order.result}</div>
      </div>
    `, { title: 'Radiology Result - ' + order.examName, size: 'lg' });
  },

  editExam(examId) {
    const exam = Store.get('radiologyExams').find(e => e.id === examId);
    if (!exam) return;
    Modal.open(`
      <form id="editExamForm">
        <div class="detail-grid">
          <div class="form-group"><label class="form-label">Exam Name</label><input type="text" class="form-input" id="eeName" value="${exam.name}"></div>
          <div class="form-group"><label class="form-label">Category</label>
            <select class="form-select" id="eeCategory"><option ${exam.category === 'X-Ray' ? 'selected' : ''}>X-Ray</option><option ${exam.category === 'MRI' ? 'selected' : ''}>MRI</option><option ${exam.category === 'CT Scan' ? 'selected' : ''}>CT Scan</option><option ${exam.category === 'Ultrasound' ? 'selected' : ''}>Ultrasound</option><option ${exam.category === 'DEXA' ? 'selected' : ''}>DEXA</option></select>
          </div>
          <div class="form-group"><label class="form-label">Price ($)</label><input type="number" class="form-input" id="eePrice" value="${exam.price}" step="0.01"></div>
          <div class="form-group"><label class="form-label">Duration</label><input type="text" class="form-input" id="eeDuration" value="${exam.duration}"></div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Preparation</label>
            <textarea class="form-input" id="eePrep" rows="2">${exam.preparation}</textarea>
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update</button>
        </div>
      </form>
    `, { title: 'Edit Exam' });
    document.getElementById('editExamForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.update('radiologyExams', exams => exams.map(ex => {
        if (ex.id === examId) return { ...ex, name: document.getElementById('eeName').value, category: document.getElementById('eeCategory').value, price: parseFloat(document.getElementById('eePrice').value), duration: document.getElementById('eeDuration').value, preparation: document.getElementById('eePrep').value };
        return ex;
      }));
      Modal.close();
      NotificationCenter.success('Exam updated');
      this._renderContent();
    });
  },

  toggleExamStatus(examId) {
    Store.update('radiologyExams', exams => exams.map(ex => {
      if (ex.id === examId) return { ...ex, status: ex.status === 'active' ? 'inactive' : 'active' };
      return ex;
    }));
    const exam = Store.get('radiologyExams').find(e => e.id === examId);
    NotificationCenter.success(exam.name + ' ' + (exam.status === 'active' ? 'activated' : 'deactivated'));
    this._renderContent();
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('radiology'); App.attachEvents(); }
  }
};
