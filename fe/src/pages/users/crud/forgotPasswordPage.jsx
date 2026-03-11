import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  KeyRound,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../../utils/api";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: PIN, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // STEP 1: Send PIN
  const handleRequestPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to send PIN. Please check your email.",
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify PIN
  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/verify-pin", { email, pin });
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired PIN.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setStep(4);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <div className="login-card">
          {/* Header changes based on step */}
          <div className="login-header">
            <div className="neu-icon">
              <div className="icon-inner">
                {step === 1 && <Mail size={24} />}
                {step === 2 && <KeyRound size={24} />}
                {step === 3 && <Lock size={24} />}
                {step === 4 && (
                  <CheckCircle size={24} className="text-green-500" />
                )}
              </div>
            </div>
            <h2>
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verification"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Success!"}
            </h2>
            <p>
              {step === 1 && "Enter your email to receive a recovery PIN"}
              {step === 2 && `Enter the 6-digit PIN sent to ${email}`}
              {step === 3 && "Create a new strong password"}
              {step === 4 && "Your password has been reset successfully"}
            </p>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form className="login-form" onSubmit={handleRequestPin}>
              <div className={`form-group ${error ? "error" : ""}`}>
                <div className="input-group neu-input">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <label>Email address</label>
                  <div className="input-icon">
                    <Mail size={20} />
                  </div>
                </div>
                {error && (
                  <span
                    className="error-message show"
                    style={{ display: "block" }}
                  >
                    {error}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`neu-button login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                <span className="btn-text">Send PIN Code</span>
                <div className="btn-loader">
                  <div className="neu-spinner"></div>
                </div>
              </button>
            </form>
          )}

          {/* Step 2: PIN Input */}
          {step === 2 && (
            <form className="login-form" onSubmit={handleVerifyPin}>
              <div className={`form-group ${error ? "error" : ""}`}>
                <div className="input-group neu-input">
                  <input
                    id="pin"
                    name="pin"
                    type="text"
                    required
                    placeholder=" "
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className="text-center tracking-[0.5em] font-bold text-lg"
                    disabled={loading}
                  />
                  <label className="text-center w-full left-0">
                    Enter 6-digit PIN
                  </label>
                </div>
                {error && (
                  <span
                    className="error-message show"
                    style={{ display: "block" }}
                  >
                    {error}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`neu-button login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                <span className="btn-text">Verify PIN</span>
                <div className="btn-loader">
                  <div className="neu-spinner"></div>
                </div>
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Resend PIN or Change Email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="login-form" onSubmit={handleResetPassword}>
              <div className={`form-group ${error ? "error" : ""}`}>
                <div className="input-group neu-input password-group">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label>New Password</label>
                  <div className="input-icon">
                    <Lock size={20} />
                  </div>
                  <button
                    type="button"
                    className="password-toggle neu-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <div className="input-group neu-input password-group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Confirm Password</label>
                  <div className="input-icon">
                    <Lock size={20} />
                  </div>
                </div>
                {error && (
                  <span
                    className="error-message show"
                    style={{ display: "block" }}
                  >
                    {error}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={`neu-button login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                <span className="btn-text">Reset Password</span>
                <div className="btn-loader">
                  <div className="neu-spinner"></div>
                </div>
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-6">
                You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="neu-button login-btn inline-flex items-center justify-center text-white no-underline"
              >
                <span className="btn-text">Back to Login</span>
              </Link>
            </div>
          )}

          {step !== 4 && (
            <>
              <div className="divider"></div>
              <div className="signup-link">
                <p>
                  <Link
                    to="/login"
                    className="flex items-center justify-center font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back to Login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
