const ThemeManager = {
  init: () => {
    const saved = localStorage.getItem('medicore-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  },
  get: () => document.documentElement.getAttribute('data-theme'),
  set: (theme) => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('medicore-theme', theme); },
  toggle: () => { const current = ThemeManager.get(); ThemeManager.set(current === 'light' ? 'dark' : 'light'); },
  isDark: () => ThemeManager.get() === 'dark'
};
ThemeManager.init();
