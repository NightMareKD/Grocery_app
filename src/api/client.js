import { apiFetch } from './client';

// Email/password signup
export function signup(payload) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Email/password login
export function login(payload) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Google sign-in (idToken from Google Identity Services)
export function googleSignIn(idToken) {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken })
  });
}