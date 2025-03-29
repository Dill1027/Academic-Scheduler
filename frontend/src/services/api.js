import axios from 'axios';

const API_URL = 'http://localhost:5001/api/timetables';

export const generateTimetables = () => {
  return axios.post(`${API_URL}/generate`);
};

export const getAllTimetables = () => {
  return axios.get(API_URL);
};

export const getFilteredTimetables = (year, specialization) => {
  return axios.get(`${API_URL}/filter`, {
    params: { year, specialization }
  });
};