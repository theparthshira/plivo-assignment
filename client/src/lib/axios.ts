import axios from "axios";

const BASE_URL = "http://localhost:8080";

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
