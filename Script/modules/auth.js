export function initializeAuth() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        // Show sign in modal on page load if not logged in
        setTimeout(() => {
            openAuthModal("signInModal");
        }, 500);
    } else {
        // User is logged in, display profile
        displayUserProfile(JSON.parse(currentUser));
    }

    // Close modals with Escape key
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllAuthModals();
        }
    });

    // Sign In Form Handler
    const signInForm = document.getElementById("signInForm");
    if (signInForm) {
        signInForm.addEventListener("submit", handleSignIn);
    }

    // Sign Up Form Handler
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
        signUpForm.addEventListener("submit", handleSignUp);
        // Password strength indicator
        const signUpPassword = document.getElementById("signUpPassword");
        if (signUpPassword) {
            signUpPassword.addEventListener("input", checkPasswordStrength);
        }
    }

    // Forgot Password Form Handler
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", handleForgotPassword);
    }
}

// ============ MODAL FUNCTIONS ============

window.openAuthModal = function(modalId) {
    closeAllAuthModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
};

window.closeAuthModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
};

window.switchAuthModal = function(targetModalId) {
    closeAllAuthModals();
    const modal = document.getElementById(targetModalId);
    if (modal) {
        modal.classList.add("active");
    }
};

function closeAllAuthModals() {
    document.querySelectorAll(".auth-modal").forEach((modal) => {
        modal.classList.remove("active");
    });
    document.body.style.overflow = "auto";
}

// ============ SIGN IN HANDLER ============

async function handleSignIn(e) {
    e.preventDefault();
    clearErrors("signIn");

    const email = document.getElementById("signInEmail").value.trim();
    const password = document.getElementById("signInPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Validation
    if (!validateEmail(email)) {
        showError("signInEmail", "Please enter a valid email address");
        return;
    }

    if (password.length < 6) {
        showError("signInPassword", "Password must be at least 6 characters");
        return;
    }

    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showError("signInPassword", "Invalid email or password");
            return;
        }

        // Store user session
        const userData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));

        if (rememberMe) {
            localStorage.setItem("rememberEmail", email);
        }

        // Show success and close modal
        showAuthSuccess("Welcome back, " + user.fullName + "!", 1500);

        setTimeout(() => {
            closeAuthModal("signInModal");
            displayUserProfile(userData);
            // Reset form
            document.getElementById("signInForm").reset();
        }, 1500);

    } catch (error) {
        console.error("Sign in error:", error);
        showError("signInPassword", "An error occurred. Please try again.");
    }
}

// ============ SIGN UP HANDLER ============

async function handleSignUp(e) {
    e.preventDefault();
    clearErrors("signUp");

    const fullName = document.getElementById("signUpFullName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const phone = document.getElementById("signUpPhone").value.trim();
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("signUpConfirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    // Validation
    if (fullName.length < 3) {
        showError("signUpFullName", "Full name must be at least 3 characters");
        return;
    }

    if (!validateEmail(email)) {
        showError("signUpEmail", "Please enter a valid email address");
        return;
    }

    if (phone.length < 10) {
        showError("signUpPhone", "Please enter a valid phone number");
        return;
    }

    if (password.length < 6) {
        showError("signUpPassword", "Password must be at least 6 characters");
        return;
    }

    if (password !== confirmPassword) {
        showError("signUpConfirmPassword", "Passwords do not match");
        return;
    }

    if (!agreeTerms) {
        showError("agreeTerms", "You must agree to the Terms of Service");
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === email)) {
        showError("signUpEmail", "This email is already registered");
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        phone,
        password,
        avatar: generateAvatar(fullName),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto sign in
    const userData = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar
    };

    localStorage.setItem("currentUser", JSON.stringify(userData));

    showAuthSuccess("Account created successfully!", 1500);

    setTimeout(() => {
        closeAuthModal("signUpModal");
        displayUserProfile(userData);
        // Reset form
        document.getElementById("signUpForm").reset();
    }, 1500);
}

// ============ FORGOT PASSWORD HANDLER ============

async function handleForgotPassword(e) {
    e.preventDefault();
    clearErrors("forgot");

    const email = document.getElementById("forgotEmail").value.trim();

    if (!validateEmail(email)) {
        showError("forgotEmail", "Please enter a valid email address");
        return;
    }

    // Check if email exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(u => u.email === email);

    if (!userExists) {
        showError("forgotEmail", "No account found with this email");
        return;
    }

    // Simulate sending email
    showAuthSuccess("Reset link sent to " + email, 3000);

    setTimeout(() => {
        closeAuthModal("forgotPasswordModal");
        document.getElementById("forgotPasswordForm").reset();
    }, 3000);
}

// ============ LOGOUT ============

window.logoutUser = function() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberEmail");

    const dropdown = document.getElementById("userProfileDropdown");
    if (dropdown) {
        dropdown.style.display = "none";
    }

    const authBtns = document.getElementById("authButtons");
    if (authBtns) {
        authBtns.style.display = "flex";
    }

    const userProfileBtn = document.getElementById("userProfileBtn");
    if (userProfileBtn) {
        userProfileBtn.style.display = "none";
    }

    showAuthSuccess("Logged out successfully", 1500);

    // Show sign in modal after logout
    setTimeout(() => {
        openAuthModal("signInModal");
    }, 1500);
};

