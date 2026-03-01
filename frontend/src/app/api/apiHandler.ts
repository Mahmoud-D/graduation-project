class APIHandler {
  constructor() {
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
    this.tokenKey = 'token';
  }

  getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
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
    
    const token = this.getToken();
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
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: responseData.message || response.statusText || 'Request failed',
          data: responseData,
          error: true
        };
      }
      
      return {
        success: true,
        status: response.status,
        data: responseData,
        message: responseData.message || 'Success'
      };
    } catch (error) {
      console.error("API Error: ", error);
      return {
        success: false,
        status: 0,
        message: error.message || 'Network error',
        error: true
      };
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