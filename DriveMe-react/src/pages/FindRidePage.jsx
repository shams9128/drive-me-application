import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { searchRides, acceptRide } from "../api/client";

const fieldStyle = {
  width: "100%",
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
  boxSizing: "border-box",
};

const labelStyle = { display: "block", marginBottom: 6, fontSize: 14 };

export default function FindRidePage() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ ride_start_point: "", ride_end_point: "", ride_start_date: "" });
  const [results, setResults] = useState(null); // null = no search yet
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedIds, setAcceptedIds] = useState(new Set());
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setAcceptError("");
    setLoading(true);
    try {
      const rides = await searchRides(form);
      setResults(rides);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.error || "Could not search for rides right now.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(orId) {
    setAcceptError("");
    setAcceptingId(orId);
    try {
      await acceptRide(orId);
      setAcceptedIds((prev) => new Set(prev).add(orId));
    } catch (err) {
      setAcceptError(err.response?.data?.error || "Could not accept this ride.");
    } finally {
      setAcceptingId(null);
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
        <h2 style={{ marginBottom: 12 }}>Find a Ride</h2>
        <p style={{ color: "#555", marginBottom: 20 }}>
          Please log in to search for available rides.
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

  return (
    <div style={{ maxWidth: 760, margin: "50px auto", padding: "0 20px", fontFamily: "Montserrat, sans-serif" }}>
      <h2 style={{ marginBottom: 8 }}>Find a Ride</h2>
      <p style={{ color: "#777", marginBottom: 24, fontSize: 14 }}>
        Search for rides other drivers have offered on your route.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 32,
          alignItems: "end",
        }}
      >
        <div>
          <label htmlFor="ride_start_point" style={labelStyle}>Start Point</label>
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
        <div>
          <label htmlFor="ride_end_point" style={labelStyle}>Drop Location</label>
          <input
            id="ride_end_point"
            name="ride_end_point"
            value={form.ride_end_point}
            onChange={handleChange}
            placeholder="Enter the drop location"
            required
            style={fieldStyle}
          />
        </div>
        <div>
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
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 20px",
            background: "#4286f4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: 15,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
            height: 42,
          }}
        >
          <Search size={16} /> {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "#c0392b", marginBottom: 16 }}>{error}</p>}
      {acceptError && <p style={{ color: "#c0392b", marginBottom: 16 }}>{acceptError}</p>}

      {searched && (
        <>
          {results && results.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map((ride) => {
                const accepted = acceptedIds.has(ride.or_id);
                return (
                  <div
                    key={ride.or_id}
                    style={{
                      border: "1px solid #e7e7e7",
                      borderRadius: 6,
                      padding: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
                        {ride.offerFirstName} {ride.offerLastName}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} /> {ride.ride_start_point} → {ride.ride_end_point}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: 14, color: "#555" }}>
                        Start time: {ride.ride_start_time || "—"}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
                        <Phone size={14} /> {ride.offerContatcNumber}
                      </p>
                      <p style={{ margin: 0, fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
                        <Users size={14} /> {ride.seats_available} seat(s) available
                        {ride.amountPerSeat != null && ` · ₹${ride.amountPerSeat}/seat`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAccept(ride.or_id)}
                      disabled={accepted || acceptingId === ride.or_id}
                      style={{
                        padding: "8px 20px",
                        background: accepted ? "#1abc9c" : "#4286f4",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: accepted ? "default" : "pointer",
                        opacity: acceptingId === ride.or_id ? 0.7 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {accepted ? "Requested" : acceptingId === ride.or_id ? "Requesting..." : "Accept"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#555" }}>No rides available for your request.</p>
          )}
        </>
      )}
    </div>
  );
}

