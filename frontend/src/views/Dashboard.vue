<template>
  <div class="dash-layout">

    <!-- ── Sidebar ──────────────────────────────────── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-seal">🕯</div>
        <transition name="slide-fade">
          <div v-if="!sidebarCollapsed" class="logo-text">
            <span class="logo-name">LNU · LLE</span>
            <span class="logo-sub">Review System</span>
          </div>
        </transition>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeNav === item.key }"
          @click="activeNav = item.key"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <transition name="slide-fade">
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </transition>
          <span v-if="item.badge && !sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
        </div>
      </nav>

      <!-- User / Collapse -->
      <div class="sidebar-footer">
        <div class="sidebar-user" v-if="!sidebarCollapsed">
          <div class="user-avatar">JD</div>
          <div class="user-info">
            <span class="user-name">Juan dela Cruz</span>
            <span class="user-role">Student Reviewer</span>
          </div>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>
    </aside>

    <!-- ── Main Content ──────────────────────────────── -->
    <div class="main-area">

      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ currentPage.title }}</h1>
          <p class="page-sub">{{ currentPage.sub }}</p>
        </div>
        <div class="topbar-right">
          <div class="exam-badge">
            <span class="badge-dot" />
            Next exam: <strong>March 12, 2026</strong>
          </div>
          <button class="btn-start-exam">📝 Start Practice Exam</button>
          <div class="notif-btn">🔔 <span class="notif-dot" /></div>
        </div>
      </header>

      <!-- ── Dashboard Content ─────────────────────── -->
      <div class="content-area" v-if="activeNav === 'dashboard'">

        <!-- Stat Cards Row -->
        <div class="stat-grid">
          <div class="stat-card" v-for="stat in statCards" :key="stat.label"
            :style="{ borderLeftColor: stat.color }">
            <div class="stat-icon" :style="{ background: stat.color + '18' }">{{ stat.icon }}</div>
            <div class="stat-body">
              <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-trend" :class="stat.up ? 'trend-up' : 'trend-down'">
                {{ stat.up ? '↑' : '↓' }} {{ stat.trend }}
              </div>
            </div>
          </div>
        </div>

        <!-- Middle row: Pass Probability + Subject Scores -->
        <div class="mid-grid">

          <!-- Pass Probability Donut -->
          <div class="card prob-card">
            <div class="card-header">
              <h3 class="card-title">Pass Probability</h3>
              <span class="card-badge badge-success">DSS Estimate</span>
            </div>
            <div class="donut-wrap">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <!-- Background ring -->
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="var(--lnu-gray)" stroke-width="12" />
                <!-- Progress ring: 84% = 314.16 * 0.84 ≈ 264 dashoffset from 314 -->
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="var(--lnu-success)" stroke-width="12"
                  stroke-linecap="round"
                  stroke-dasharray="314.16"
                  stroke-dashoffset="50"
                  transform="rotate(-90 60 60)" />
                <text x="60" y="56" text-anchor="middle"
                  font-size="20" font-weight="bold" fill="var(--lnu-success)"
                  font-family="Georgia, serif">84%</text>
                <text x="60" y="72" text-anchor="middle"
                  font-size="8" fill="var(--lnu-text-muted)"
                  font-family="Georgia, serif">Likely to Pass</text>
              </svg>
            </div>
            <div class="prob-details">
              <div class="prob-row">
                <span class="prob-label">Current avg.</span>
                <span class="prob-val navy">78%</span>
              </div>
              <div class="prob-row">
                <span class="prob-label">Passing threshold</span>
                <span class="prob-val">75%</span>
              </div>
              <div class="prob-row">
                <span class="prob-label">Margin</span>
                <span class="prob-val success">+3 pts safe</span>
              </div>
            </div>
            <div class="alert-rec">
              💡 Study Reference Services to boost probability above 90%
            </div>
          </div>

          <!-- Subject Scores -->
          <div class="card subjects-card">
            <div class="card-header">
              <h3 class="card-title">Subject Performance</h3>
              <span class="card-badge badge-navy">6 Subjects</span>
            </div>
            <div class="subject-list">
              <div class="subject-row" v-for="s in subjects" :key="s.label">
                <div class="subj-top">
                  <span class="subj-label">{{ s.label }}</span>
                  <span class="subj-score" :style="{ color: s.score >= 75 ? 'var(--lnu-success)' : 'var(--lnu-danger)' }">
                    {{ s.score }}%
                  </span>
                </div>
                <div class="prog-track">
                  <div class="prog-fill"
                    :style="{
                      width: s.score + '%',
                      background: s.score >= 75
                        ? 'linear-gradient(90deg,var(--lnu-success),#66BB6A)'
                        : 'linear-gradient(90deg,var(--lnu-danger),#EF5350)'
                    }"
                  />
                  <div class="prog-threshold" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom row: Score History + Recent Activity -->
        <div class="bottom-grid">

          <!-- Score History Bar Chart -->
          <div class="card chart-card">
            <div class="card-header">
              <h3 class="card-title">Score History</h3>
              <div class="chart-legend">
                <span class="leg pass">■ Pass</span>
                <span class="leg fail">■ Below</span>
              </div>
            </div>
            <div class="bar-chart">
              <div class="bar-wrap" v-for="(s, i) in scoreHistory" :key="i">
                <span class="bar-pct" :style="{ color: s >= 75 ? 'var(--lnu-success)' : 'var(--lnu-danger)' }">
                  {{ s }}%
                </span>
                <div class="bar-col">
                  <div class="bar-fill"
                    :style="{
                      height: s + '%',
                      background: s >= 75
                        ? 'linear-gradient(180deg,var(--lnu-success),#A5D6A7)'
                        : 'linear-gradient(180deg,var(--lnu-danger),#EF9A9A)'
                    }"
                  />
                </div>
                <span class="bar-label">T{{ i + 1 }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card activity-card">
            <div class="card-header">
              <h3 class="card-title">Recent Activity</h3>
            </div>
            <div class="activity-list">
              <div class="activity-item" v-for="a in activities" :key="a.title">
                <div class="activity-dot" :style="{ background: a.color }" />
                <div class="activity-body">
                  <span class="activity-title">{{ a.title }}</span>
                  <span class="activity-meta">{{ a.meta }}</span>
                </div>
                <span class="activity-score" :style="{ color: a.color }">{{ a.score }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Placeholder for other nav sections ───── -->
      <div class="content-area placeholder-view" v-else>
        <div class="placeholder-card">
          <div class="placeholder-icon">{{ currentPage.icon }}</div>
          <h2>{{ currentPage.title }}</h2>
          <p>This section is under development.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const sidebarCollapsed = ref(false)
const activeNav = ref('dashboard')

const navItems = [
  { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { key: 'exams',     icon: '📝', label: 'Practice Exams', badge: '3' },
  { key: 'analytics', icon: '📊', label: 'Analytics' },
  { key: 'dss',       icon: '🎯', label: 'DSS Insights' },
  { key: 'results',   icon: '📋', label: 'My Results' },
  { key: 'settings',  icon: '⚙️', label: 'Settings' },
]

const pageMap = {
  dashboard: { title: 'Dashboard',       sub: 'Your LLE review overview at a glance',      icon: '🏠' },
  exams:     { title: 'Practice Exams',  sub: 'Take mock exams and timed sets',              icon: '📝' },
  analytics: { title: 'Analytics',       sub: 'Deep-dive into your performance data',        icon: '📊' },
  dss:       { title: 'DSS Insights',    sub: 'Decision support & pass probability engine',  icon: '🎯' },
  results:   { title: 'My Results',      sub: 'All past exam scores and breakdowns',         icon: '📋' },
  settings:  { title: 'Settings',        sub: 'Manage your account and preferences',         icon: '⚙️' },
}

const currentPage = computed(() => pageMap[activeNav.value])

const statCards = [
  { icon: '📊', label: 'Overall Average',   value: '78%', color: 'var(--lnu-navy)',   trend: '4% this week',  up: true  },
  { icon: '✅', label: 'Pass Probability',  value: '84%', color: 'var(--lnu-success)',trend: '2% this week',  up: true  },
  { icon: '📝', label: 'Exams Taken',       value: '12',  color: 'var(--lnu-gold)',   trend: '3 remaining',   up: true  },
  { icon: '⏱',  label: 'Avg. Time / Exam', value: '58m', color: '#7B5EA7',           trend: '5m faster',     up: true  },
]

const subjects = [
  { label: 'Library Science Fundamentals', score: 88 },
  { label: 'Cataloging & Classification',  score: 72 },
  { label: 'Reference & Info Services',    score: 65 },
  { label: 'Library Management',           score: 90 },
  { label: 'Bibliography & Research',      score: 78 },
  { label: 'Information Technology',       score: 82 },
]

const scoreHistory = [62, 68, 71, 74, 76, 78]

const activities = [
  { title: 'Library Science — Mock Exam 12', meta: 'Today, 9:42 AM',    score: '82%', color: 'var(--lnu-success)' },
  { title: 'Cataloging Quiz — Set B',        meta: 'Yesterday, 3:15 PM',score: '68%', color: 'var(--lnu-danger)'  },
  { title: 'Reference Services — Set A',     meta: 'Feb 24, 10:00 AM',  score: '71%', color: 'var(--lnu-danger)'  },
  { title: 'Library Management — Full Set',  meta: 'Feb 22, 2:30 PM',   score: '90%', color: 'var(--lnu-success)' },
  { title: 'Info Technology — Set C',        meta: 'Feb 20, 8:00 AM',   score: '79%', color: 'var(--lnu-success)' },
]
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────── */
.dash-layout {
  display: flex;
  min-height: 100vh;
  background: var(--lnu-bg);
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--lnu-navy-deep);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
}
.sidebar.collapsed { width: 64px; }

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  min-height: 70px;
}

.logo-seal {
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--lnu-gold), var(--lnu-gold-light));
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; box-shadow: 0 0 12px rgba(201,168,76,0.3);
}

