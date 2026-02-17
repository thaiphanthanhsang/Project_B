import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../../utils/api";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKeyDown = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, password2 } = form;

    if (password !== password2) {
      setError("Passwords do not match");
      setErrorKey((prev) => prev + 1);
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, phone, password });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed");
      setErrorKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <div className="login-card">
        <div className="login-header">
           <div className="neu-icon">
                <div className="icon-inner">
                    <User size={24} />
                </div>
            </div>
          <h2>Create Account</h2>
          <p>Join us to start shopping</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <div className="input-group neu-input">
              <input
                name="name"
                type="text"
                required
                placeholder=" "
                value={form.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <label>Full Name</label>
              <div className="input-icon">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <div className="input-group neu-input">
              <input
                name="email"
                type="email"
                required
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
               <label>Email Address</label>
              <div className="input-icon">
                <Mail size={20} />
              </div>
            </div>
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <div className="input-group neu-input">
              <input
                name="phone"
                type="tel"
                placeholder=" "
                value={form.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
               <label>Phone Number</label>
              <div className="input-icon">
                <Phone size={20} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="input-group neu-input password-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <label>Password</label>
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
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <div className="input-group neu-input password-group">
              <input
                name="password2"
                type={showPassword2 ? "text" : "password"}
                required
                placeholder=" "
                value={form.password2}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <label>Confirm Password</label>
              <div className="input-icon">
                 <Lock size={20} />
              </div>
              <button
                type="button"
                className={`password-toggle neu-toggle ${showPassword2 ? 'show-password' : ''}`}
                onClick={() => setShowPassword2(!showPassword2)}
                disabled={loading}
              >
                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <span key={errorKey} className="error-message show" style={{display:'block', marginBottom: '20px'}}>
               {error}
            </span>
          )}

          {/* Submit Button */}
          <button
             type="submit" 
             className={`neu-button login-btn ${loading ? 'loading' : ''}`} 
             disabled={loading}
          >
            <span className="btn-text">Create Account</span>
            <div className="btn-loader">
                <div className="neu-spinner"></div>
            </div>
          </button>

          {/* Footer Links */}
          <div className="signup-link">
             <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default RegisterPage;
