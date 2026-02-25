<template>
  <div class="auth-layout">

    <!-- ── Left Brand Panel ─────────────────────────── -->
    <aside class="brand-panel">
      <div class="brand-overlay" />
      <div class="brand-content">
        <!-- Seal placeholder -->
        <div class="seal-ring">
          <div class="seal-inner">
            <span class="seal-torch">🕯</span>
          </div>
        </div>

        <h1 class="brand-title">Leyte Normal<br/>University</h1>
        <p class="brand-sub">LLE Review &amp; Examination System</p>

        <div class="brand-divider" />

        <div class="brand-stats">
          <div class="bstat">
            <span class="bstat-num">2,400+</span>
            <span class="bstat-label">Examinees</span>
          </div>
          <div class="bstat-sep" />
          <div class="bstat">
            <span class="bstat-num">84%</span>
            <span class="bstat-label">Pass Rate</span>
          </div>
          <div class="bstat-sep" />
          <div class="bstat">
            <span class="bstat-num">1921</span>
            <span class="bstat-label">Est.</span>
          </div>
        </div>

        <p class="brand-motto">Integrity · Excellence · Service</p>
      </div>
    </aside>

    <!-- ── Right Form Panel ─────────────────────────── -->
    <main class="form-panel">
      <div class="form-card">

        <div class="form-header">
          <h2 class="form-title">Welcome back</h2>
          <p class="form-desc">Sign in to continue your LLE review</p>
        </div>

        <!-- Error Banner -->
        <div v-if="apiError" class="alert alert-danger">
          {{ apiError }}
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">

          <div class="field-group">
            <label class="field-label">Email Address</label>
            <div class="field-wrap">
              <span class="field-icon">✉</span>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                placeholder="you@lnu.edu.ph"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Password</label>
            <div class="field-wrap">
              <span class="field-icon">🔒</span>
              <input
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                class="field-input"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <button type="button" class="field-toggle" @click="showPw = !showPw">
                {{ showPw ? '🙈' : '👁' }}
              </button>
            </div>
          </div>

          <div class="form-row-between">
            <label class="remember-label">
              <input type="checkbox" v-model="form.remember" class="remember-check" />
              <span>Remember me</span>
            </label>
            <a href="#" class="link-muted">Forgot password?</a>
          </div>

          <button type="submit" class="btn-primary" :class="{ loading: isLoading }">
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="spinner" />
          </button>

        </form>

        <p class="form-footer-text">
          Don't have an account?
          <router-link to="/register" class="link-gold">Create one here</router-link>
        </p>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const form = reactive({ email: '', password: '', remember: false })
const showPw = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const auth = useAuthStore()

async function handleSubmit() {
  apiError.value = ''
  if (!form.email || !form.password) {
    apiError.value = 'Email and password are required.'
    return
  }
  isLoading.value = true
  try {
    await auth.login(form.email, form.password)
  } catch (e) {
    apiError.value = e.response?.data?.message ?? 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.auth-layout {
  display: flex;
  min-height: 100vh;
}

/* ── Brand Panel ─────────────────────────── */
.brand-panel {
  position: relative;
  width: 420px;
  flex-shrink: 0;
  background: var(--lnu-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.18) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.10) 0%, transparent 50%);
  pointer-events: none;
}

/* Decorative circles */
.brand-panel::before,
.brand-panel::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(201,168,76,0.15);
}
.brand-panel::before { width: 500px; height: 500px; top: -120px; right: -180px; }
.brand-panel::after  { width: 350px; height: 350px; bottom: -80px; left: -120px; }

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 32px;
}

.seal-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--lnu-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(201,168,76,0.08);
  box-shadow: 0 0 32px rgba(201,168,76,0.20);
}

.seal-inner {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(201,168,76,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-torch { font-size: 32px; }

.brand-title {
  font-size: 26px;
  font-weight: bold;
  color: var(--lnu-gold-light);
  line-height: 1.25;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  margin-bottom: 28px;
}

.brand-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--lnu-gold), transparent);
  margin: 0 auto 28px;
}

.brand-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 28px;
}

.bstat { text-align: center; }
.bstat-num {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: var(--lnu-gold);
}
.bstat-label {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.bstat-sep {
  width: 1px;
  height: 36px;
  background: rgba(201,168,76,0.25);
}

.brand-motto {
  font-size: 11px;
  color: rgba(201,168,76,0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* ── Form Panel ──────────────────────────── */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--lnu-bg);
}

.form-card {
  width: 100%;
  max-width: 420px;
}

.form-header { margin-bottom: 28px; }

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: var(--lnu-navy);
  margin-bottom: 6px;
}

.form-desc {
  font-size: 14px;
  color: var(--lnu-text-muted);
}

/* Alerts */
.alert {
  border-radius: var(--lnu-radius);
  padding: 12px 16px;
  font-size: 13px;
  margin-bottom: 20px;
}
.alert-danger {
  background: #FFEBEE;
  border-left: 4px solid var(--lnu-danger);
  color: var(--lnu-danger);
}
.alert-success {
  background: #E8F5E9;
  border-left: 4px solid var(--lnu-success);
  color: var(--lnu-success);
}

/* Form fields */
.auth-form { display: flex; flex-direction: column; gap: 20px; }

.field-group { display: flex; flex-direction: column; gap: 7px; }

.field-label {
  font-size: 13px;
  font-weight: bold;
  color: var(--lnu-navy);
  letter-spacing: 0.3px;
}

.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  font-size: 15px;
  pointer-events: none;
  opacity: 0.5;
}

.field-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 2px solid var(--lnu-gray);
  border-radius: var(--lnu-radius);
  background: var(--lnu-white);
  font-size: 14px;
  font-family: Georgia, serif;
  color: var(--lnu-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field-input:focus {
  border-color: var(--lnu-navy);
  box-shadow: 0 0 0 3px rgba(26,35,126,0.10);
}
.field-input::placeholder { color: var(--lnu-gray-dark); }

.field-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.field-toggle:hover { opacity: 1; }

/* Row */
.form-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--lnu-text-muted);
}
.remember-check { accent-color: var(--lnu-navy); }

.link-muted { color: var(--lnu-text-muted); text-decoration: none; font-size: 13px; }
.link-muted:hover { color: var(--lnu-navy); }

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 13px;
  background: var(--lnu-navy);
  color: var(--lnu-gold-light);
  border: none;
  border-radius: var(--lnu-radius);
  font-size: 15px;
  font-family: Georgia, serif;
  font-weight: bold;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}
.btn-primary:hover { background: var(--lnu-navy-light); }
.btn-primary:active { transform: scale(0.99); }
.btn-primary.loading { opacity: 0.75; cursor: not-allowed; }

.spinner {
  display: inline-block;
  width: 18px; height: 18px;
  border: 2px solid rgba(240,208,128,0.3);
  border-top-color: var(--lnu-gold-light);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.form-footer-text {
  text-align: center;
  margin-top: 28px;
  font-size: 13px;
  color: var(--lnu-text-muted);
}
.link-gold { color: var(--lnu-gold); font-weight: bold; text-decoration: none; }
.link-gold:hover { text-decoration: underline; }

/* ── Responsive ──────────────────────────── */
@media (max-width: 768px) {
  .auth-layout { flex-direction: column; }
  .brand-panel { width: 100%; padding: 32px 16px; min-height: unset; }
  .brand-stats { gap: 12px; }
}
</style>
