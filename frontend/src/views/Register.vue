<template>
  <div class="auth-layout">

    <!-- ── Left Brand Panel ─────────────────────────── -->
    <aside class="brand-panel">
      <div class="brand-overlay" />
      <div class="brand-content">
        <div class="seal-ring">
          <div class="seal-inner">
            <span class="seal-torch">🕯</span>
          </div>
        </div>

        <h1 class="brand-title">Join the LNU<br/>LLE Community</h1>
        <p class="brand-sub">Create your account and start your review journey</p>

        <div class="brand-divider" />

        <div class="feature-list">
          <div class="feature-item" v-for="f in features" :key="f.text">
            <span class="feature-icon">{{ f.icon }}</span>
            <span class="feature-text">{{ f.text }}</span>
          </div>
        </div>

        <p class="brand-motto">Integrity · Excellence · Service</p>
      </div>
    </aside>

    <!-- ── Right Form Panel ─────────────────────────── -->
    <main class="form-panel">
      <div class="form-card">

        <div class="form-header">
          <h2 class="form-title">Create Account</h2>
          <p class="form-desc">Fill in your details to register as a reviewer</p>
        </div>

        <!-- Error Banner -->
        <div v-if="apiError" class="alert alert-danger">
          {{ apiError }}
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">

          <!-- Full Name -->
          <div class="field-group">
            <label class="field-label">Full Name</label>
            <div class="field-wrap">
              <span class="field-icon">👤</span>
              <input
                v-model="form.name"
                type="text"
                class="field-input"
                placeholder="e.g. Juan dela Cruz"
                autocomplete="name"
              />
            </div>
          </div>

          <!-- Email -->
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

          <!-- Role -->
          <div class="field-group">
            <label class="field-label">Role</label>
            <div class="field-wrap select-wrap">
              <span class="field-icon">🎓</span>
              <select v-model="form.role" class="field-input field-select">
                <option value="" disabled>Select your role</option>
                <option value="student">Student Reviewer</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <!-- Two-column: Password & Confirm -->
          <div class="field-row-2">
            <div class="field-group">
              <label class="field-label">Password</label>
              <div class="field-wrap">
                <span class="field-icon">🔒</span>
                <input
                  v-model="form.password"
                  :type="showPw ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Min. 8 characters"
                  autocomplete="new-password"
                />
                <button type="button" class="field-toggle" @click="showPw = !showPw">
                  {{ showPw ? '🙈' : '👁' }}
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Confirm Password</label>
              <div class="field-wrap">
                <span class="field-icon">🔒</span>
                <input
                  v-model="form.password_confirmation"
                  :type="showPw ? 'text' : 'password'"
                  class="field-input"
                  :class="{ 'input-mismatch': pwMismatch }"
                  placeholder="Re-enter password"
                  autocomplete="new-password"
                />
              </div>
              <span v-if="pwMismatch" class="field-error">Passwords do not match</span>
            </div>
          </div>

          <!-- Password strength bar -->
          <div v-if="form.password" class="pw-strength">
            <div class="pw-bar">
              <div
                class="pw-fill"
                :style="{ width: pwStrength.pct + '%', background: pwStrength.color }"
              />
            </div>
            <span class="pw-label" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</span>
          </div>

          <!-- Terms -->
          <label class="terms-label">
            <input type="checkbox" v-model="form.agreed" class="remember-check" />
            <span>I agree to the <a href="#" class="link-gold">Terms of Use</a> and <a href="#" class="link-gold">Privacy Policy</a></span>
          </label>

          <button type="submit" class="btn-primary" :class="{ loading: isLoading }">
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="spinner" />
          </button>

        </form>

        <p class="form-footer-text">
          Already have an account?
          <router-link to="/login" class="link-gold">Sign in here</router-link>
        </p>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const form = reactive({
  name: '',
  email: '',
  role: '',
  password: '',
  password_confirmation: '',
  agreed: false,
})

const showPw = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const auth = useAuthStore()

const features = [
  { icon: '📝', text: 'Full-length LLE mock exams' },
  { icon: '📊', text: 'AI-powered pass probability score' },
  { icon: '📈', text: 'Subject analytics & weak spot detection' },
  { icon: '🎯', text: 'DSS-guided study recommendations' },
]

const pwMismatch = computed(() =>
  form.password_confirmation.length > 0 &&
  form.password !== form.password_confirmation
)

const pwStrength = computed(() => {
  const pw = form.password
  if (pw.length < 6)  return { pct: 20, color: '#C62828', label: 'Weak' }
  if (pw.length < 10) return { pct: 55, color: '#F57F17', label: 'Fair' }
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { pct: 100, color: '#2E7D32', label: 'Strong' }
  return { pct: 75, color: '#C9A84C', label: 'Good' }
})

