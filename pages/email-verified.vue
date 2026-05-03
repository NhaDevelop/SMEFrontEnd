<template>
  <div class="verify-page">
    <div class="card">
      <!-- Success -->
      <template v-if="status === 'success'">
        <div class="icon success">✅</div>
        <h1>Email Verified!</h1>
        <p>Your email has been verified successfully. Your application is now <strong>pending admin review</strong>.</p>
        <p>You will receive an email once your account is approved.</p>
        <NuxtLink to="/login" class="btn">Go to Login</NuxtLink>
      </template>

      <!-- Already Verified -->
      <template v-else-if="status === 'already_verified'">
        <div class="icon info">ℹ️</div>
        <h1>Already Verified</h1>
        <p>Your email has already been verified. Please wait for admin approval or try logging in.</p>
        <NuxtLink to="/login" class="btn">Go to Login</NuxtLink>
      </template>

      <!-- Expired -->
      <template v-else-if="status === 'expired'">
        <div class="icon error">⏱️</div>
        <h1>Link Expired</h1>
        <p>Your verification link has expired (links expire after 24 hours). Please register again to receive a new verification email.</p>
        <NuxtLink to="/register" class="btn btn-outline">Register Again</NuxtLink>
      </template>

      <!-- Invalid -->
      <template v-else-if="status === 'invalid'">
        <div class="icon error">❌</div>
        <h1>Invalid Link</h1>
        <p>This verification link is invalid or has already been used. Please try registering again.</p>
        <NuxtLink to="/register" class="btn btn-outline">Register Again</NuxtLink>
      </template>

      <!-- Default/Loading -->
      <template v-else>
        <div class="icon">🔄</div>
        <h1>Verifying...</h1>
        <p>Please wait while we verify your email address.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const status = computed(() => route.query.status as string || '')

useHead({
  title: 'Email Verification — IRiP'
})
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  padding: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px -15px rgba(0,0,0,0.12);
  border: 1px solid #e5e7eb;
}

.icon {
  font-size: 56px;
  margin-bottom: 20px;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 12px;
  font-size: 15px;
}

.btn {
  display: inline-block;
  margin-top: 24px;
  padding: 12px 32px;
  background-color: #0d9488;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.2s;
}

.btn:hover {
  background-color: #0f766e;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #0d9488;
  color: #0d9488;
}

.btn-outline:hover {
  background-color: #0d9488;
  color: white;
}
</style>
