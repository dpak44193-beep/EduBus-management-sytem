import axios from "axios";


const API_BASE_URL = "http://localhost:5000";

// GET students
export const getStudents = async () => {
  const res = await axios.get(`${API_BASE_URL}/students`);
  return res.data;
};

// ADD student
export const addStudent = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/students`, data);
  return res.data;
};