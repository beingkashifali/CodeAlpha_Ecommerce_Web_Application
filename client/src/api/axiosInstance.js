import axios from "axios";

// withCredentials is required so the httpOnly auth cookie is sent on every
// request. Without it (and matching `credentials: true` in the backend's
// cors() config), login will appear to work but silently "not stick".
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default axiosInstance;
