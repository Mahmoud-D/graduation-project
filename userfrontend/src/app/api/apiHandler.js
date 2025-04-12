const API_BASE_URL = "http://localhost:3000/api"; // غيّره حسب مشروعك

class ApiHandler {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // helper to get token based on environment
  getToken() {
    // client-side only
    if (typeof window !== "undefined") {
      return localStorage.getItem("token"); // أو sessionStorage حسب استخدامك
    }

    // server-side: ممكن تعدلها لو فيه طريقة تانية بتجيب منها التوكين
    return null;
  }

  async request(endpoint, method = "GET", data = null) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const options = {
        method,
        headers,
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      return await response.json();
    } catch (err) {
      console.error(`[API ${method}] Error:`, err.message);
      throw err;
    }
  }

  get(endpoint) {
    return this.request(endpoint, "GET");
  }

  post(endpoint, data) {
    return this.request(endpoint, "POST", data);
  }

  put(endpoint, data) {
    return this.request(endpoint, "PUT", data);
  }

  delete(endpoint) {
    return this.request(endpoint, "DELETE");
  }
}

const api = new ApiHandler(API_BASE_URL);
export default api;
