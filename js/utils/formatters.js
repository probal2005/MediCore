const Formatters = {
  date: (date, format = 'medium') => {
    const d = new Date(date);
    const opts = { short: { month: 'numeric', day: 'numeric', year: '2-digit' }, medium: { month: 'short', day: 'numeric', year: 'numeric' }, long: { month: 'long', day: 'numeric', year: 'numeric' }, full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } };
    return d.toLocaleDateString('en-US', opts[format] || opts.medium);
  },
  time: (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  dateTime: (date) => Formatters.date(date) + ' ' + Formatters.time(date),
  relative: (date) => Helpers.getTimeAgo(date),
  currency: (amount) => '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  number: (num) => Number(num).toLocaleString('en-US'),
  percentage: (val, decimals = 1) => Number(val).toFixed(decimals) + '%',
  phone: (phone) => { const c = phone.replace(/\D/g,''); if (c.length === 10) return '(' + c.substr(0,3) + ') ' + c.substr(3,3) + '-' + c.substr(4); return phone; },
  gender: (g) => g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other',
  bloodGroup: (bg) => bg,
  status: (s) => s.charAt(0).toUpperCase() + s.slice(1),
  capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
  pluralize: (count, singular, plural) => count === 1 ? singular : (plural || singular + 's'),
  fileSize: (bytes) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; },
  duration: (minutes) => { const h = Math.floor(minutes / 60); const m = minutes % 60; return h > 0 ? h + 'h ' + m + 'm' : m + 'm'; },
  age: (dob) => Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000)
};
