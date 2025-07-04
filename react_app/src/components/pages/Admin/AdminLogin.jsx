import React, { useState } from "react";
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ New loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Start loading

    try {
      const response = await fetch("https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          role: "ADMIN"
        })
      });

      const data = await response.json();
      setLoading(false); // ✅ Stop loading after response

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/admin-dashboard";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
      setLoading(false); // ✅ Stop loading on error
    }
  };

  const switchToUserLogin = () => {
    window.location.href = "/user-login";
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
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
              disabled={loading} // ✅ Disable input
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
              disabled={loading} // ✅ Disable input
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"} {/* ✅ Button shows status */}
          </button>
        </form>
        <p className="switch-link" onClick={switchToUserLogin}>
          Switch to User Login
        </p>
      </div>
    </div>
  );
}
