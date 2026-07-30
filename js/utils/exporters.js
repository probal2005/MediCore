const Exporters = {
  toCSV: (data, filename = 'export') => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => { let val = row[h] || ''; if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) val = '"' + val.replace(/"/g, '""') + '"'; return val; }).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename + '.csv'; link.click(); URL.revokeObjectURL(link.href);
  },
  toJSON: (data, filename = 'export') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename + '.json'; link.click(); URL.revokeObjectURL(link.href);
  },
  toPDF: (element, filename = 'export') => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>' + filename + '</title><link rel="stylesheet" href="css/variables.css"><link rel="stylesheet" href="css/components.css"><style>body{padding:40px;font-family:Inter,sans-serif}table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #e2e8f0;text-align:left}th{background:#f1f5f9;font-weight:600}</style></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  },
  print: (element) => { const w = window.open('','_blank'); w.document.write(element.innerHTML); w.document.close(); w.print(); }
};
