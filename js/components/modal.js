const Modal = {
  open(content, options = {}) {
    const container = document.getElementById('modal-container');
    const { title = '', size = 'md', onClose = null } = options;
    container.innerHTML = `
      <div class="modal-backdrop" id="modalBackdrop">
        <div class="modal-content modal-${size} animate-scaleIn" id="modalContent">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" id="modalClose">&times;</button>
          </div>
          <div class="modal-body">${content}</div>
        </div>
      </div>
    `;
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').addEventListener('click', () => this.close(onClose));
    document.getElementById('modalBackdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.close(onClose);
    });
    document.addEventListener('keydown', this._escHandler = (e) => {
      if (e.key === 'Escape') this.close(onClose);
    });
  },

  close(onClose) {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
    document.body.style.overflow = '';
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
    if (onClose) onClose();
  }
};
