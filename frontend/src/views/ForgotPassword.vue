<template>
  <main class="page">
    <section class="panel">
      <h1>Forgot Password</h1>
      <p>This page is a placeholder.</p>
      <router-link to="/login">Back to login</router-link>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--lnu-bg);
}

.panel {
  background: white;
  border: 1px solid rgba(13, 21, 71, 0.08);
  border-radius: 16px;
  padding: 24px;
}
</style>