.logo-text { overflow: hidden; white-space: nowrap; }
.logo-name { display: block; font-size: 14px; font-weight: bold; color: var(--lnu-gold); }
.logo-sub { display: block; font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; }

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  color: rgba(255,255,255,0.55);
  white-space: nowrap;
  position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.nav-item.active {
  background: rgba(201,168,76,0.15);
  color: var(--lnu-gold-light);
}
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 6px; bottom: 6px;
  width: 3px;
  background: var(--lnu-gold);
  border-radius: 0 3px 3px 0;
}

.nav-icon { font-size: 17px; flex-shrink: 0; width: 22px; text-align: center; }
.nav-label { font-size: 13px; flex: 1; }
.nav-badge {
  background: var(--lnu-gold); color: var(--lnu-navy-deep);
  font-size: 10px; font-weight: bold;
  border-radius: 99px; padding: 1px 7px;
}

/* Footer */
.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-user {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; border-radius: 8px;
  background: rgba(255,255,255,0.05);
  overflow: hidden; white-space: nowrap;
}

.user-avatar {
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--lnu-navy-light), var(--lnu-gold));
  color: white; font-size: 12px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
}
.user-info { overflow: hidden; }
.user-name { display: block; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: bold; }
.user-role { display: block; font-size: 10px; color: rgba(255,255,255,0.35); }

