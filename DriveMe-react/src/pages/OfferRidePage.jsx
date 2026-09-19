import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { offerRide } from "../api/client";

const initialForm = {
  ride_start_point: "",
  ride_end_point: "",
  ride_start_date: "",
  ride_start_time: "",
  seats_offer: "",
  amountPerSeat: "",
};

const fieldStyle = {
  width: "100%",
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
  boxSizing: "border-box",
};

const labelStyle = { display: "block", marginBottom: 6, fontSize: 14 };

export default function OfferRidePage() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const saved = await offerRide({
        ...form,
        seats_offer: Number(form.seats_offer),
        amountPerSeat: Number(form.amountPerSeat),
      });
      setConfirmed(saved);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save this ride right now.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return null;
  }

  if (!user) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "80px auto",
          padding: "0 20px",
          fontFamily: "Montserrat, sans-serif",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Offer a Ride</h2>
        <p style={{ color: "#555", marginBottom: 20 }}>
          Please log in to offer a ride to other travelers.
        </p>
        <Link
          to="/loginPage"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#4286f4",
            color: "#fff",
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          Log in
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "80px auto",
          padding: "0 20px",
          fontFamily: "Montserrat, sans-serif",
          textAlign: "center",
        }}
      >
        <CheckCircle2 size={48} color="#1abc9c" style={{ marginBottom: 16 }} />
        <h2 style={{ marginBottom: 8 }}>Your ride is posted!</h2>
        <p style={{ color: "#555", marginBottom: 24 }}>
          {confirmed.offerFirstName} {confirmed.offerLastName}, here are the details travelers will see:
        </p>
        <div style={{ textAlign: "left", border: "1px solid #e7e7e7", borderRadius: 6, padding: 16, marginBottom: 24 }}>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Route:</strong> {confirmed.ride_start_point} → {confirmed.ride_end_point}
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Date:</strong> {confirmed.ride_start_date} at {confirmed.ride_start_time}
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Seats offered:</strong> {confirmed.seats_offer}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Amount per seat:</strong> ₹{confirmed.amountPerSeat}
          </p>
        </div>
        <button
          onClick={() => {
            setConfirmed(null);
            setForm(initialForm);
          }}
          style={{
            padding: "10px 24px",
            background: "#4286f4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Offer another ride
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 460, margin: "50px auto", padding: "0 20px", fontFamily: "Montserrat, sans-serif" }}>
      <h2 style={{ marginBottom: 8 }}>Offer a Ride</h2>
      <p style={{ color: "#777", marginBottom: 24, fontSize: 14 }}>
        Driving somewhere anyway? Post your route and let travelers request a seat.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ride_start_point" style={labelStyle}>Start Location</label>
          <input
            id="ride_start_point"
            name="ride_start_point"
            value={form.ride_start_point}
            onChange={handleChange}
            placeholder="Enter the start location"
            required
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ride_end_point" style={labelStyle}>End Location</label>
          <input
            id="ride_end_point"
            name="ride_end_point"
            value={form.ride_end_point}
            onChange={handleChange}
            placeholder="Enter the end location"
            required
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ride_start_date" style={labelStyle}>Date</label>
          <input
            id="ride_start_date"
            name="ride_start_date"
            type="date"
            value={form.ride_start_date}
            onChange={handleChange}
            required
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ride_start_time" style={labelStyle}>Start Time</label>
          <input
            id="ride_start_time"
            name="ride_start_time"
            type="time"
            value={form.ride_start_time}
            onChange={handleChange}
            required
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="seats_offer" style={labelStyle}>Capacity</label>
          <input
            id="seats_offer"
            name="seats_offer"
            type="number"
            min="1"
            value={form.seats_offer}
            onChange={handleChange}
            placeholder="Enter capacity"
            required
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="amountPerSeat" style={labelStyle}>Estimated Amount (per seat)</label>
          <input
            id="amountPerSeat"
            name="amountPerSeat"
            type="number"
            min="0"
            value={form.amountPerSeat}
            onChange={handleChange}
            placeholder="Amount per seat"
            required
            style={fieldStyle}
          />
        </div>

        {error && <p style={{ color: "#c0392b", marginBottom: 16 }}>{error}</p>}

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
          {loading ? "Posting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

