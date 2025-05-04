import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:6001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor for error handling
api.interceptors.request.use(
  config => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Enhance error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      console.error('Access forbidden. Please check your credentials.');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error. Please check if the backend server is running.');
    }
    return Promise.reject(error);
  }
);

export const generateTimetables = async () => {
  return await api.post("/timetables/generate");
};

export const getAllTimetables = async () => {
  return await api.get("/timetables");
};

export const getFilteredTimetables = async (year, specialization) => {
  const params = {};
  if (year) params.year = year;
  if (specialization) params.specialization = specialization;

  return await api.get("/timetables/filter", { params });
};

export const getTimetableList = async () => {
  return await api.get("/timetables/list");
};

export const deleteTimetableEntry = async (id) => {
  return await api.delete(`/timetables/${id}`);
};

export const editTimetableEntry = async (id, data) => {
  return await api.put(`/timetables/${id}`, data);
};