const InsuranceModule = {
  _filterProvider: '',
  _filterStatus: '',

  render() {
    const insurance = Store.get('insurance');

    const providers = [...new Set(insurance.map(p => p.provider).filter(Boolean))];
    const filtered = insurance.filter(p => {
      if (this._filterProvider && p.provider !== this._filterProvider) return false;
      if (this._filterStatus && p.status !== this._filterStatus) return false;
      return true;
    });

    return `
      <div class="content-area">
        <div class="section-header">
          <div><h2 class="section-title">Insurance Management</h2><p class="section-subtitle">Manage insurance policies and claims</p></div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;gap:12px">
            <select class="form-select form-select-sm" id="insuranceProviderFilter" style="width:auto">
              <option value="">All Providers</option>
              ${providers.map(p => `<option value="${p}" ${this._filterProvider === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            <select class="form-select form-select-sm" id="insuranceStatusFilter" style="width:auto">
              <option value="">All Status</option>
              <option value="active" ${this._filterStatus === 'active' ? 'selected' : ''}>Active</option>
              <option value="expired" ${this._filterStatus === 'expired' ? 'selected' : ''}>Expired</option>
              <option value="pending" ${this._filterStatus === 'pending' ? 'selected' : ''}>Pending</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Provider</th><th>Plan Type</th><th>Policy Holder</th><th>Policy #</th><th>Coverage</th><th>Deductible</th><th>Status</th></tr></thead>
              <tbody id="insuranceTableBody">
                ${filtered.map(p => `
                  <tr>
                    <td><strong>${p.provider}</strong></td>
                    <td>${p.planType}</td>
                    <td>${p.policyHolder}</td>
                    <td style="font-family:monospace;font-size:var(--font-size-xs)">${p.policyNumber}</td>
                    <td>${p.coverage}%</td>
                    <td>$${(p.deductible || 0).toLocaleString()}</td>
                    <td><span class="badge ${p.status === 'active' ? 'badge-success' : p.status === 'expired' ? 'badge-danger' : 'badge-warning'}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
                  </tr>
                `).join('')}
                ${filtered.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-tertiary);padding:20px">No insurance policies found</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('insuranceProviderFilter')?.addEventListener('change', (e) => {
      this._filterProvider = e.target.value;
      this._refresh();
    });
    document.getElementById('insuranceStatusFilter')?.addEventListener('change', (e) => {
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
