const AuthModule = {
  render() {
    return `
      <div class="auth-page">
        <div class="auth-banner">
          <div class="auth-banner-content">
            <div class="auth-banner-icon"><i class="fas fa-heartbeat"></i></div>
            <h1>MediCore Hospital Management</h1>
            <p>Complete healthcare management solution. Manage patients, appointments, pharmacy, laboratory, and more with our integrated platform.</p>
            <div style="margin-top:40px;display:flex;gap:16px;justify-content:center;font-size:0.9rem;opacity:0.8">
              <span><i class="fas fa-check-circle"></i> 500+ Hospitals</span>
              <span><i class="fas fa-check-circle"></i> 99.9% Uptime</span>
              <span><i class="fas fa-check-circle"></i> HIPAA Compliant</span>
            </div>
          </div>
        </div>
        <div class="auth-form-container">
          <div class="auth-form-wrapper">
            <div class="auth-logo">
              <div class="auth-logo-icon"><i class="fas fa-hospital"></i></div>
              <span class="auth-logo-text">MediCore</span>
            </div>
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Sign in to your account to continue</p>
            <form class="auth-form" id="loginForm">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="loginEmail" placeholder="Enter your email" value="admin@medicore.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="password-input-wrapper">
                  <input type="password" class="form-input" id="loginPassword" placeholder="Enter your password" value="Admin123!" required>
                  <span class="password-toggle" id="passwordToggle"><i class="fas fa-eye"></i></span>
                </div>
              </div>
              <div class="auth-options">
                <label class="remember-me"><input type="checkbox" checked> Remember me</label>
                <a href="#" class="forgot-password" onclick="event.preventDefault();NotificationCenter.info('Password reset link sent to your email')">Forgot password?</a>
              </div>
              <button type="submit" class="btn btn-primary btn-xl" style="width:100%;justify-content:center">
                <span id="loginBtnText">Sign In</span>
                <i class="fas fa-spinner animate-spin" id="loginSpinner" style="display:none"></i>
              </button>
            </form>
            <div class="auth-divider">or continue with</div>
            <div class="social-login">
              <button class="social-btn" onclick="NotificationCenter.info('Google login coming soon')"><i class="fab fa-google"></i> Google</button>
              <button class="social-btn" onclick="NotificationCenter.info('Microsoft login coming soon')"><i class="fab fa-microsoft"></i> Microsoft</button>
            </div>
            <p class="auth-footer">
              <span>Demo credentials pre-filled. </span>
              <a href="#" onclick="event.preventDefault();document.getElementById('loginEmail').value='admin@medicore.com';document.getElementById('loginPassword').value='Admin123!';">Use Admin</a> |
              <a href="#" onclick="event.preventDefault();document.getElementById('loginEmail').value='doctor@medicore.com';document.getElementById('loginPassword').value='Doctor123!';">Use Doctor</a> |
              <a href="#" onclick="event.preventDefault();document.getElementById('loginEmail').value='reception@medicore.com';document.getElementById('loginPassword').value='Reception123!';">Use Reception</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('passwordToggle')?.addEventListener('click', function() {
      const input = document.getElementById('loginPassword');
      const icon = this.querySelector('i');
      if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
      else { input.type = 'password'; icon.className = 'fas fa-eye'; }
    });

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const btnText = document.getElementById('loginBtnText');
      const spinner = document.getElementById('loginSpinner');

      btnText.textContent = 'Signing in...';
      spinner.style.display = 'inline-block';

      setTimeout(() => {
        const user = Store.login(email, password);
        if (user) {
          NotificationCenter.success('Welcome back, ' + user.name + '!');
          Router.navigate('dashboard');
        } else {
          NotificationCenter.error('Invalid email or password');
          btnText.textContent = 'Sign In';
          spinner.style.display = 'none';
        }
      }, 800);
    });
  }
};
