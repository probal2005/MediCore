const BillingModule = {
  _filterStatus: '',

  render() {
    const billing = Store.get('billing');
    const totalRevenue = billing.reduce((s, b) => s + b.paid, 0);
    const pendingAmount = billing.reduce((s, b) => s + b.due, 0);
    const totalBilled = billing.reduce((s, b) => s + b.amount, 0);
    const paidCount = billing.filter(b => b.status === 'paid').length;
    const partialCount = billing.filter(b => b.status === 'partial').length;
    const unpaidCount = billing.filter(b => b.status === 'unpaid').length;

    const filtered = this._filterStatus ? billing.filter(b => b.status === this._filterStatus) : billing;

    const formatCurrency = (v) => '$' + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Billing Management</h2><p class="section-subtitle">Manage patient bills, payments, and invoices</p></div>
        </div>
        <div class="stats-grid" style="margin-bottom:20px">
          <div class="stat-card" style="border-left:4px solid var(--success);padding:16px">
            <div class="stat-card-value" style="color:var(--success);font-size:var(--font-size-lg)">${formatCurrency(totalRevenue)}</div>
            <div class="stat-card-label">Total Revenue</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--warning);padding:16px">
            <div class="stat-card-value" style="color:var(--warning);font-size:var(--font-size-lg)">${formatCurrency(pendingAmount)}</div>
            <div class="stat-card-label">Pending Amount</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--primary);padding:16px">
            <div class="stat-card-value" style="color:var(--primary);font-size:var(--font-size-lg)">${formatCurrency(totalBilled)}</div>
            <div class="stat-card-label">Total Billed</div>
          </div>
          <div class="stat-card" style="border-left:4px solid var(--danger);padding:16px">
            <div class="stat-card-value" style="color:var(--danger);font-size:var(--font-size-lg)">${unpaidCount}</div>
            <div class="stat-card-label">Unpaid Bills</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <select class="form-select form-select-sm" id="billingStatusFilter" style="width:auto">
              <option value="">All Status</option>
              <option value="paid" ${this._filterStatus === 'paid' ? 'selected' : ''}>Paid</option>
              <option value="partial" ${this._filterStatus === 'partial' ? 'selected' : ''}>Partial</option>
              <option value="unpaid" ${this._filterStatus === 'unpaid' ? 'selected' : ''}>Unpaid</option>
            </select>
            <span style="font-size:var(--font-size-sm);color:var(--text-tertiary)">${filtered.length} of ${billing.length} bills</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Bill ID</th><th>Patient</th><th>Date</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="billingTableBody">
                ${filtered.map(b => `
                  <tr>
                    <td style="font-family:monospace;font-size:var(--font-size-xs)">${b.id}</td>
                    <td><strong>${b.patientName}</strong></td>
                    <td>${b.date}</td>
                    <td>${formatCurrency(b.amount)}</td>
                    <td>${formatCurrency(b.paid)}</td>
                    <td>${formatCurrency(b.due)}</td>
                    <td><span class="badge ${b.status === 'paid' ? 'badge-success' : b.status === 'partial' ? 'badge-warning' : 'badge-danger'}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                    <td>
                      <button class="btn btn-sm btn-ghost" onclick="BillingModule._viewDetails('${b.id}')" title="View Details"><i class="fas fa-eye"></i></button>
                      ${b.status !== 'paid' ? `<button class="btn btn-sm btn-primary" onclick="BillingModule._recordPayment('${b.id}')" title="Record Payment"><i class="fas fa-credit-card"></i></button>` : ''}
                    </td>
                  </tr>
                `).join('')}
                ${filtered.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-tertiary);padding:20px">No bills found</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  _viewDetails(billId) {
    const bill = Store.get('billing').find(b => b.id === billId);
    if (!bill) return;
    const items = bill.items || [];

    Modal.open(`
      <div style="padding:20px">
        <h3 style="margin-bottom:16px">Bill Details - ${bill.id}</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          <div><strong>Patient:</strong> ${bill.patientName}</div>
          <div><strong>Date:</strong> ${bill.date}</div>
          <div><strong>Total:</strong> $${bill.amount.toLocaleString()}</div>
          <div><strong>Paid:</strong> $${bill.paid.toLocaleString()}</div>
          <div><strong>Due:</strong> $${bill.due.toLocaleString()}</div>
          <div><strong>Status:</strong> <span class="badge ${bill.status === 'paid' ? 'badge-success' : bill.status === 'partial' ? 'badge-warning' : 'badge-danger'}">${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</span></div>
        </div>
        <h4 style="font-weight:600;margin-bottom:8px">Itemized Charges</h4>
        <table class="data-table">
          <thead><tr><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            ${items.map(item => `<tr><td>${item.description || item.desc}</td><td>$${(item.amount || 0).toLocaleString()}</td></tr>`).join('')}
            <tr><td><strong>Total</strong></td><td><strong>$${bill.amount.toLocaleString()}</strong></td></tr>
          </tbody>
        </table>
      </div>
    `);
  },

  _recordPayment(billId) {
    const bill = Store.get('billing').find(b => b.id === billId);
    if (!bill || bill.status === 'paid') return;
    const remaining = bill.amount - bill.paid;

    Modal.open(`
      <div style="padding:20px">
        <h3 style="margin-bottom:16px">Record Payment - ${bill.id}</h3>
        <div style="margin-bottom:12px">
          <div><strong>Patient:</strong> ${bill.patientName}</div>
          <div><strong>Total:</strong> $${bill.amount.toLocaleString()}</div>
          <div><strong>Already Paid:</strong> $${bill.paid.toLocaleString()}</div>
          <div><strong>Remaining:</strong> $${remaining.toLocaleString()}</div>
        </div>
        <form id="recordPaymentForm">
          <div class="form-group"><label class="form-label">Payment Amount</label>
            <input type="number" class="form-input" id="paymentAmount" max="${remaining}" min="0.01" step="0.01" value="${remaining}">
          </div>
          <div class="form-group"><label class="form-label">Payment Method</label>
            <select class="form-input" id="paymentMethod">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="insurance">Insurance</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Record Payment</button>
            <button type="button" class="btn btn-outline" onclick="Modal.close()">Cancel</button>
          </div>
        </form>
      </div>
    `);
    setTimeout(() => {
      document.getElementById('recordPaymentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.close();
        NotificationCenter.success('Payment recorded successfully');
        this._refresh();
      });
    }, 50);
  },

  attachEvents() {
    document.getElementById('billingStatusFilter')?.addEventListener('change', (e) => {
      this._filterStatus = e.target.value;
      this._refresh();
    });
  },

  _refresh() {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = this.render();
      this.attachEvents();
    }
  }
};
