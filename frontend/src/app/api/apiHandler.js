// apiHandler.js
class APIHandler {
  constructor() {
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_URL; // عنوان API
  }

  async request(method, endpoint, data = null, params = {}, headers = {}) {
    let url = `${this.apiBaseURL}${endpoint}`;
    const queryParams = new URLSearchParams(params).toString();
    if (queryParams) {
      url += `?${queryParams}`;
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers: requestHeaders,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API Error: ", error);
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async put(endpoint, data, params = {}, headers = {}) {
    return await this.request('PUT', endpoint, data, params, headers);
  }

  async post(endpoint, data, params = {}, headers = {}) {
    return await this.request('POST', endpoint, data, params, headers);
  }

  async get(endpoint, params = {}, headers = {}) {
    return await this.request('GET', endpoint, null, params, headers);
  }

  async delete(endpoint, params = {}, headers = {}) {
    return await this.request('DELETE', endpoint, null, params, headers);
  }
}



export { APIHandler };


