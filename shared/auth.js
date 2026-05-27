const FRONTEND_DEMO_USERS = {
  "owner@trenzosretail.com": {
    password: "Trenzos@123",
    role: "owner"
  },

  "manager@trenzosretail.com": {
    password: "Trenzos@123",
    role: "manager"
  },

  "cashier@trenzosretail.com": {
    password: "Trenzos@123",
    role: "cashier"
  },

  "staff@trenzosretail.com": {
    password: "Trenzos@123",
    role: "staff"
  }
};

function showElement(element) {
  if (element) element.classList.remove("hidden");
}

function hideElement(element) {
  if (element) element.classList.add("hidden");
}

function hydrateRememberedDevice() {
  const remembered = getRememberedDevice();

  if (!remembered) return;

  const roleInput = document.getElementById("role");
  const branchInput = document.getElementById("branch");
  const emailInput = document.getElementById("email");
  const rememberInput = document.getElementById("rememberDevice");

  if (roleInput) roleInput.value = remembered.role;
  if (branchInput) branchInput.value = remembered.branch;
  if (emailInput) emailInput.value = remembered.email;
  if (rememberInput) rememberInput.checked = true;
}

function handlePasswordToggle() {
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  if (!toggle || !password) return;

  toggle.addEventListener("click", () => {
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    toggle.textContent = isPassword ? "Hide" : "Show";
  });
}

function handleLoginForm() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  const alertBox = document.getElementById("loginAlert");
  const alertText = document.getElementById("loginAlertText");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    hideElement(alertBox);

    const role = document.getElementById("role").value;
    const branch = document.getElementById("branch").value;
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const rememberDevice = document.getElementById("rememberDevice").checked;

    const user = FRONTEND_DEMO_USERS[email];

    if (!user || user.password !== password) {
      if (alertText) alertText.textContent = "Invalid email or password.";
      showElement(alertBox);
      return;
    }

    if (user.role !== role) {
      if (alertText) alertText.textContent = "Selected role does not match the authenticated account.";
      showElement(alertBox);
      return;
    }

    if (!canRoleUseBranch(role, branch)) {
      if (alertText) alertText.textContent = "Only Owner can use Select All branch access.";
      showElement(alertBox);
      return;
    }

    const session = createSecureSession({
      role,
      branch,
      email,
      rememberDevice
    });

    window.location.href = session.redirect;
  });
}

function handleForgotPasswordForm() {
  const form = document.getElementById("forgotPasswordForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("recoveryEmail").value.trim().toLowerCase();
    const role = document.getElementById("recoveryRole").value;

    startRecoverySession({ email, role });

    window.location.href = "verify-otp.html";
  });
}

function hydrateOtpInputs() {
  const inputs = Array.from(document.querySelectorAll(".otp-input"));

  if (!inputs.length) return;

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");

      if (input.value && inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && inputs[index - 1]) {
        inputs[index - 1].focus();
      }
    });
  });
}

function handleVerifyOtpForm() {
  const form = document.getElementById("verifyOtpForm");

  if (!form) return;

  const alertBox = document.getElementById("otpAlert");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    hideElement(alertBox);

    const otp = Array.from(document.querySelectorAll(".otp-input"))
      .map((input) => input.value)
      .join("");

    if (otp !== "123456") {
      showElement(alertBox);
      return;
    }

    markOtpVerified();
    window.location.href = "reset-password.html";
  });
}

function handleResetPasswordForm() {
  const form = document.getElementById("resetPasswordForm");

  if (!form) return;

  const alertBox = document.getElementById("resetAlert");
  const alertText = document.getElementById("resetAlertText");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    hideElement(alertBox);

    const recovery = getRecoverySession();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!recovery || !recovery.otpVerified) {
      if (alertText) alertText.textContent = "OTP verification is required before resetting password.";
      showElement(alertBox);
      return;
    }

    if (newPassword.length < 8) {
      if (alertText) alertText.textContent = "Password must be at least 8 characters.";
      showElement(alertBox);
      return;
    }

    if (newPassword !== confirmPassword) {
      if (alertText) alertText.textContent = "Passwords do not match.";
      showElement(alertBox);
      return;
    }

    clearRecoverySession();
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateRememberedDevice();
  handlePasswordToggle();
  handleLoginForm();
  handleForgotPasswordForm();
  hydrateOtpInputs();
  handleVerifyOtpForm();
  handleResetPasswordForm();
});
function loginUser(email, password) {
    const user = FRONTEND_DEMO_USERS[email];

    if (user && user.password === password) {

        localStorage.setItem("loggedInUser", JSON.stringify({
            email: email,
            role: user.role
        }));

        if (user.role === "owner") {
    window.location.href = "owner/dashboard.html";
}

else if (user.role === "manager") {
    window.location.href = "manager/dashboard.html";
}

else if (user.role === "cashier") {
    window.location.href = "pos.html";
}

else if (user.role === "staff") {
    window.location.href = "staff.html";
}

 if (user.role === "owner") {
    window.location.href = "owner/dashboard.html";
}

else if (user.role === "manager") {
    window.location.href = "manager/dashboard.html";
}

else {
    alert("Invalid Email or Password");
}

}

}

