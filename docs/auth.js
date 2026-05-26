// Authentication Manager

class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.otpStore = {};
        this.initializeFirstAdmin();
    }

    initializeFirstAdmin() {
        if (this.users.length === 0) {
            const adminUser = {
                id: 1,
                name: "Dr. Abhijit Reang",
                email: "admin@arofficial.com",
                isAdmin: true,
                avatar: this.generateAvatar("Dr. Abhijit Reang"),
                createdAt: new Date().toISOString()
            };
            this.users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    generateAvatar(name) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=100`;
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    requestOTP(name, email) {
        // Validate inputs
        if (!name.trim() || !email.trim()) {
            return { success: false, message: "Please enter name and email" };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, message: "Please enter a valid email" };
        }

        const otp = this.generateOTP();
        this.otpStore[email] = {
            otp,
            timestamp: Date.now(),
            name,
            attempts: 0
        };

        // In production, this would send an email via a backend service
        console.log(`%c🔐 OTP for ${email}: ${otp}`, 'color: #667eea; font-weight: bold; font-size: 14px;');
        alert(`Demo OTP: ${otp}\n\nIn production, this would be sent to ${email}`);

        return { success: true, message: "OTP sent successfully", otp };
    }

    verifyOTP(email, otp) {
        if (!this.otpStore[email]) {
            return { success: false, message: "Please request OTP first" };
        }

        const stored = this.otpStore[email];
        const now = Date.now();
        const expiryTime = 10 * 60 * 1000; // 10 minutes

        // Check if OTP has expired
        if (now - stored.timestamp > expiryTime) {
            delete this.otpStore[email];
            return { success: false, message: "OTP has expired. Please request a new one." };
        }

        // Check max attempts
        if (stored.attempts >= 3) {
            delete this.otpStore[email];
            return { success: false, message: "Too many attempts. Please request a new OTP." };
        }

        // Verify OTP
        if (stored.otp !== otp.toString()) {
            stored.attempts++;
            const remaining = 3 - stored.attempts;
            return {
                success: false,
                message: `Invalid OTP. ${remaining} attempts remaining.`
            };
        }

        // OTP is valid, create or update user
        let user = this.users.find(u => u.email === email);

        if (!user) {
            user = {
                id: this.users.length + 1,
                name: stored.name,
                email,
                isAdmin: false,
                avatar: this.generateAvatar(stored.name),
                createdAt: new Date().toISOString()
            };
            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
        } else {
            // Update user info if provided
            user.name = stored.name;
            user.avatar = this.generateAvatar(stored.name);
            const index = this.users.findIndex(u => u.email === email);
            this.users[index] = user;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // Clear OTP
        delete this.otpStore[email];

        // Set current user and save to localStorage
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        return { success: true, message: "Login successful", user };
    }

    login(name, email, otp) {
        return this.verifyOTP(email, otp);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        return { success: true, message: "Logged out successfully" };
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.users;
    }
}

// Initialize Auth Manager globally
const authManager = new AuthManager();

// Modal Management
function openAuthModal() {
    const modal = document.getElementById('authModal');
    const emailStep = document.getElementById('emailStep');
    modal.style.display = 'block';
    emailStep.style.display = 'block';
    document.getElementById('otpStep').style.display = 'none';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.getElementById('userNameInput').value = '';
    document.getElementById('userEmailInput').value = '';
    document.getElementById('otpInput').value = '';
}

// Modal close button
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.modal-close');

    closeBtn.onclick = closeAuthModal;

    window.onclick = function (event) {
        if (event.target == modal) {
            closeAuthModal();
        }
    };
});

// Auth Button Handlers
document.addEventListener('DOMContentLoaded', () => {
    const requestOtpBtn = document.getElementById('requestOtpBtn');
    const loginBtn = document.getElementById('loginBtn');

    requestOtpBtn.addEventListener('click', handleRequestOTP);
    loginBtn.addEventListener('click', handleVerifyOTP);

    // Update profile display
    updateProfileDisplay();
});

function handleRequestOTP() {
    const name = document.getElementById('userNameInput').value.trim();
    const email = document.getElementById('userEmailInput').value.trim();

    if (!name || !email) {
        alert('Please enter both name and email');
        return;
    }

    const result = authManager.requestOTP(name, email);

    if (result.success) {
        // Show OTP step
        document.getElementById('emailStep').style.display = 'none';
        document.getElementById('otpStep').style.display = 'block';
        document.getElementById('userNameForOTP').textContent = name;
    } else {
        alert(result.message);
    }
}

function handleVerifyOTP() {
    const email = document.getElementById('userEmailInput').value.trim();
    const otp = document.getElementById('otpInput').value.trim();

    if (!otp || otp.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    const result = authManager.login(
        document.getElementById('userNameInput').value,
        email,
        otp
    );

    if (result.success) {
        alert('Login successful! Welcome ' + result.user.name);
        closeAuthModal();
        updateProfileDisplay();
        showAdminDashboard();
        location.reload();
    } else {
        alert(result.message);
    }
}

function updateProfileDisplay() {
    const authBtnGroup = document.getElementById('authBtnGroup');
    const userProfileDiv = document.getElementById('userProfile');

    if (authManager.isLoggedIn()) {
        const user = authManager.currentUser;

        authBtnGroup.style.display = 'none';
        userProfileDiv.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar-small">
            <span style="color: white; font-weight: 600; font-size: 0.9rem;">${user.name}</span>
            ${user.isAdmin ? '<span style="background-color: rgba(255, 193, 7, 0.8); color: #333; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.75rem; font-weight: 700;">ADMIN</span>' : ''}
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authBtnGroup.style.display = 'flex';
        userProfileDiv.innerHTML = '';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        updateProfileDisplay();
        hideAdminDashboard();
        location.reload();
    }
}

function showAdminDashboard() {
    if (authManager.isAdmin()) {
        const adminDashboard = document.getElementById('adminDashboard');
        adminDashboard.classList.add('show');
    }
}

function hideAdminDashboard() {
    const adminDashboard = document.getElementById('adminDashboard');
    adminDashboard.classList.remove('show');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProfileDisplay();
    if (authManager.isAdmin()) {
        showAdminDashboard();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
    }
});

// Auto-fill OTP in demo mode (optional)
document.addEventListener('DOMContentLoaded', () => {
    const otpInput = document.getElementById('otpInput');
    otpInput.addEventListener('input', function () {
        // Auto-submit if 6 digits entered
        if (this.value.length === 6) {
            // Optional: auto-submit
            // handleVerifyOTP();
        }
    });
});

// Session check
setInterval(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && authManager.isLoggedIn()) {
        authManager.logout();
        updateProfileDisplay();
    } else if (currentUser && !authManager.isLoggedIn()) {
        authManager.currentUser = JSON.parse(currentUser);
        updateProfileDisplay();
    }
}, 1000);
