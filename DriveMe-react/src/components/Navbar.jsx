import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logout as apiLogout } from "../api/client";

const ACCENT = "#1abc9c";

const smallBtnBase = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "normal",
  textTransform: "none",
  borderRadius: 4,
  padding: "4px 10px",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [respondingId, setRespondingId] = useState(null);
  const {
    user,
    setUser,
    notifications,
    unseenCount,
    markNotificationsSeen,
    respondToRequest,
    myBookings,
    myBookingsUnseenCount,
    markMyBookingsSeen,
  } = useAuth();

  const totalUnseen = unseenCount + myBookingsUnseenCount;

  const navLinks = [
    { label: "Find Ride", to: "/findride" },
    { label: "Offer Ride", to: "/offerride" },
    { label: "About", to: "/about" },
  ];

  async function handleLogout() {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }

  function toggleNotifications() {
    const willOpen = !notifOpen;
    setNotifOpen(willOpen);
    if (willOpen) {
      if (unseenCount > 0) {
        markNotificationsSeen();
      }
      if (myBookingsUnseenCount > 0) {
        markMyBookingsSeen();
      }
    }
  }

  async function handleRespond(reqId, action) {
    setRespondingId(reqId);
    await respondToRequest(reqId, action);
    setRespondingId(null);
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid #e7e7e7",
        padding: "15px 0",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1170,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#333",
            textDecoration: "none",
            letterSpacing: 1,
          }}
        >
          DriveMe.com
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            background: "none",
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 8,
            cursor: "pointer",
          }}
          className="driveme-navbar-toggle"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Links */}
        <ul
          className={`driveme-nav-links ${open ? "is-open" : ""}`}
          style={{
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            gap: 28,
            margin: 0,
            padding: 0,
            fontSize: 12,
            letterSpacing: 3,
          }}
        >
          {!user && (
            <li>
              <Link
                to="/loginPage"
                style={{ color: "#333", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                LOGIN
              </Link>
            </li>
          )}

          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                style={{
                  color: "#333",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                {link.label.toUpperCase()}
              </Link>
            </li>
          ))}

          <li>
            <a
              href="#"
              style={{ color: "#333", textDecoration: "none", transition: "color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
            >
              CONTACT US
            </a>
          </li>

          {user && (
            <li style={{ position: "relative" }}>
              <button
                onClick={toggleNotifications}
                aria-label="Ride request notifications"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#333",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                <Bell size={18} />
                {totalUnseen > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -8,
                      background: "#e74c3c",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: 16,
                      height: 16,
                      fontSize: 10,
                      lineHeight: "16px",
                      textAlign: "center",
                      padding: "0 3px",
                    }}
                  >
                    {totalUnseen > 9 ? "9+" : totalUnseen}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 14px)",
                    right: 0,
                    width: 320,
                    maxHeight: 420,
                    overflowY: "auto",
                    background: "#fff",
                    border: "1px solid #e7e7e7",
                    borderRadius: 6,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    padding: 12,
                    textTransform: "none",
                    letterSpacing: "normal",
                    zIndex: 20,
                  }}
                >
                  <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 13, color: "#333" }}>
                    Ride requests for you
                  </p>
                  {notifications.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 13, color: "#777" }}>
                      No one has booked your rides yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {notifications.map((n) => {
                        const pending = !n.status || n.status === "pending";
                        return (
                          <div
                            key={n.reqId}
                            style={{
                              fontSize: 13,
                              color: "#333",
                              borderBottom: "1px solid #f0f0f0",
                              paddingBottom: 8,
                            }}
                          >
                            <strong>
                              {n.riderFirstName} {n.riderLastName}
                            </strong>{" "}
                            booked your ride
                            <br />
                            {n.rideStartPoint} → {n.rideEndPoint} on {n.rideStartDate}
                            <br />
                            <span style={{ color: "#777" }}>Contact: {n.riderContact}</span>
                            {pending ? (
                              <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                                <button
                                  onClick={() => handleRespond(n.reqId, "accept")}
                                  disabled={respondingId === n.reqId}
                                  style={{
                                    ...smallBtnBase,
                                    border: "none",
                                    background: ACCENT,
                                    color: "#fff",
                                    opacity: respondingId === n.reqId ? 0.6 : 1,
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRespond(n.reqId, "reject")}
                                  disabled={respondingId === n.reqId}
                                  style={{
                                    ...smallBtnBase,
                                    border: "1px solid #e74c3c",
                                    background: "#fff",
                                    color: "#e74c3c",
                                    opacity: respondingId === n.reqId ? 0.6 : 1,
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div
                                style={{
                                  marginTop: 4,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: n.status === "accepted" ? ACCENT : "#e74c3c",
                                }}
                              >
                                {n.status === "accepted" ? "Accepted" : "Rejected"}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p style={{ margin: "16px 0 10px", fontWeight: 600, fontSize: 13, color: "#333" }}>
                    Your bookings
                  </p>
                  {myBookings.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 13, color: "#777" }}>
                      You haven't booked any rides yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {myBookings.map((b) => {
                        const label =
                          b.status === "accepted"
                            ? "Accepted by driver"
                            : b.status === "rejected"
                            ? "Rejected by driver"
                            : "Waiting for the driver to respond...";
                        const color =
                          b.status === "accepted" ? ACCENT : b.status === "rejected" ? "#e74c3c" : "#777";
                        return (
                          <div
                            key={b.reqId}
                            style={{
                              fontSize: 13,
                              color: "#333",
                              borderBottom: "1px solid #f0f0f0",
                              paddingBottom: 8,
                            }}
                          >
                            Ride with{" "}
                            <strong>
                              {b.driverFirstName} {b.driverLastName}
                            </strong>
                            <br />
                            {b.rideStartPoint} → {b.rideEndPoint} on {b.rideStartDate}
                            <br />
                            <span style={{ fontWeight: 600, color }}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </li>
          )}

          {user && (
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#333",
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                LOGOUT ({user.firstName || user.usr_name})
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Responsive behaviour without a CSS build step */}
      <style>{`
        @media (max-width: 767px) {
          .driveme-navbar-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
          .driveme-nav-links {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
            max-height: 0;
            overflow: hidden;
            width: 100%;
            padding: 0 20px !important;
            transition: max-height 0.2s ease;
          }
          .driveme-nav-links.is-open {
            max-height: 260px;
            padding-top: 16px !important;
          }
        }
      `}</style>
    </nav>
  );
}