.collapse-btn {
  background: rgba(255,255,255,0.05); border: none;
  color: rgba(255,255,255,0.4); cursor: pointer;
  border-radius: 6px; padding: 6px 10px;
  font-size: 13px; align-self: flex-end;
  transition: background 0.15s, color 0.15s;
}
.collapse-btn:hover { background: rgba(255,255,255,0.10); color: var(--lnu-gold); }

/* Transition */
.slide-fade-enter-active, .slide-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateX(-6px); }

/* ── Main Area ────────────────────────────────────── */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  background: var(--lnu-white);
  border-bottom: 1px solid var(--lnu-gray);
  box-shadow: 0 1px 8px rgba(26,35,126,0.06);
  gap: 16px;
  flex-wrap: wrap;
}

.topbar-left .page-title { font-size: 20px; font-weight: bold; color: var(--lnu-navy); }
.topbar-left .page-sub { font-size: 12px; color: var(--lnu-text-muted); margin-top: 2px; }

.topbar-right {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}

.exam-badge {
  background: var(--lnu-gold-pale);
  border: 1px solid rgba(201,168,76,0.4);
  border-radius: 99px; padding: 5px 14px;
  font-size: 12px; color: var(--lnu-text);
  display: flex; align-items: center; gap: 6px;
}
.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--lnu-gold);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

.btn-start-exam {
  background: var(--lnu-navy); color: var(--lnu-gold-light);
  border: none; border-radius: 8px;
  padding: 9px 18px; font-size: 13px;
  font-family: Georgia, serif; font-weight: bold;
  cursor: pointer; transition: background 0.2s;
  white-space: nowrap;
}
.btn-start-exam:hover { background: var(--lnu-navy-light); }

.notif-btn {
  position: relative; font-size: 20px; cursor: pointer;
  padding: 4px;
}
.notif-dot {
  position: absolute; top: 4px; right: 2px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--lnu-danger);
  border: 2px solid white;
}

/* ── Content Area ─────────────────────────────────── */
.content-area {
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Stat Grid ────────────────────────────────────── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--lnu-white);
  border-radius: var(--lnu-radius);
  padding: 18px;
  border-left: 4px solid;
  box-shadow: var(--lnu-card-shadow);
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 44px; height: 44px; flex-shrink: 0;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}

