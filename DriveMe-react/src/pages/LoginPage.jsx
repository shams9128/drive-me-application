import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [usrName, setUsrName] = useState("");
  const [usrPassword, setUsrPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // SignUpPage redirects here with a success message after account creation.
  const successMessage = location.state?.message;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(usrName, usrPassword);
      setUser(loggedInUser);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid user name / password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "60px auto",
        padding: "0 20px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Sign In</h2>

      {successMessage && (
        <p
          style={{
            color: "#1e8e5a",
            background: "#eafaf1",
            border: "1px solid #b6ecd0",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="usr_name" style={{ display: "block", marginBottom: 6 }}>
            User Name
          </label>
          <input
            id="usr_name"
            type="text"
            value={usrName}
            onChange={(e) => setUsrName(e.target.value)}
            placeholder="User Name"
            required
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="usr_password" style={{ display: "block", marginBottom: 6 }}>
            Password
          </label>
          <input
            id="usr_password"
            type="password"
            value={usrPassword}
            onChange={(e) => setUsrPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" }}
          />
        </div>

        {error && <p style={{ color: "#c0392b", marginBottom: 16 }}>Error: {error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#4286f4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: 15,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in..." : "Log in"}
        </button>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Not a user? <Link to="/createUser">Sign up now</Link>
        </p>
      </form>
    </div>
  );
}
