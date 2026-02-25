# README.md
# LNU LLE Mock Examination & Readiness Decision Support System

A web-based mock licensure examination platform for BLIS students that supports self-registration, licensure-style mock exams (Pre-Test / Post-Test / Mock Exam), automated scoring, and subject-level performance dashboards. The system centralizes assessment data for evidence-based review planning and (later) readiness prediction.

---

## Core Modules

### 1) Authentication & RBAC
- Student self-registration (Student role only)
- Login / logout
- Role-based dashboards and route protection:
  - Student dashboard
  - Faculty/Review Master dashboard
  - Admin dashboard

### 2) Mock Examination (Planned)
- Exam setup (subjects, question bank, exam sets)
- Exam-taking flow (timer, attempt session handling, randomized items)
- Automatic scoring and result storage

### 3) Analytics & Decision Support (Planned)
- Subject-level performance profiling (weakest subjects, trends, summaries)
- Readiness indicator (Pass/Fail category or readiness band)

---

## Tech Stack

### Backend
- Laravel (PHP) — auth, RBAC, exam workflow, scoring, reports
- MySQL — persistent storage

### Frontend
- Vue.js — dashboards + exam UI
- Vite / Node.js — asset building/dev server

### Docker / Infrastructure
- Nginx — web server / reverse proxy
- PHP-FPM — Laravel runtime
- MySQL — database
- phpMyAdmin — DB UI (development only)

> By design, the production web app does NOT run WEKA/Java at runtime. WEKA is used offline for training only.

---

## Roles & Registration Rules (Strict)

### Roles
- **Student**: self-registers, takes exams, views results & dashboards
- **Faculty/Review Master**: manages question bank/exams, views reports (admin-created accounts)
- **Admin**: manages users/roles, system oversight

### Self-registration policy
- Public registration ALWAYS creates a **Student** account.
- No role selection on the registration UI.
- Faculty/Admin accounts are created by an Admin (or invite-only).

---

## UI Theme (LNU Seal Colors — Use Strictly)

**Hex tokens (do not invent new colors):**
- Primary / Navy Blue: `#1A237E`
- Gold / Accent: `#C9A84C`
- Background: `#F9F8F4`
- Pass / Success Green: `#2E7D32`
- Fail / Danger Red: `#C62828`
- Neutral Gray: `#ECEFF1`
- Dark Text: `#0D1547`
- Light Gold (text on navy): `#F0D080`

### Theme tokens
Create `resources/css/theme.css`:

```css
:root{
  --lnu-navy:#1A237E;
  --lnu-gold:#C9A84C;
  --lnu-bg:#F9F8F4;
  --lnu-success:#2E7D32;
  --lnu-danger:#C62828;
  --lnu-gray:#ECEFF1;
  --lnu-text:#0D1547;
  --lnu-light-gold:#F0D080;
}

body{ background:var(--lnu-bg); color:var(--lnu-text); }
.navbar{ background:var(--lnu-navy); color:var(--lnu-light-gold); }
.btn-primary{ background:var(--lnu-navy); color:var(--lnu-light-gold); }
.badge-accent{ background:var(--lnu-gold); color:var(--lnu-text); }
.card{ background:var(--lnu-gray); border:1px solid rgba(13,21,71,0.12); }
.alert-success{ background:var(--lnu-success); color:#fff; }
.alert-danger{ background:var(--lnu-danger); color:#fff; }


/* 
Repository Structure (Recommended)
app/
  Http/
    Controllers/
    Middleware/
  Services/              # business logic (auth, scoring, dashboards, prediction)
  Models/
database/
  migrations/
  seeders/
resources/
  js/
    pages/
    components/
  css/
    theme.css
routes/
  web.php
  api.php
storage/
  models/                # offline-trained model artifacts (JSON) */