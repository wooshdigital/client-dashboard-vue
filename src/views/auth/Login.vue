<template>
  <div class="login-container d-flex align-items-center justify-content-center min-vh-100">
    <div class="login-card card shadow-lg">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="h3 mb-3 font-weight-normal">Client Dashboard</h2>
          <p class="text-muted">Sign in to your account</p>
        </div>
        
        <form @submit.prevent="handleLogin" novalidate>
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              placeholder="Enter your email"
              required
              autocomplete="email"
            >
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              >
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback d-block">
              {{ errors.password }}
            </div>
          </div>
          
          <div class="mb-3 form-check">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="form-check-input"
            >
            <label for="remember" class="form-check-label">
              Remember me
            </label>
          </div>
          
          <div v-if="generalError" class="alert alert-danger" role="alert">
            {{ generalError }}
          </div>
          
          <button
            type="submit"
            class="btn btn-primary w-100 mb-3"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
          
          <div class="text-center">
            <a href="#" class="text-decoration-none" @click.prevent="showForgotPassword = true">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reset Password</h5>
            <button type="button" class="btn-close" @click="showForgotPassword = false"></button>
          </div>
          <div class="modal-body">
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <div class="mb-3">
              <label for="reset-email" class="form-label">Email Address</label>
              <input
                id="reset-email"
                v-model="resetEmail"
                type="email"
                class="form-control"
                placeholder="Enter your email"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showForgotPassword = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="handleForgotPassword" :disabled="!resetEmail">
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()
    
    const loading = ref(false)
    const showPassword = ref(false)
    const showForgotPassword = ref(false)
    const resetEmail = ref('')
    const generalError = ref('')
    
    const form = reactive({
      email: '',
      password: '',