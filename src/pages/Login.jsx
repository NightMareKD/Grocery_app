import React, { useState, useEffect } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login: doLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
  const errs = {};
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errs.email = 'Invalid email address';
  }
  if (!password) {
    errs.password = 'Password is required';
  }
  return errs;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  setErrors(errs);
  if (Object.keys(errs).length > 0) return;
  setSubmitting(true);
  setError('');
  try {
    const { token, user } = await login({ email, password });
    doLogin(token, user);
    navigate('/dashboard');
  } catch (e2) {
    setError(e2.message);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
  <input
    className="w-full border px-3 py-2 rounded"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email"
    required
  />
  {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
  <input
    className="w-full border px-3 py-2 rounded"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    required
  />
  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
  {error && <p className="text-red-600 text-sm">{error}</p>}
  <button
    disabled={submitting}
    className="w-full bg-blue-600 text-white py-2 rounded"
  >
    {submitting ? 'Signing in...' : 'Sign In'}
  </button>
</form>
      <p className="mt-4 text-sm">
        No account?{' '}
        <Link className="text-blue-600" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
