import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { particlesConfig } from '../../config/particlesConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Optional: Add any initialization after particles are loaded
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(`/adminDashboard`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesConfig}
      />
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FaSignInAlt style={{ marginRight: '10px' }} />
            Welcome Back
          </h2>
          <p style={subtitleStyle}>Please enter your credentials to login</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              <FaUser style={iconStyle} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              style={inputStyle}
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              <FaLock style={iconStyle} />
              Password
            </label>
            <input
              type="password"
              id="password"
              style={inputStyle}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                <FaSignInAlt style={{ marginRight: '8px' }} />
                Login
              </>
            )}
          </button>
        </form>

        <div style={footerStyle}>
          <p style={footerTextStyle}>
            Don't have an account?{' '}
            <a 
              href="#" 
              style={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '450px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '40px',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const subtitleStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '0',
};

const formStyle = {
  width: '100%',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#34495e',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  marginRight: '10px',
  color: '#3498db',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  transition: 'border-color 0.3s',
};

inputStyle[':focus'] = {
  outline: 'none',
  borderColor: '#3498db',
  boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
  backgroundColor: '#3498db',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

buttonStyle[':hover'] = {
  backgroundColor: '#2980b9',
};

buttonStyle[':disabled'] = {
  backgroundColor: '#95a5a6',
  cursor: 'not-allowed',
};

const errorStyle = {
  backgroundColor: '#fdecea',
  color: '#d32f2f',
  padding: '12px 15px',
  borderRadius: '6px',
  marginBottom: '20px',
  fontSize: '14px',
};

const footerStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

const footerTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '0',
};

const linkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: '500',
};

linkStyle[':hover'] = {
  textDecoration: 'underline',
};

export default Login;