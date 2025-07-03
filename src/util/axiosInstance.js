import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const getAuthToken = () => sessionStorage.getItem("authToken");
const removeAuthToken = () => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("name");
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true; // If decoding fails, treat the token as expired
  }
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  // baseURL: "https://erp-backend-production-ae66.up.railway.app/api",
  // baseURL: "https://0bda-97-74-89-203.ngrok-free.app/api",
  // baseURL: "https://smmerp-production.up.railway.app/api",
  // baseURL: "https://backend.smminfratech.in:8086/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Add this line
  },
});

const redirectToSignIn = (navigate) => {
  removeAuthToken();
  navigate("/auth/signin", { replace: true });
  window.location.reload();
};

let isRedirecting = false;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      if (isTokenExpired(token)) {
        removeAuthToken();
        window.location.reload();
        const navigate = useNavigate();
        navigate("/auth/signin"); // Redirect to the sign-in page
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = token; // Attach token to headers
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.error("Unauthorized: Token might be invalid or expired.");
        if (!isRedirecting) {
          isRedirecting = true;
          const navigate = useNavigate();
          redirectToSignIn(navigate);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
