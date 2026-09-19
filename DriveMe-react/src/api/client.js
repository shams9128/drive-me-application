import axios from "axios";

// Spring Boot backend URL. Reads VITE_API_BASE_URL at build time (set this
// in Vercel's project settings to your deployed backend, e.g.
// https://driveme-backend.onrender.com) and falls back to the local dev
// server (see server.port in application.properties) when it's unset.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive the JSESSIONID cookie across origins
});

export async function login(usr_name, usr_password) {
  const { data } = await client.post("/api/login", { usr_name, usr_password });
  return data;
}

export async function signup(payload) {
  const { data } = await client.post("/api/signup", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await client.get("/api/me");
  return data;
}

export async function logout() {
  await client.post("/api/logout");
}

export async function searchRides({ ride_start_point, ride_end_point, ride_start_date }) {
  const { data } = await client.post("/api/rides/search", {
    ride_start_point,
    ride_end_point,
    ride_start_date,
  });
  return data;
}

export async function offerRide(payload) {
  const { data } = await client.post("/api/rides/offer", payload);
  return data;
}

export async function acceptRide(orId) {
  const { data } = await client.post(`/api/rides/${orId}/accept`);
  return data;
}

// Notifies a driver about bookings made against rides they offered.
// Returns { unseenCount, requests: [...] }.
export async function getIncomingRideRequests() {
  const { data } = await client.get("/api/rides/incoming-requests");
  return data;
}

export async function markIncomingRideRequestsSeen() {
  await client.post("/api/rides/incoming-requests/mark-seen");
}

// Driver accepting/rejecting one incoming ride request.
export async function acceptRideRequest(reqId) {
  await client.post(`/api/rides/requests/${reqId}/accept`);
}

export async function rejectRideRequest(reqId) {
  await client.post(`/api/rides/requests/${reqId}/reject`);
}

// Notifies a rider about the driver's decision on rides they've booked.
// Returns { unseenCount, requests: [...] }.
export async function getMyRideRequests() {
  const { data } = await client.get("/api/rides/my-requests");
  return data;
}

export async function markMyRideRequestsSeen() {
  await client.post("/api/rides/my-requests/mark-seen");
}

export default client;