.stat-value { font-size: 26px; font-weight: bold; line-height: 1.1; }
.stat-label { font-size: 12px; color: var(--lnu-text-muted); margin-top: 2px; }
.stat-trend { font-size: 11px; margin-top: 4px; }
.trend-up { color: var(--lnu-success); }
.trend-down { color: var(--lnu-danger); }

/* ── Mid Grid ─────────────────────────────────────── */
.mid-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
}

/* ── Card Base ────────────────────────────────────── */
.card {
  background: var(--lnu-white);
  border-radius: var(--lnu-radius-lg);
  padding: 20px 22px;
  box-shadow: var(--lnu-card-shadow);
}

.card-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.card-title { font-size: 15px; font-weight: bold; color: var(--lnu-navy); }
.card-badge {
  font-size: 11px; font-weight: bold;
  border-radius: 99px; padding: 3px 10px;
}
.badge-success { background: #E8F5E9; color: var(--lnu-success); }
.badge-navy { background: #E8EAF6; color: var(--lnu-navy); }

/* ── Donut ────────────────────────────────────────── */
.donut-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
.donut-svg { width: 130px; height: 130px; }

.prob-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.prob-row { display: flex; justify-content: space-between; font-size: 13px; }
.prob-label { color: var(--lnu-text-muted); }
.prob-val { font-weight: bold; color: var(--lnu-text); }
.prob-val.navy { color: var(--lnu-navy); }
.prob-val.success { color: var(--lnu-success); }

.alert-rec {
  background: var(--lnu-gold-pale);
  border-left: 3px solid var(--lnu-gold);
  border-radius: 0 6px 6px 0;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--lnu-text);
  line-height: 1.5;
}

/* ── Subject Progress ─────────────────────────────── */
.subject-list { display: flex; flex-direction: column; gap: 14px; }
.subject-row {}
.subj-top { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 13px; }
.subj-label { color: var(--lnu-text); }
.subj-score { font-weight: bold; }

.prog-track {
  background: var(--lnu-gray);
  border-radius: 99px; height: 8px;
  position: relative;
  overflow: hidden;
}
.prog-fill {
  height: 100%; border-radius: 99px;
  transition: width 0.6s ease;
}
/* 75% threshold marker */
.prog-threshold {
  position: absolute;
  left: 75%; top: 0; bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.8);
}

/* ── Bottom Grid ──────────────────────────────────── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
}

/* ── Bar Chart ────────────────────────────────────── */
.chart-card { }
.chart-legend { display: flex; gap: 12px; font-size: 12px; }
.leg { color: var(--lnu-text-muted); }
.leg.pass { color: var(--lnu-success); }
.leg.fail { color: var(--lnu-danger); }

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 150px;
  gap: 8px;
}

.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}
.bar-pct { font-size: 11px; font-weight: bold; flex-shrink: 0; }
.bar-col {
  flex: 1; width: 100%;
  display: flex; align-items: flex-end;
  background: var(--lnu-gray);
  border-radius: 4px 4px 0 0;
  overflow: hidden;
}
.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.6s ease;
  min-height: 8px;
}
.bar-label { font-size: 11px; color: var(--lnu-text-muted); flex-shrink: 0; }

/* ── Activity List ────────────────────────────────── */
.activity-list { display: flex; flex-direction: column; }
.activity-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--lnu-gray);
}
.activity-item:last-child { border-bottom: none; }

.activity-dot {
  width: 10px; height: 10px; flex-shrink: 0;
  border-radius: 50%;
}
.activity-body { flex: 1; overflow: hidden; }
.activity-title { display: block; font-size: 13px; color: var(--lnu-text); font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-meta { display: block; font-size: 11px; color: var(--lnu-text-muted); margin-top: 1px; }
.activity-score { font-size: 13px; font-weight: bold; flex-shrink: 0; }

/* ── Placeholder ─────────────────────────────────── */
.placeholder-view {
  flex: 1;
  align-items: center;
  justify-content: center;
}
.placeholder-card {
  text-align: center;
  background: var(--lnu-white);
  border-radius: var(--lnu-radius-lg);
  padding: 60px 40px;
  box-shadow: var(--lnu-card-shadow);
  max-width: 360px;
}
.placeholder-icon { font-size: 48px; margin-bottom: 16px; }
.placeholder-card h2 { color: var(--lnu-navy); margin-bottom: 8px; }
.placeholder-card p { color: var(--lnu-text-muted); font-size: 14px; }

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .mid-grid { grid-template-columns: 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .topbar { padding: 14px 16px; }
  .content-area { padding: 16px; }
  .btn-start-exam { display: none; }
}
</style>
