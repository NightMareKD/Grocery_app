// Generic fetch wrapper with token support
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore if no JSON body
  }

  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

// Email/password signup
export function signup(payload) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Email/password login
export function login(payload) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Google sign-in (idToken from Google Identity Services)
export function googleSignIn(idToken) {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

// ✅ Protected dashboard fetch
export function getDashboard() {
  return apiFetch('/api/dashboard', { method: 'GET' });
}
