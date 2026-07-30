const SearchModal = {
  open() {
    const backdrop = document.getElementById('searchBackdrop');
    const modal = document.getElementById('searchModal');
    if (backdrop && modal) {
      backdrop.classList.add('open');
      modal.classList.add('open');
      setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
    }
  },

  close() {
    document.getElementById('searchBackdrop')?.classList.remove('open');
    document.getElementById('searchModal')?.classList.remove('open');
  },

  render() {
    return `
      <div class="search-modal-backdrop" id="searchBackdrop"></div>
      <div class="search-modal" id="searchModal">
        <div class="search-modal-input">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" placeholder="Search patients, doctors, appointments, medicines..." autocomplete="off">
          <button class="btn btn-sm btn-ghost" id="searchClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="search-modal-results" id="searchResults">
          <div class="search-shortcuts">
            <span class="search-shortcut"><kbd>&uarr;</kbd> <kbd>&darr;</kbd> Navigate</span>
            <span class="search-shortcut"><kbd>&crarr;</kbd> Select</span>
            <span class="search-shortcut"><kbd>Esc</kbd> Close</span>
            <span class="search-shortcut"><kbd>Ctrl+K</kbd> Open</span>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('searchClose')?.addEventListener('click', () => this.close());
    document.getElementById('searchBackdrop')?.addEventListener('click', () => this.close());

    const input = document.getElementById('searchInput');
    if (input) {
      input.addEventListener('input', Helpers.debounce(() => this._performSearch(input.value), 200));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
        if (e.key === 'Enter') {
          const firstResult = document.querySelector('.search-result-item');
          if (firstResult) firstResult.click();
        }
      });
    }
  },

  _performSearch(query) {
    const results = document.getElementById('searchResults');
    if (!query || query.length < 1) {
      results.innerHTML = `<div class="search-shortcuts" style="padding:20px 20px 12px">
        <span class="search-shortcut"><kbd>&uarr;</kbd> <kbd>&darr;</kbd> Navigate</span>
        <span class="search-shortcut"><kbd>&crarr;</kbd> Select</span>
        <span class="search-shortcut"><kbd>Esc</kbd> Close</span>
        <span class="search-shortcut"><kbd>Ctrl+K</kbd> Open</span>
      </div>`;
      return;
    }

    const q = query.toLowerCase();
    const patients = Store.get('patients').filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q));
    const doctors = Store.get('doctors').filter(d => d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));
    const appointments = Store.get('appointments').filter(a => a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q));

    let html = '';
    if (patients.length) {
      html += `<div class="dropdown-header">Patients (${patients.length})</div>`;
      patients.slice(0, 5).forEach(p => {
        html += `<div class="search-result-item" data-route="patients" data-id="${p.id}">
          <div class="search-result-icon"><i class="fas fa-user"></i></div>
          <div class="search-result-info"><div class="search-result-title">${p.name}</div><div class="search-result-desc">${p.id} - ${p.phone}</div></div>
        </div>`;
      });
    }
    if (doctors.length) {
      html += `<div class="dropdown-header">Doctors (${doctors.length})</div>`;
      doctors.slice(0, 5).forEach(d => {
        html += `<div class="search-result-item" data-route="doctors" data-id="${d.id}">
          <div class="search-result-icon"><i class="fas fa-user-md"></i></div>
          <div class="search-result-info"><div class="search-result-title">${d.name}</div><div class="search-result-desc">${d.department} - ${d.specialization}</div></div>
        </div>`;
      });
    }
    if (appointments.length) {
      html += `<div class="dropdown-header">Appointments (${appointments.length})</div>`;
      appointments.slice(0, 5).forEach(a => {
        html += `<div class="search-result-item" data-route="appointments" data-id="${a.id}">
          <div class="search-result-icon"><i class="fas fa-calendar"></i></div>
          <div class="search-result-info"><div class="search-result-title">${a.patientName} with ${a.doctorName}</div><div class="search-result-desc">${Formatters.dateTime(a.date)}</div></div>
        </div>`;
      });
    }
    if (!html) {
      html = `<div class="empty-state" style="padding:40px"><i class="fas fa-search empty-state-icon"></i><div class="empty-state-title">No results found</div><div class="empty-state-text">Try different keywords</div></div>`;
    }
    results.innerHTML = html;

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.close();
        Router.navigate(item.dataset.route);
      });
    });
  }
};
