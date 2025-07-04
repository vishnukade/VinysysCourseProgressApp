import React, { useState } from "react";
import './UserLogin.css';

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          role: "USER"
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));

        localStorage.setItem("currentUser", JSON.stringify({
          username: tokenPayload.username,
          role: tokenPayload.role,
          userId: tokenPayload.username
        }));

        window.location.href = "/user-dashboard";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
      setError("Network error");
      setLoading(false);
    }
  };

  const switchToAdminLogin = () => {
    window.location.href = "/admin-login";
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p className="loading-text">Logging in...</p>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="forgot-password-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="switch-text" onClick={switchToAdminLogin}>
          <a href="#">Switch to Admin Login</a>
        </p>
      </div>
    </div>
  );
}
