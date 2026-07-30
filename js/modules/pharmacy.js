const PharmacyModule = {
  render() {
    const medicines = Store.get('medicines');
    const lowStock = medicines.filter(m => m.stock <= m.minStock);
    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Pharmacy</h2><p class="section-subtitle">Medicine inventory and dispensing</p></div>
          <div class="action-bar">
            <div class="input-group" style="min-width:200px"><span class="input-group-prepend"><i class="fas fa-search"></i></span>
            <input type="text" class="form-input" id="medSearch" placeholder="Search medicines..."></div>
            <button class="btn btn-primary" onclick="PharmacyModule.showAddModal()"><i class="fas fa-plus"></i> Add Medicine</button>
            <button class="btn btn-warning" onclick="PharmacyModule.showLowStock()" data-tooltip="Low Stock Items">
              <i class="fas fa-exclamation-triangle"></i> <span class="badge badge-danger">${lowStock.length}</span>
            </button>
          </div>
        </div>
        ${lowStock.length > 0 ? `<div class="alert alert-warning"><i class="fas fa-exclamation-circle"></i> ${lowStock.length} medicine(s) are running low on stock. <button class="btn btn-sm btn-warning" onclick="PharmacyModule.showLowStock()">View</button></div>` : ''}
        <div class="card">
          <div class="flex items-center gap-md" style="padding:12px 20px;border-bottom:1px solid var(--border-color);flex-wrap:wrap">
            <span class="badge badge-info">Total: ${medicines.length} items</span>
            <span class="badge badge-success">Value: ${Formatters.currency(medicines.reduce((s,m) => s + m.price * m.stock, 0))}</span>
          </div>
          <div class="table-responsive">
            <table class="data-table"><thead><tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Price</th><th>Min Stock</th><th>Location</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="medTableBody">${medicines.map(m => {
                const stockStatus = m.stock <= m.minStock ? 'danger' : m.stock <= m.minStock * 2 ? 'warning' : 'success';
                const expiring = new Date(m.expiry) < new Date(Date.now() + 90*86400000);
                return `<tr><td><div class="font-medium">${m.name}</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${m.manufacturer}</div></td>
                <td>${m.category}</td>
                <td><div class="flex items-center gap-sm"><span class="font-medium">${m.stock}</span><div class="progress" style="width:60px;height:6px"><div class="progress-bar ${stockStatus}" style="width:${Math.min(100, m.stock/m.minStock*50)}%"></div></div></div></td>
                <td>${Formatters.currency(m.price)}/${m.unit}</td>
                <td>${m.minStock}</td><td>${m.location}</td>
                <td><span class="${expiring ? 'text-warning' : ''}">${Formatters.date(m.expiry)} ${expiring ? '<i class="fas fa-exclamation-triangle" style="font-size:10px"></i>' : ''}</span></td>
                <td><span class="badge badge-${m.status === 'active' ? 'success' : 'danger'}">${m.status}</span></td>
                <td class="actions">
                  <button class="btn btn-sm btn-ghost" onclick="PharmacyModule.editMed('${m.id}')"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-sm btn-ghost" onclick="PharmacyModule.adjustStock('${m.id}')"><i class="fas fa-plus-circle" style="color:var(--success)"></i></button>
                </td></tr>`}).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('medSearch')?.addEventListener('input', Helpers.debounce(() => this._filterMeds(), 200));
  },

  _filterMeds() {
    const q = (document.getElementById('medSearch')?.value || '').toLowerCase();
    const meds = Store.get('medicines').filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.manufacturer.toLowerCase().includes(q));
    const tbody = document.getElementById('medTableBody');
    if (tbody) tbody.innerHTML = meds.map(m => {
      const stockStatus = m.stock <= m.minStock ? 'danger' : m.stock <= m.minStock * 2 ? 'warning' : 'success';
      const expiring = new Date(m.expiry) < new Date(Date.now() + 90*86400000);
      return `<tr><td><div class="font-medium">${m.name}</div><div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${m.manufacturer}</div></td>
      <td>${m.category}</td><td><div class="flex items-center gap-sm"><span class="font-medium">${m.stock}</span><div class="progress" style="width:60px;height:6px"><div class="progress-bar ${stockStatus}" style="width:${Math.min(100, m.stock/m.minStock*50)}%"></div></div></div></td>
      <td>${Formatters.currency(m.price)}/${m.unit}</td><td>${m.minStock}</td><td>${m.location}</td>
      <td><span class="${expiring ? 'text-warning' : ''}">${Formatters.date(m.expiry)}</span></td>
      <td><span class="badge badge-${m.status === 'active' ? 'success' : 'danger'}">${m.status}</span></td>
      <td class="actions"><button class="btn btn-sm btn-ghost" onclick="PharmacyModule.editMed('${m.id}')"><i class="fas fa-edit"></i></button>
      <button class="btn btn-sm btn-ghost" onclick="PharmacyModule.adjustStock('${m.id}')"><i class="fas fa-plus-circle" style="color:var(--success)"></i></button></td></tr>`;
    }).join('');
  },

  showLowStock() {
    const low = Store.get('medicines').filter(m => m.stock <= m.minStock);
    Modal.open(`<div class="table-responsive"><table class="data-table"><thead><tr><th>Medicine</th><th>Current Stock</th><th>Min Stock</th><th>Action</th></tr></thead>
      <tbody>${low.map(m => `<tr><td>${m.name}</td><td><span class="badge badge-danger">${m.stock}</span></td><td>${m.minStock}</td>
      <td><button class="btn btn-sm btn-primary" onclick="Modal.close();PharmacyModule.adjustStock('${m.id}')"><i class="fas fa-plus"></i> Restock</button></td></tr>`).join('')}</tbody></table></div>
    `, { title: 'Low Stock Alert', size: 'md' });
  },

  editMed(id) {
    const m = Store.get('medicines').find(x => x.id === id);
    if (!m) return;
    Modal.open(`<form id="editMedForm"><div class="detail-grid">
      <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="emName" value="${m.name}"></div>
      <div class="form-group"><label class="form-label">Category</label><input type="text" class="form-input" id="emCat" value="${m.category}"></div>
      <div class="form-group"><label class="form-label">Price ($)</label><input type="number" step="0.01" class="form-input" id="emPrice" value="${m.price}"></div>
      <div class="form-group"><label class="form-label">Stock</label><input type="number" class="form-input" id="emStock" value="${m.stock}"></div>
      <div class="form-group"><label class="form-label">Min Stock</label><input type="number" class="form-input" id="emMin" value="${m.minStock}"></div>
      <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="emLoc" value="${m.location}"></div>
      <div class="form-group"><label class="form-label">Expiry</label><input type="date" class="form-input" id="emExp" value="${m.expiry}"></div>
      <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="emStatus"><option value="active" ${m.status === 'active' ? 'selected' : ''}>Active</option><option value="inactive" ${m.status === 'inactive' ? 'selected' : ''}>Inactive</option></select></div>
    </div><div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update</button></div></form>`, { title: 'Edit Medicine' });
    document.getElementById('editMedForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.update('medicines', meds => meds.map(x => x.id === id ? { ...x, name: document.getElementById('emName').value, category: document.getElementById('emCat').value, price: parseFloat(document.getElementById('emPrice').value), stock: parseInt(document.getElementById('emStock').value), minStock: parseInt(document.getElementById('emMin').value), location: document.getElementById('emLoc').value, expiry: document.getElementById('emExp').value, status: document.getElementById('emStatus').value } : x));
      Modal.close(); NotificationCenter.success('Medicine updated'); App.refresh();
    });
  },

  adjustStock(id) {
    const m = Store.get('medicines').find(x => x.id === id);
    if (!m) return;
    Modal.open(`<form id="stockForm"><div class="form-group"><label class="form-label">Current Stock: <strong>${m.stock}</strong></label></div>
      <div class="form-group"><label class="form-label">Add Quantity</label><input type="number" class="form-input" id="asQty" value="50" min="1"></div>
      <div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Stock</button></div></form>`, { title: 'Restock: ' + m.name });
    document.getElementById('stockForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const qty = parseInt(document.getElementById('asQty').value);
      Store.update('medicines', meds => meds.map(x => x.id === id ? { ...x, stock: x.stock + qty } : x));
      Modal.close(); NotificationCenter.success(`Added ${qty} units to ${m.name}`); App.refresh();
    });
  },

  showAddModal() {
    Modal.open(`<form id="addMedForm"><div class="detail-grid">
      <div class="form-group"><label class="form-label">Medicine Name *</label><input type="text" class="form-input" id="amName" required></div>
      <div class="form-group"><label class="form-label">Category</label><input type="text" class="form-input" id="amCat" value="General"></div>
      <div class="form-group"><label class="form-label">Manufacturer</label><input type="text" class="form-input" id="amMan" value="Generic"></div>
      <div class="form-group"><label class="form-label">Price ($)</label><input type="number" step="0.01" class="form-input" id="amPrice" value="10"></div>
      <div class="form-group"><label class="form-label">Initial Stock</label><input type="number" class="form-input" id="amStock" value="100"></div>
      <div class="form-group"><label class="form-label">Min Stock</label><input type="number" class="form-input" id="amMin" value="20"></div>
      <div class="form-group"><label class="form-label">Unit</label><select class="form-select" id="amUnit"><option>strip</option><option>bottle</option><option>vial</option><option>inhaler</option><option>tablet</option></select></div>
      <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="amLoc" value="A-01"></div>
      <div class="form-group"><label class="form-label">Expiry Date</label><input type="date" class="form-input" id="amExp"></div>
    </div><div class="flex justify-end gap-sm mt-lg"><button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
    <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Medicine</button></div></form>`, { title: 'Add Medicine' });
    document.getElementById('addMedForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const med = { id: 'MED' + Date.now().toString(36).toUpperCase(), name: document.getElementById('amName').value, category: document.getElementById('amCat').value, manufacturer: document.getElementById('amMan').value, price: parseFloat(document.getElementById('amPrice').value), unit: document.getElementById('amUnit').value, stock: parseInt(document.getElementById('amStock').value), minStock: parseInt(document.getElementById('amMin').value), expiry: document.getElementById('amExp').value || '2025-12-31', location: document.getElementById('amLoc').value, requiresPrescription: true, status: 'active' };
      Store.update('medicines', meds => [...meds, med]); Modal.close(); NotificationCenter.success('Medicine added'); App.refresh();
    });
  }
};
