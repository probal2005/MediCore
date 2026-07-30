const FinanceModule = {
  render() {
    const billing = Store.get('billing');
    const totalRevenue = billing.reduce((s, b) => s + b.paid, 0);
    const pendingPayments = billing.reduce((s, b) => s + b.due, 0);
    const thisMonth = billing.filter(b => b.date.startsWith(new Date().toISOString().slice(0, 7)));
    const collectedThisMonth = thisMonth.reduce((s, b) => s + b.paid, 0);
    const expenses = billing.reduce((s, b) => s + b.amount * 0.35, 0);

    return `
      <div class="dashboard-content">
        <div class="section-header">
          <div><h2 class="section-title">Finance Dashboard</h2><p class="section-subtitle">Financial overview and revenue analytics</p></div>
          <div class="action-bar">
            <button class="btn btn-primary" onclick="FinanceModule.showAddTransaction()"><i class="fas fa-plus"></i> Add Transaction</button>
            <button class="btn btn-outline" onclick="FinanceModule.exportReport()"><i class="fas fa-download"></i> Export</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card animate-fadeInUp stagger-1">
            <div class="stat-card-icon" style="background:var(--primary-bg);color:var(--primary)"><i class="fas fa-dollar-sign"></i></div>
            <div class="stat-card-value">${Formatters.currency(totalRevenue)}</div>
            <div class="stat-card-label">Total Revenue</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> 8.5% from last year</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-2">
            <div class="stat-card-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="fas fa-clock"></i></div>
            <div class="stat-card-value">${Formatters.currency(pendingPayments)}</div>
            <div class="stat-card-label">Pending Payments</div>
            <div class="stat-card-change down"><i class="fas fa-exclamation-circle"></i> ${billing.filter(b => b.due > 0).length} outstanding</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-3">
            <div class="stat-card-icon" style="background:var(--success-bg);color:var(--success)"><i class="fas fa-calendar-check"></i></div>
            <div class="stat-card-value">${Formatters.currency(collectedThisMonth)}</div>
            <div class="stat-card-label">Collected This Month</div>
            <div class="stat-card-change up"><i class="fas fa-arrow-up"></i> ${thisMonth.length} transactions</div>
          </div>
          <div class="stat-card animate-fadeInUp stagger-4">
            <div class="stat-card-icon" style="background:var(--danger-bg);color:var(--danger)"><i class="fas fa-shopping-cart"></i></div>
            <div class="stat-card-value">${Formatters.currency(expenses)}</div>
            <div class="stat-card-label">Total Expenses</div>
            <div class="stat-card-change down"><i class="fas fa-arrow-down"></i> 35% of gross revenue</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card animate-fadeInUp stagger-5">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Revenue Trend</h3>
              <select class="form-select" id="revenuePeriod" style="width:130px" onchange="FinanceModule.refreshChart()">
                <option value="6">Last 6 Months</option>
                <option value="12">Last 12 Months</option>
              </select>
            </div>
            <div class="card-body">
              <canvas id="revenueTrendChart" height="280"></canvas>
            </div>
          </div>
          <div class="card animate-fadeInUp stagger-6">
            <div class="card-header">
              <h3 style="font-weight:600;font-size:var(--font-size-lg)">Revenue by Department</h3>
            </div>
            <div class="card-body">
              <canvas id="revenueDeptChart" height="280"></canvas>
            </div>
          </div>
        </div>

        <div class="card animate-fadeInUp stagger-7">
          <div class="card-header">
            <h3 style="font-weight:600;font-size:var(--font-size-lg)">Recent Transactions</h3>
            <div class="flex gap-sm">
              <div class="input-group" style="min-width:200px">
                <span class="input-group-prepend"><i class="fas fa-search"></i></span>
                <input type="text" class="form-input" id="transactionSearch" placeholder="Search transactions...">
              </div>
              <select class="form-select" id="transactionFilter" style="width:140px" onchange="FinanceModule._filterTransactions()">
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
          <div class="card-body" style="padding:0">
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="transactionTableBody">
                  ${billing.map(b => `
                    <tr>
                      <td style="font-family:monospace;font-size:var(--font-size-xs)">${b.id}</td>
                      <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(b.patientName)}">${Helpers.getInitials(b.patientName)}</div><span class="font-medium">${b.patientName}</span></div></td>
                      <td>${Formatters.date(b.date)}</td>
                      <td>${Formatters.currency(b.amount)}</td>
                      <td>${Formatters.currency(b.paid)}</td>
                      <td>${Formatters.currency(b.due)}</td>
                      <td><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${Formatters.status(b.status)}</span></td>
                      <td class="actions">
                        <button class="btn btn-sm btn-ghost" onclick="FinanceModule.viewTransaction('${b.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-ghost" onclick="FinanceModule.recordPayment('${b.id}')"><i class="fas fa-money-bill"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer">
            <div class="data-table-info">${billing.length} transactions total</div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('transactionSearch')?.addEventListener('input', Helpers.debounce(() => this._filterTransactions(), 200));
    this._initRevenueChart();
    this._initDeptChart();
  },

  _initRevenueChart() {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const revenue = [28500, 31200, 29800, 33500, 34100, 36200];
    ChartComponent.createLineChart('revenueTrendChart', months, [
      { label: 'Revenue ($)', data: revenue, borderColor: 'var(--primary)', backgroundColor: 'rgba(79,70,229,0.08)', fill: true }
    ], { plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') } } } });
  },

  _initDeptChart() {
    const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Oncology'];
    const amounts = [85200, 62300, 54800, 41200, 73500, 38900];
    const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    ChartComponent.createDoughnutChart('revenueDeptChart', depts, amounts, colors, {
      plugins: { legend: { display: true, position: 'bottom', labels: { padding: 16, usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') } } }
    });
  },

  refreshChart() {
    ChartComponent.destroy('revenueTrendChart');
    this._initRevenueChart();
  },

  _filterTransactions() {
    const search = (document.getElementById('transactionSearch')?.value || '').toLowerCase();
    const filter = document.getElementById('transactionFilter')?.value || '';
    const billing = Store.get('billing').filter(b => {
      const ms = b.patientName.toLowerCase().includes(search) || b.id.toLowerCase().includes(search);
      const mf = !filter || b.status === filter;
      return ms && mf;
    });
    const tbody = document.getElementById('transactionTableBody');
    if (tbody) {
      tbody.innerHTML = billing.map(b => `
        <tr>
          <td style="font-family:monospace;font-size:var(--font-size-xs)">${b.id}</td>
          <td><div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(b.patientName)}">${Helpers.getInitials(b.patientName)}</div><span class="font-medium">${b.patientName}</span></div></td>
          <td>${Formatters.date(b.date)}</td>
          <td>${Formatters.currency(b.amount)}</td>
          <td>${Formatters.currency(b.paid)}</td>
          <td>${Formatters.currency(b.due)}</td>
          <td><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${Formatters.status(b.status)}</span></td>
          <td class="actions">
            <button class="btn btn-sm btn-ghost" onclick="FinanceModule.viewTransaction('${b.id}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-ghost" onclick="FinanceModule.recordPayment('${b.id}')"><i class="fas fa-money-bill"></i></button>
          </td>
        </tr>
      `).join('');
    }
  },

  viewTransaction(id) {
    const b = Store.get('billing').find(x => x.id === id);
    if (!b) return;
    Modal.open(`
      <div class="detail-grid">
        <div class="detail-field"><div class="detail-label">Invoice</div><div class="detail-value" style="font-family:monospace">${b.id}</div></div>
        <div class="detail-field"><div class="detail-label">Patient</div><div class="detail-value">${b.patientName}</div></div>
        <div class="detail-field"><div class="detail-label">Date</div><div class="detail-value">${Formatters.date(b.date)}</div></div>
        <div class="detail-field"><div class="detail-label">Status</div><div class="detail-value"><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${Formatters.status(b.status)}</span></div></div>
        <div class="detail-field"><div class="detail-label">Total Amount</div><div class="detail-value" style="font-weight:600">${Formatters.currency(b.amount)}</div></div>
        <div class="detail-field"><div class="detail-label">Paid</div><div class="detail-value" style="color:var(--success)">${Formatters.currency(b.paid)}</div></div>
        <div class="detail-field" style="grid-column:1/-1"><div class="detail-label">Due</div><div class="detail-value" style="color:var(--danger);font-weight:600;font-size:var(--font-size-lg)">${Formatters.currency(b.due)}</div></div>
      </div>
      <div class="divider"></div>
      <div class="detail-label mb-sm">Bill Items</div>
      <table class="data-table">
        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${b.items.map(i => `<tr><td>${i.description}</td><td>${Formatters.currency(i.amount)}</td></tr>`).join('')}</tbody>
        <tfoot><tr style="font-weight:600"><td>Total</td><td>${Formatters.currency(b.amount)}</td></tr></tfoot>
      </table>
    `, { title: 'Transaction Details', size: 'lg' });
  },

  recordPayment(id) {
    const b = Store.get('billing').find(x => x.id === id);
    if (!b) return;
    Modal.open(`
      <form id="paymentForm">
        <div class="form-group">
          <label class="form-label">Patient</label>
          <input type="text" class="form-input" value="${b.patientName}" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Total Amount</label>
          <input type="text" class="form-input" value="${Formatters.currency(b.amount)}" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Amount Due</label>
          <input type="text" class="form-input" value="${Formatters.currency(b.due)}" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Amount *</label>
          <input type="number" class="form-input" id="paymentAmount" step="0.01" min="0" max="${b.due}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Method</label>
          <select class="form-select" id="paymentMethod">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="insurance">Insurance</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Record Payment</button>
        </div>
      </form>
    `, { title: 'Record Payment' });
    document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('paymentAmount').value);
      if (amount <= 0 || amount > b.due) { NotificationCenter.error('Invalid payment amount'); return; }
      const newPaid = b.paid + amount;
      const newDue = b.due - amount;
      const newStatus = newDue <= 0 ? 'paid' : 'partial';
      Store.update('billing', bills => bills.map(x => x.id === id ? { ...x, paid: newPaid, due: newDue, status: newStatus } : x));
      Modal.close();
      NotificationCenter.success(`Payment of ${Formatters.currency(amount)} recorded`);
      this._renderContent();
    });
  },

  showAddTransaction() {
    Modal.open(`
      <form id="addTransactionForm">
        <div class="detail-grid">
          <div class="form-group">
            <label class="form-label">Patient Name *</label>
            <input type="text" class="form-input" id="atPatient" list="patientList" required>
            <datalist id="patientList">${Store.getAllPatients().map(p => `<option value="${p.name}">`).join('')}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Amount *</label>
            <input type="number" class="form-input" id="atAmount" step="0.01" min="0" required>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" id="atDesc" placeholder="e.g., Consultation, Lab Tests">
          </div>
        </div>
        <div class="flex justify-end gap-sm mt-lg">
          <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Transaction</button>
        </div>
      </form>
    `, { title: 'Add Transaction' });
    document.getElementById('addTransactionForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const patient = document.getElementById('atPatient').value;
      const amount = parseFloat(document.getElementById('atAmount').value);
      const desc = document.getElementById('atDesc').value || 'General charge';
      const bill = {
        id: 'BIL' + Date.now().toString(36).toUpperCase(),
        patientId: '',
        patientName: patient,
        date: new Date().toISOString().split('T')[0],
        amount: amount,
        paid: amount,
        due: 0,
        items: [{ description: desc, amount: amount }],
        status: 'paid'
      };
      Store.update('billing', bills => [...bills, bill]);
      Modal.close();
      NotificationCenter.success('Transaction added successfully');
      this._renderContent();
    });
  },

  exportReport() {
    const data = Store.get('billing').map(b => ({ Invoice: b.id, Patient: b.patientName, Date: b.date, Amount: b.amount, Paid: b.paid, Due: b.due, Status: b.status }));
    Exporters.toCSV(data, 'financial-report');
  },

  _renderContent() {
    const app = document.getElementById('app');
    if (app) { app.innerHTML = App.renderContent('finance'); App.attachEvents(); }
  }
};
