const Router = {
  _currentRoute: null,
  _routes: {},
  _beforeHooks: [],

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#login';
    } else {
      this._handleRoute();
    }
  },

  register(path, handler) {
    this._routes[path] = handler;
  },

  before(fn) {
    this._beforeHooks.push(fn);
  },

  navigate(path) {
    window.location.hash = path;
  },

  getCurrentRoute() {
    return window.location.hash.slice(1) || 'login';
  },

  _handleRoute() {
    const path = this.getCurrentRoute();
    this._currentRoute = path;

    for (const hook of this._beforeHooks) {
      hook(path);
    }

    const handler = this._routes[path];
    if (handler) {
      handler();
    } else {
      if (this._routes['404']) this._routes['404']();
      else this.navigate('dashboard');
    }
  }
};
