import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/client";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  contatcNumber: "",
  driving_license_number: "",
  usr_name: "",
  usr_password: "",
  car_mnfr: "",
  car_model: "",
  reg_no: "",
};

const fieldStyle = {
  width: "100%",
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
  boxSizing: "border-box",
};

const labelStyle = { display: "block", marginBottom: 6, fontSize: 14 };

function Field({ label, name, type = "text", value, onChange, required, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || label}
        style={fieldStyle}
      />
    </div>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/loginPage", {
        state: { message: "Account created successfully. Please log in to continue." },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong while creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 460,
        margin: "60px auto",
        padding: "0 20px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 8 }}>Sign Up</h2>
      <p style={{ color: "#777", marginBottom: 24, fontSize: 14 }}>
        Create your DriveMe account to find or offer rides.
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
        <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Field
          label="Contact Number"
          name="contatcNumber"
          type="tel"
          value={form.contatcNumber}
          onChange={handleChange}
          required
        />
        <Field
          label="Driving License Number"
          name="driving_license_number"
          value={form.driving_license_number}
          onChange={handleChange}
          required
        />

        <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #eee" }} />

        <Field label="User Name" name="usr_name" value={form.usr_name} onChange={handleChange} required />
        <Field
          label="Password"
          name="usr_password"
          type="password"
          value={form.usr_password}
          onChange={handleChange}
          required
        />

        <h3 style={{ margin: "24px 0 16px", fontSize: 18 }}>Car Details (optional)</h3>
        <Field label="Manufacturer" name="car_mnfr" value={form.car_mnfr} onChange={handleChange} />
        <Field label="Model" name="car_model" value={form.car_model} onChange={handleChange} />
        <Field label="Registration Number" name="reg_no" value={form.reg_no} onChange={handleChange} />

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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account? <Link to="/loginPage">Log in</Link>
        </p>
      </form>
    </div>
  );
}
