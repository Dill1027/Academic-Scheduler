import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:6001/api", // Ensure this matches your backend URL
});

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