// ============ UI UPDATES ============

function displayUserProfile(userData) {
    // Hide sign in/up buttons
    const authBtns = document.getElementById("authButtons");
    if (authBtns) {
        authBtns.style.display = "none";
    }

    // Show user profile button
    const userProfileBtn = document.getElementById("userProfileBtn");
    if (userProfileBtn) {
        userProfileBtn.style.display = "flex";
        document.getElementById("profileInitials").textContent = userData.avatar;
    }

    // Update profile dropdown
    const dropdown = document.getElementById("userProfileDropdown");
    if (dropdown) {
        document.getElementById("userAvatar").textContent = userData.avatar;
        document.getElementById("userName").textContent = userData.fullName;
        document.getElementById("userEmail").textContent = userData.email;
        dropdown.style.display = "none";
    }

    // Add toggle for profile dropdown
    if (userProfileBtn && !userProfileBtn.hasListener) {
        userProfileBtn.hasListener = true;
        userProfileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".user-profile-btn") &&
                !e.target.closest(".user-profile-dropdown")) {
                dropdown.style.display = "none";
            }
        });
    }
}

function hideAuthButtons() {
    const authBtns = document.getElementById("authButtons");
    if (authBtns) {
        authBtns.style.display = "none";
    }
}

function showAuthButtons() {
    const authBtns = document.getElementById("authButtons");
    if (authBtns) {
        authBtns.style.display = "flex";
    }
}

// ============ VALIDATION HELPERS ============

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkPasswordStrength() {
    const password = document.getElementById("signUpPassword").value;
    const strengthBar = document.getElementById("passwordStrength");

    if (!strengthBar) return;

    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const bar = document.createElement("div");
    bar.className = "password-strength-bar";

    if (strength <= 2) bar.classList.add("weak");
    else if (strength <= 3) bar.classList.add("fair");
    else bar.classList.add("good");

    strengthBar.innerHTML = "";
    strengthBar.appendChild(bar);
}

function generateAvatar(fullName) {
    const names = fullName.split(" ");
    const initials = names.map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return initials;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "Error");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add("show");
    }
}

function clearErrors(formType) {
    const formId = formType.charAt(0).toUpperCase() + formType.slice(1);
    const modalId = formType === "forgot" ? "forgotPasswordModal" : `sign${formId}Modal`;

    document.querySelectorAll(`#${modalId} .error-message`).forEach(el => {
        el.classList.remove("show");
        el.textContent = "";
    });
}

function showAuthSuccess(message, duration) {
    const notification = document.createElement("div");
    notification.className = "auth-success-notification";
    notification.textContent = "✓ " + message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, duration);
}