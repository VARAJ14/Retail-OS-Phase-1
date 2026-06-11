const SESSION_KEY = "trenzos_retail_session";
const REMEMBER_DEVICE_KEY = "trenzos_retail_remembered_device";
const RECOVERY_KEY = "trenzos_retail_recovery";

function createSecureSession({ role, branch, email, rememberDevice }) {
  const roleConfig = getRoleConfig(role);
  const branchConfig = getBranchConfig(branch);

  const session = {
    active: true,
    encrypted: true,
    ssl: true,
    tokenType: "frontend-session",
    sessionId: `trenzos-${role}-${Date.now()}`,
    role,
    roleLabel: roleConfig.label,
    branch,
    branchLabel: branchConfig.label,
    branchCode: branchConfig.code,
    email,
    permissions: roleConfig.permissions,
    redirect: roleConfig.redirect,
    startedAt: new Date().toISOString()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  if (rememberDevice) {
    localStorage.setItem(REMEMBER_DEVICE_KEY, JSON.stringify({
      remembered: true,
      role,
      branch,
      email,
      rememberedAt: new Date().toISOString()
    }));
  }

  return session;
}

function getCurrentSession() {
  const rawSession = sessionStorage.getItem(SESSION_KEY);

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    return null;
  }
}

function clearCurrentSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getRememberedDevice() {
  const rawDevice = localStorage.getItem(REMEMBER_DEVICE_KEY);

  if (!rawDevice) return null;

  try {
    return JSON.parse(rawDevice);
  } catch {
    return null;
  }
}

function startRecoverySession({ email, role }) {
  const recovery = {
    email,
    role,
    otpVerified: false,
    expiresAt: Date.now() + 10 * 60 * 1000
  };

  sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(recovery));

  return recovery;
}

function getRecoverySession() {
  const rawRecovery = sessionStorage.getItem(RECOVERY_KEY);

  if (!rawRecovery) return null;

  try {
    return JSON.parse(rawRecovery);
  } catch {
    return null;
  }
}

function markOtpVerified() {
  const recovery = getRecoverySession();

  if (!recovery) return null;

  recovery.otpVerified = true;
  sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(recovery));

  return recovery;
}

function clearRecoverySession() {
  sessionStorage.removeItem(RECOVERY_KEY);
}
window.createSecureSession = createSecureSession;
window.getCurrentSession = getCurrentSession;
window.clearCurrentSession = clearCurrentSession;

window.getRememberedDevice = getRememberedDevice;

window.startRecoverySession = startRecoverySession;
window.getRecoverySession = getRecoverySession;
window.markOtpVerified = markOtpVerified;
window.clearRecoverySession = clearRecoverySession;