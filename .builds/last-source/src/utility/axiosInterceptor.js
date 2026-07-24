/*eslint-disable */
import axios from "axios";
import { persistor } from "../redux/store";
// import * as dotenv from 'dotenv'
// dotenv.config()
import { SERVER_URL } from '../configs/config'
// import { toast } from 'react-toastify'
// let env = String(process.env.REACT_APP_ENVIRONMENT);
// let SERVER_URL = process.env[`REACT_APP_${env}_API_BASE_URL`];
let apiCall = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "X-Custom-Header": "foobar",
    // "ngrok-skip-browser-warning": "true",   
  },
});
apiCall.interceptors.request.use(
  function (req) {
    const token = localStorage.getItem("token");
    const slug = localStorage.getItem("slug");
    const agencyId = localStorage.getItem("agencyId");
    let userId = JSON.parse(localStorage.getItem("user"));

    if (token) {
      // Preserve existing headers (e.g. Accept) while injecting auth
      req.headers = {
        ...req.headers,
        token,
        agencyId,
        slug,
        userId: userId?.id,
      };
    }

    // Let the browser set multipart boundary for FormData uploads
    if (typeof FormData !== "undefined" && req.data instanceof FormData) {
      if (req.headers && typeof req.headers.delete === "function") {
        req.headers.delete("Content-Type");
        req.headers.delete("content-type");
      } else if (req.headers) {
        delete req.headers["Content-Type"];
        delete req.headers["content-type"];
      }
      // Axios may also keep Content-Type in common headers
      if (req.headers?.common) {
        delete req.headers.common["Content-Type"];
        delete req.headers.common["content-type"];
      }
      if (req.headers?.post) {
        delete req.headers.post["Content-Type"];
        delete req.headers.post["content-type"];
      }
    }
    
    return req;
  },
  (err) => {
    
    console.log("err", err);
    return Promise.reject(err);
  }
);

apiCall.interceptors.response.use(
  async (resp) => {
    if (resp?.data?.msg === "invalid token or expired token") {
      localStorage.clear();
        window.localStorage.removeItem('persist:root');
        persistor.pause()
    }
    if (resp?.data?.token) {
      const token = resp?.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("slug", resp?.data?.user?.agency?.slug);
      localStorage.setItem("agencyId", resp?.data?.user.agencyId);
      localStorage.setItem(
        "themecolor",
        resp?.data?.user?.agency?.themecolor || "#323D76"
      );
      return resp;
    }
    if (resp?.data) {
      return resp.data;
    }

    return resp;
  },
  (err) => {
    console.log("err", err);
    return Promise.reject(err);
  }
);

export default apiCall;
