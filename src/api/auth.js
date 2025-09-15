export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}