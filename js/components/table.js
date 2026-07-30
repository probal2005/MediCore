const DataTable = {
  render(data, columns, options = {}) {
    const { emptyMessage = 'No data available', onRowClick = null, actions = null } = options;
    if (!data || data.length === 0) {
      return `<div class="empty-state"><i class="fas fa-inbox empty-state-icon"></i><div class="empty-state-title">${emptyMessage}</div></div>`;
    }
    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr>${columns.map(col => `<th>${col.label}</th>`).join('')}${actions ? '<th style="width:80px">Actions</th>' : ''}</tr></thead>
          <tbody>
            ${data.map((row, idx) => `
              <tr ${onRowClick ? `style="cursor:pointer" data-index="${idx}"` : ''}>
                ${columns.map(col => `<td>${this._formatCell(row, col)}</td>`).join('')}
                ${actions ? `<td class="actions">${actions(row)}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  _formatCell(row, col) {
    const val = col.value ? (typeof col.value === 'function' ? col.value(row) : row[col.value]) : row[col.key];
    if (col.template) return col.template(val, row);
    if (col.badge) return `<span class="badge badge-${Helpers.getStatusColor(val)}">${Formatters.status(val)}</span>`;
    if (val === null || val === undefined) return '-';
    if (col.type === 'date') return Formatters.date(val);
    if (col.type === 'datetime') return Formatters.dateTime(val);
    if (col.type === 'currency') return Formatters.currency(val);
    if (col.type === 'number') return Formatters.number(val);
    if (col.type === 'avatar') {
      return `<div class="flex items-center gap-sm"><div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(val)}">${Helpers.getInitials(val)}</div><span>${val}</span></div>`;
    }
    return val;
  }
};
