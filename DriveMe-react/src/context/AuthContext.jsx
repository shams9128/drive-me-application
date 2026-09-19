import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  getIncomingRideRequests,
  markIncomingRideRequestsSeen,
  getMyRideRequests,
  markMyRideRequestsSeen,
  acceptRideRequest,
  rejectRideRequest,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Driver-facing: requests other people have made against rides this user
  // offered (see Navbar's "Ride requests for you" section).
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);

  // Rider-facing: the status of rides this user has booked, so they find out
  // once the driver accepts or rejects (see Navbar's "Your bookings" section).
  const [myBookings, setMyBookings] = useState([]);
  const [myBookingsUnseenCount, setMyBookingsUnseenCount] = useState(0);

  // On first load, ask the backend if this browser already has a logged-in
  // session (JSESSIONID cookie) so a page refresh doesn't lose the login.
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnseenCount(0);
      return;
    }
    try {
      const data = await getIncomingRideRequests();
      setNotifications(data.requests || []);
      setUnseenCount(data.unseenCount || 0);
    } catch {
      // Not fatal — the driver just won't see a badge until the next check.
    }
  }, [user]);

  const refreshMyBookings = useCallback(async () => {
    if (!user) {
      setMyBookings([]);
      setMyBookingsUnseenCount(0);
      return;
    }
    try {
      const data = await getMyRideRequests();
      setMyBookings(data.requests || []);
      setMyBookingsUnseenCount(data.unseenCount || 0);
    } catch {
      // Not fatal — the rider just won't see a badge until the next check.
    }
  }, [user]);

  // Whenever the logged-in user changes (fresh login, or an existing session
  // restored on page load), check both directions: has anyone booked one of
  // this user's offered rides, and has a driver responded to a ride this
  // user booked. This is what actually notifies people about either event —
  // previously nothing in the app surfaced either one.
  useEffect(() => {
    refreshNotifications();
    refreshMyBookings();
  }, [refreshNotifications, refreshMyBookings]);

  async function markNotificationsSeen() {
    if (!user) return;
    try {
      await markIncomingRideRequestsSeen();
      setUnseenCount(0);
    } catch {
      // Ignore — worst case the badge count just shows again next time.
    }
  }

  async function markMyBookingsSeen() {
    if (!user) return;
    try {
      await markMyRideRequestsSeen();
      setMyBookingsUnseenCount(0);
    } catch {
      // Ignore — worst case the badge count just shows again next time.
    }
  }

  // The driver accepting or rejecting one incoming request. Re-fetches the
  // driver's own notification list afterwards so the buttons in the dropdown
  // immediately reflect the new status instead of staying stale until the
  // next login/refresh.
  async function respondToRequest(reqId, action) {
    try {
      if (action === "accept") {
        await acceptRideRequest(reqId);
      } else {
        await rejectRideRequest(reqId);
      }
      await refreshNotifications();
      return true;
    } catch {
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        notifications,
        unseenCount,
        refreshNotifications,
        markNotificationsSeen,
        respondToRequest,
        myBookings,
        myBookingsUnseenCount,
        refreshMyBookings,
        markMyBookingsSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
