/**
 * SECUREAUTH SYSTEM - STATIC FRONTEND CONTROLLER (NO BACKEND REQUIRED)
 * Persists data inside browser LocalStorage for dynamic internship presentation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION & DUMMY DEMO USER INITIALIZATION ---
    const DUMMY_USER = {
        name: "Administrator Demo",
        email: "admin@secureauth.com",
        username: "admin",
        password: "Password123!",
        joined: "June 01, 2026"
    };

    // Initialize LocalStorage Database if empty
    if (!localStorage.getItem('secure_auth_users')) {
        localStorage.setItem('secure_auth_users', JSON.stringify([DUMMY_USER]));
    }

    // --- 2. NOTIFICATION ALERT SYSTEM ---
    const alertsContainer = document.getElementById('alerts-container');

    window.showAlert = function(message, type = 'info') {
        if (!alertsContainer) return;

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} fade-in`;
        alertDiv.role = 'alert';

        let icon = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'danger') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

        alertDiv.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-message">${message}</div>
            <button class="alert-close-btn" onclick="this.parentElement.remove();" aria-label="Close alert">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        alertsContainer.appendChild(alertDiv);

        // Auto-dismiss alert after 4 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => alertDiv.remove(), 250);
        }, 4000);
    };

    // Check for pending notifications from redirects
    const pendingMsg = localStorage.getItem('auth_notification');
    if (pendingMsg) {
        const notification = JSON.parse(pendingMsg);
        showAlert(notification.message, notification.type);
        localStorage.removeItem('auth_notification');
    }

    // Helper to queue an alert prior to site redirection
    function queueAlertRedirect(message, type, targetUrl) {
        localStorage.setItem('auth_notification', JSON.stringify({ message, type }));
        window.location.href = targetUrl;
    }

    // --- 3. REUSABLE PASSWORD MASK TOGGLER ---
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        const eyeShow = passwordToggle.querySelector('.eye-show');
        
        passwordToggle.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeShow.className = 'fa-solid fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                eyeShow.className = 'fa-solid fa-eye';
            }
        });
    }

    // --- 4. REAL-TIME PASSWORD STRENGTH INDICATOR ---
    const strengthContainer = document.getElementById('strength-container');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            
            if (password.length === 0) {
                strengthContainer.style.display = 'none';
                return;
            }
            
            strengthContainer.style.display = 'block';
            
            // Check complexity entropy
            let score = 0;
            if (password.length >= 8) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/\d/.test(password)) score++;
            if (/[@$!%*?&#]/.test(password)) score++;
            
            // Map scores to indicators
            let barWidth = '0%';
            let barColor = '';
            let textValue = 'Too Weak';
            
            switch (score) {
                case 1:
                    barWidth = '20%';
                    barColor = '#ef4444'; // Red
                    textValue = 'Very Weak';
                    break;
                case 2:
                    barWidth = '40%';
                    barColor = '#f97316'; // Orange
                    textValue = 'Weak';
                    break;
                case 3:
                    barWidth = '60%';
                    barColor = '#eab308'; // Yellow
                    textValue = 'Medium';
                    break;
                case 4:
                    barWidth = '80%';
                    barColor = '#3b82f6'; // Blue
                    textValue = 'Strong';
                    break;
                case 5:
                    barWidth = '100%';
                    barColor = '#10b981'; // Emerald Green
                    textValue = 'Excellent!';
                    break;
                default:
                    barWidth = '0%';
                    barColor = '#ef4444';
                    textValue = 'Too Weak';
            }
            
            strengthBar.style.width = barWidth;
            strengthBar.style.backgroundColor = barColor;
            strengthText.textContent = `Strength: ${textValue}`;
            strengthText.style.color = barColor;
        });
    }

    // --- 5. REAL-TIME CONFIRMATION MATCH CHECKER ---
    const confirmInput = document.getElementById('confirm_password');
    const matchContainer = document.getElementById('match-container');
    const matchText = document.getElementById('match-text');

    if (passwordInput && confirmInput && matchContainer && matchText) {
        confirmInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (confirm.length === 0) {
                matchContainer.style.display = 'none';
                confirmInput.className = 'form-control';
                return;
            }
            
            matchContainer.style.display = 'block';
            
            if (password === confirm) {
                matchText.className = 'match-text match-success';
                matchText.innerHTML = '<i class="fa-solid fa-circle-check"></i> Passwords match';
                confirmInput.className = 'form-control is-valid';
            } else {
                matchText.className = 'match-text match-error';
                matchText.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Passwords do not match';
                confirmInput.className = 'form-control is-invalid';
            }
        });
    }

    // --- 6. SECURE NAVIGATION BAR ROUTER CHECK ---
    const activeSession = JSON.parse(localStorage.getItem('active_session'));
    
    // Update Header Navigation elements depending on session state
    const headerNavLinks = document.getElementById('header-nav-links');
    if (headerNavLinks) {
        if (activeSession) {
            headerNavLinks.innerHTML = `
                <li><a href="dashboard.html" class="nav-item"><i class="fa-solid fa-chart-line"></i> Dashboard</a></li>
                <li><a href="#" id="logout-nav-link" class="nav-item btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
            `;
            // Bind header logout listener
            document.getElementById('logout-nav-link').addEventListener('click', handleLogout);
        } else {
            headerNavLinks.innerHTML = `
                <li><a href="login.html" class="nav-item"><i class="fa-solid fa-lock"></i> Login</a></li>
                <li><a href="register.html" class="nav-item nav-btn-register"><i class="fa-solid fa-user-plus"></i> Register</a></li>
            `;
        }
    }

    // --- 7. LOGOUT CONTROL PROCESS ---
    function handleLogout(e) {
        if (e) e.preventDefault();
        localStorage.removeItem('active_session');
        queueAlertRedirect("You have been logged out successfully.", "info", "login.html");
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // --- 8. REGISTRATION VIEW CONTROLLER ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            // Clean visual cues
            document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
            
            // Client Validation Checks
            if (!name || !email || !username || !password || !confirmPassword) {
                showAlert("Please fill in all input fields.", "danger");
                return;
            }

            if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
                showAlert("Username must be 3-20 alphanumeric characters or underscores.", "danger");
                document.getElementById('username').classList.add('is-invalid');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert("Invalid email address format.", "danger");
                document.getElementById('email').classList.add('is-invalid');
                return;
            }

            if (password.length < 8) {
                showAlert("Password must be at least 8 characters long for secure presentation.", "danger");
                document.getElementById('password').classList.add('is-invalid');
                return;
            }

            if (password !== confirmPassword) {
                showAlert("Passwords do not match.", "danger");
                document.getElementById('confirm_password').classList.add('is-invalid');
                return;
            }

            // Database Scanning (LocalStorage)
            const users = JSON.parse(localStorage.getItem('secure_auth_users')) || [];
            
            const emailExists = users.some(u => u.email === email);
            const usernameExists = users.some(u => u.username === username);

            if (emailExists) {
                showAlert("Email is already registered.", "danger");
                document.getElementById('email').classList.add('is-invalid');
                return;
            }

            if (usernameExists) {
                showAlert("Username is already taken.", "danger");
                document.getElementById('username').classList.add('is-invalid');
                return;
            }

            // Create and append user
            const joinedDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const newUser = { name, email, username, password, joined: joinedDate };
            users.push(newUser);
            localStorage.setItem('secure_auth_users', JSON.stringify(users));

            // Redirect back to login with success message
            queueAlertRedirect("Your account has been created successfully! You can now log in using your demo credentials.", "success", "login.html");
        });
    }

    // --- 9. LOGIN VIEW CONTROLLER ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const identifier = document.getElementById('username_or_email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            
            if (!identifier || !password) {
                showAlert("Please enter both username/email and password.", "danger");
                return;
            }

            const users = JSON.parse(localStorage.getItem('secure_auth_users')) || [];
            
            // Resolve User
            const user = users.find(u => u.username === identifier || u.email === identifier);
            
            if (user && user.password === password) {
                // Successful Login Session
                const sessionPayload = {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    joined: user.joined,
                    loginTime: new Date().toLocaleTimeString()
                };
                
                localStorage.setItem('active_session', JSON.stringify(sessionPayload));
                queueAlertRedirect(`Welcome back, ${user.name}! Access granted.`, "success", "dashboard.html");
            } else {
                showAlert("Invalid username/email or password.", "danger");
                document.getElementById('username_or_email').classList.add('is-invalid');
                document.getElementById('password').classList.add('is-invalid');
            }
        });
    }

    // --- 10. DASHBOARD DETAILS POPULATER ---
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        // Enforce session access control
        if (!activeSession) {
            queueAlertRedirect("Access denied. Please login to view the dashboard.", "danger", "login.html");
            return;
        }

        // Populate elements dynamically
        document.getElementById('welcome-user-name').textContent = activeSession.name;
        document.getElementById('profile-full-name').textContent = activeSession.name;
        document.getElementById('profile-email').textContent = activeSession.email;
        document.getElementById('profile-username').textContent = `@${activeSession.username}`;
        document.getElementById('profile-joined').textContent = activeSession.joined;

        // Dynamic mock audit logging
        const logsList = document.getElementById('session-logs-list');
        if (logsList) {
            logsList.innerHTML = `
                <div class="log-item">
                    <span class="log-event">Session Initialized Successfully</span>
                    <span class="log-time">Local Time: ${activeSession.loginTime} | Device: Local Browser</span>
                </div>
                <div class="log-item">
                    <span class="log-event">Dynamic Security Verification OK</span>
                    <span class="log-time">Checked LocalStorage security token indexes</span>
                </div>
                <div class="log-item">
                    <span class="log-event">Presentation Dummy Database Binding</span>
                    <span class="log-time">Stored payload securely within script scopes</span>
                </div>
            `;
        }
    }
});
