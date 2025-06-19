import axios from "axios";

const BASE_URL = `https://${import.meta.env.VITE_CLERK_BASE_URL}`;

const generalMiddleware = axios.create({
  baseURL: BASE_URL,
});

generalMiddleware.interceptors.request.use(async (requestConfig) => {
  //   requestConfig.headers = {
  //     'ngrok-skip-browser-warning': true,
  //     Authorization: `Bearer ${tokens}`,
  //   };
  return requestConfig;
});

export default generalMiddleware;
