const ChartComponent = {
  charts: {},

  createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (this.charts[canvasId]) this.charts[canvasId].destroy();
    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: datasets.map(d => ({ ...d, borderWidth: 2, tension: 0.3, fill: false, pointRadius: 3, pointHoverRadius: 5 })) },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() } }, y: { grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() } } }, ...options }
    });
  },

  createBarChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (this.charts[canvasId]) this.charts[canvasId].destroy();
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: datasets.map(d => ({ ...d, borderRadius: 6, borderSkipped: false })) },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() }, beginAtZero: true } }, ...options }
    });
  },

  createDoughnutChart(canvasId, labels, data, colors, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (this.charts[canvasId]) this.charts[canvasId].destroy();
    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() } } }, ...options }
    });
  },

  createPolarAreaChart(canvasId, labels, data, colors, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (this.charts[canvasId]) this.charts[canvasId].destroy();
    this.charts[canvasId] = new Chart(ctx, { type: 'polarArea', data: { labels, datasets: [{ data, backgroundColor: colors }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } }, ...options } });
  },

  destroy(canvasId) { if (this.charts[canvasId]) { this.charts[canvasId].destroy(); delete this.charts[canvasId]; } },
  destroyAll() { Object.keys(this.charts).forEach(id => this.destroy(id)); }
};
