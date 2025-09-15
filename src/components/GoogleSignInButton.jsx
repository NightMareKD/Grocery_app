import React, { useEffect } from 'react';
import { googleSignIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function GoogleSignInButton({ clientId }) {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (res) => {
          try {
            const data = await googleSignIn(res.credential);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
          } catch (e) {
            console.error('Google sign-in error', e);
            alert(e.message || 'Google sign-in failed');
          }
        },
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, navigate]);

  return <div id="google-signin-btn" />;
}