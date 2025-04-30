import axios from "axios";

// Create axios instance with better defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:6001/api",
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true // If using cookies/sessions
});

// Request interceptor for logging and auth tokens
api.interceptors.request.use(config => {
  console.log(`[API] Sending ${config.method?.toUpperCase()} to ${config.url}`);
  // Add auth token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('[API] Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for consistent error handling
api.interceptors.response.use(response => {
  console.log('[API] Response received:', response.config.url, response.status);
  return response.data; // Return only the data part
}, error => {
  console.error('[API] Response error:', error.response?.status, error.message);
  
  if (error.code === 'ERR_NETWORK') {
    throw new Error('Unable to connect to server. Please check if the backend is running.');
  }
  
  if (error.response?.status === 403) {
    throw new Error('CORS error - please check server configuration');
  }

  if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
  }
  
  // Handle specific error cases
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break;
      case 404:
        return []; // Return empty array for 404
      case 500:
        // Handle server error
        break;
    }
  }
  
  throw error;
});

/**
 * Fetch timetables by year with enhanced error handling
 * @param {number} year - Academic year to fetch
 * @returns {Promise<Array>} Array of timetables
 */
export const fetchTimetablesByYear = async (year) => {
  try {
    if (!year || typeof year !== 'number') {
      throw new Error('Invalid year parameter');
    }

    const retryDelay = 2000; // 2 seconds
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await api.get(`/timetables/filter`, {
          params: { year }
        });
        return response;
      } catch (error) {
        if (error.response?.status === 429 && retries > 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retries--;
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Generate timetables with enhanced error handling
 * @param {number} count - Number of timetables to generate
 * @returns {Promise<Object>} Generated timetables
 */
export const generateTimetables = async (count = 5) => {
  try {
    const response = await api.post("/timetables/generate", { count });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to generate timetables");
  }
};

export const getAllTimetables = async () => {
  try {
    const response = await api.get("/timetables");
    return { data: response?.data || [] };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [] };
  }
};

export const getFilteredTimetables = async (filters = {}) => {
  try {
    console.log('Filtering with:', filters);

    const params = {};
    if (filters.year) params.year = Number(filters.year);
    if (filters.specialization) params.specialization = filters.specialization;

    const response = await api.get("/timetables/filter", { params });
    
    // Handle both array and object responses
    const data = response.data || response || [];
    return {
      data: Array.isArray(data) ? data : data.data || []
    };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [] };
  }
};

export const generateTimetablesForYearSpec = async (year, specialization) => {
  try {
    // First generate timetables
    await generateTimetables();
    
    // Then fetch filtered timetables
    const response = await getFilteredTimetables({
      year: Number(year),
      specialization: decodeURIComponent(specialization)
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Named exports preferred over default export
export default {
  fetchTimetablesByYear,
  generateTimetables,
  getAllTimetables,
  getFilteredTimetables,
  generateTimetablesForYearSpec,
};