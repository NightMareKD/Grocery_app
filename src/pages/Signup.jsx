import React, { useState, useEffect } from 'react';
import { signup } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
  if (password.length < 6) {
    errs.password = 'Password must be at least 6 characters';
  }
  if (name && name.length < 2) {
    errs.name = 'Name must be at least 2 characters';
  }
  return errs;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  setErrors(errs);
  if (Object.keys(errs).length > 0) return;
  setSubmitting(true);
  try {
    await signup({ email, password, name });
    alert('Signup successful! Please log in.');
    navigate('/login');
  } catch (e2) {
    alert(e2.message);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
  <input
    className="w-full border px-3 py-2 rounded"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Name (optional)"
  />
  {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
  <input
    className="w-full border px-3 py-2 rounded"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    type="email"
    placeholder="Email"
    required
  />
  {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
  <input
    className="w-full border px-3 py-2 rounded"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    type="password"
    placeholder="Password"
    required
  />
  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
  <button
    disabled={submitting}
    className="w-full bg-green-600 text-white py-2 rounded"
  >
    {submitting ? 'Creating...' : 'Create Account'}
  </button>
</form>
      <p className="mt-4 text-sm">
        Have an account?{' '}
        <Link className="text-blue-600" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