async function handleSubmit() {
  apiError.value = ''
  if (!form.name || !form.email || !form.password || !form.password_confirmation) {
    apiError.value = 'Please complete all required fields.'
    return
  }
  if (pwMismatch.value) {
    apiError.value = 'Passwords do not match.'
    return
  }
  if (!form.agreed) {
    apiError.value = 'Please agree to the Terms of Use.'
    return
  }
  isLoading.value = true
  try {
    await auth.register(form.name, form.email, form.password, form.password_confirmation)
  } catch (e) {
    apiError.value = e.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ── Layout (shared with Login) ────────────── */
.auth-layout {
  display: flex;
  min-height: 100vh;
}

/* ── Brand Panel ─────────────────────────── */
.brand-panel {
  position: relative;
  width: 400px;
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
  width: 90px; height: 90px;
  border-radius: 50%;
  border: 3px solid var(--lnu-gold);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  background: rgba(201,168,76,0.08);
  box-shadow: 0 0 32px rgba(201,168,76,0.20);
}
.seal-inner {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(201,168,76,0.15);
  display: flex; align-items: center; justify-content: center;
}
.seal-torch { font-size: 28px; }

.brand-title {
  font-size: 23px; font-weight: bold;
  color: var(--lnu-gold-light);
  line-height: 1.3; margin-bottom: 8px;
}
.brand-sub {
  font-size: 13px; color: rgba(255,255,255,0.5);
  margin-bottom: 24px;
}
.brand-divider {
  width: 60px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--lnu-gold), transparent);
  margin: 0 auto 24px;
}

/* Feature list */
.feature-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; text-align: left; }
.feature-item { display: flex; align-items: flex-start; gap: 10px; }
.feature-icon { font-size: 16px; flex-shrink: 0; margin-top: 2px; }
.feature-text { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; }

.brand-motto {
  font-size: 11px; color: rgba(201,168,76,0.6);
  letter-spacing: 2px; text-transform: uppercase;
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
  max-width: 480px;
}

.form-header { margin-bottom: 24px; }
.form-title { font-size: 26px; font-weight: bold; color: var(--lnu-navy); margin-bottom: 6px; }
.form-desc { font-size: 14px; color: var(--lnu-text-muted); }

.alert {
  border-radius: var(--lnu-radius); padding: 12px 16px;
  font-size: 13px; margin-bottom: 18px;
}
.alert-danger { background: #FFEBEE; border-left: 4px solid var(--lnu-danger); color: var(--lnu-danger); }
.alert-success { background: #E8F5E9; border-left: 4px solid var(--lnu-success); color: var(--lnu-success); }

.auth-form { display: flex; flex-direction: column; gap: 18px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: bold; color: var(--lnu-navy); }

.field-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-wrap { position: relative; display: flex; align-items: center; }
.field-icon { position: absolute; left: 14px; font-size: 14px; pointer-events: none; opacity: 0.45; }

.field-input {
  width: 100%;
  padding: 11px 16px 11px 42px;
  border: 2px solid var(--lnu-gray);
  border-radius: var(--lnu-radius);
  background: var(--lnu-white);
  font-size: 14px;
  font-family: Georgia, serif;
  color: var(--lnu-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}
.field-input:focus {
  border-color: var(--lnu-navy);
  box-shadow: 0 0 0 3px rgba(26,35,126,0.10);
}
.field-input::placeholder { color: var(--lnu-gray-dark); }
.input-mismatch { border-color: var(--lnu-danger) !important; }

.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 14px;
  color: var(--lnu-text-muted);
  pointer-events: none;
  font-size: 12px;
}
.field-select { cursor: pointer; }

.field-toggle {
  position: absolute; right: 12px;
  background: none; border: none; cursor: pointer;
  font-size: 15px; opacity: 0.45;
  transition: opacity 0.15s;
}
.field-toggle:hover { opacity: 1; }

.field-error { font-size: 11px; color: var(--lnu-danger); }

/* Password strength */
.pw-strength { display: flex; align-items: center; gap: 10px; }
.pw-bar { flex: 1; height: 5px; background: var(--lnu-gray); border-radius: 99px; overflow: hidden; }
.pw-fill { height: 100%; border-radius: 99px; transition: width 0.3s, background 0.3s; }
.pw-label { font-size: 11px; font-weight: bold; white-space: nowrap; }

/* Terms */
.terms-label {
  display: flex; align-items: flex-start; gap: 9px;
  font-size: 13px; color: var(--lnu-text-muted); cursor: pointer; line-height: 1.5;
}
.remember-check { accent-color: var(--lnu-navy); margin-top: 3px; flex-shrink: 0; }

.btn-primary {
  width: 100%; padding: 13px;
  background: var(--lnu-navy); color: var(--lnu-gold-light);
  border: none; border-radius: var(--lnu-radius);
  font-size: 15px; font-family: Georgia, serif; font-weight: bold;
  cursor: pointer; transition: background 0.2s, transform 0.1s;
  display: flex; align-items: center; justify-content: center;
  min-height: 48px;
}
.btn-primary:hover { background: var(--lnu-navy-light); }
.btn-primary:active { transform: scale(0.99); }
.btn-primary.loading { opacity: 0.75; cursor: not-allowed; }

.spinner {
  display: inline-block; width: 18px; height: 18px;
  border: 2px solid rgba(240,208,128,0.3);
  border-top-color: var(--lnu-gold-light);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.form-footer-text {
  text-align: center; margin-top: 24px;
  font-size: 13px; color: var(--lnu-text-muted);
}
.link-gold { color: var(--lnu-gold); font-weight: bold; text-decoration: none; }
.link-gold:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .auth-layout { flex-direction: column; }
  .brand-panel { width: 100%; min-height: unset; padding: 28px 16px; }
  .feature-list { display: none; }
  .field-row-2 { grid-template-columns: 1fr; }
}
</style>
