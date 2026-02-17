import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import NeuToast from "../../../component/common/NeuToast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true); // Default valid logic usually defaults to false, but let's stick to user pref if needed. Often default is false.
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorKey, setErrorKey] = useState(0);  
  
  // Toast State
  const [toast, setToast] = useState(null); // { message, type }

  const navigate = useNavigate();
  const { login } = useAuth();

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKeyDown = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      
      const { token, user } = res.data;

      login(user, token, remember);
      navigate("/");
    } catch (err) {
      console.error(err);
      setForm(prev => ({ ...prev, password: "" })); 
      setError(err?.response?.data?.message || "Invalid email or password");
      setErrorKey(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    showToast(`${platform} Login coming soon!`, 'info');
  };

  return (
    <div className="auth-wrapper">
      {toast && (
        <NeuToast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
        />
      )}
      <div className="login-container">
          <div className="login-card">
            <div className="login-header">
                <div className="neu-icon">
                    <div className="icon-inner">
                        <Lock size={24} />
                    </div>
                </div>
                <h2>Welcome back</h2>
                <p>Please sign in to continue</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
                <div className={`form-group ${error ? 'error' : ''}`}>
                    <div className="input-group neu-input">
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required 
                            placeholder=" "
                            value={form.email}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <label htmlFor="email">Email address</label>
                        <div className="input-icon">
                            <Mail size={20} />
                        </div>
                    </div>
                </div>

                <div className={`form-group ${error ? 'error' : ''}`}>
                    <div className="input-group neu-input password-group">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            required 
                            placeholder=" "
                            value={form.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <label htmlFor="password">Password</label>
                        <div className="input-icon">
                            <Lock size={20} />
                        </div>
                        <button 
                            type="button" 
                            className={`password-toggle neu-toggle ${showPassword ? 'show-password' : ''}`} 
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {error && (
                        <span key={errorKey} className="error-message show" style={{display: 'block'}}>
                            {error}
                        </span>
                    )}
                </div>

                <div className="form-options">
                    <div className="remember-wrapper">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            name="remember" 
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember" className="checkbox-label">
                            <div className="neu-checkbox">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                </div>

                <button type="submit" className={`neu-button login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                    <span className="btn-text">Sign In</span>
                    <div className="btn-loader">
                        <div className="neu-spinner"></div>
                    </div>
                </button>
            </form>

            <div className="divider">
                <div className="divider-line"></div>
                <span>or continue with</span>
                <div className="divider-line"></div>
            </div>

            <div className="social-login">
                <button type="button" className="social-btn neu-social" onClick={() => handleSocialLogin("Google")}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                </button>
                <button type="button" className="social-btn neu-social" onClick={() => handleSocialLogin("Facebook")}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </button>
                <button type="button" className="social-btn neu-social" onClick={() => handleSocialLogin("Apple")}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </button>
            </div>

            <div className="signup-link">
                <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
