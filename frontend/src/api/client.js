// Axios instance used by the frontend to call backend APIs
import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:4000",
});
