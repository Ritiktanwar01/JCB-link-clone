const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.jcb-digital.in/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiCall = async (endpoint: string, options: FetchOptions = {}) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  register: async (email: string, password: string, name: string) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  verifyToken: async () => {
    return await apiCall('/auth/verify', {
      method: 'GET',
    });
  },

  resetPassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  },

  logout: () => {
    removeAuthToken();
  },
};

// Vehicle API calls
export const vehicleAPI = {
  getVehicles: async () => {
    return await apiCall('/vehicles', {
      method: 'GET',
    });
  },

  getVehicle: async (id: string) => {
    return await apiCall(`/vehicles/${id}`, {
      method: 'GET',
    });
  },

  createVehicle: async (vehicleData: any) => {
    return await apiCall('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  updateVehicle: async (id: string, vehicleData: any) => {
    return await apiCall(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  deleteVehicle: async (id: string) => {
    return await apiCall(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },

  getDashboardStats: async () => {
    return await apiCall('/vehicles/stats', {
      method: 'GET',
    });
  },
};
