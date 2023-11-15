// apiService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3300/api'; // Replace with your API endpoint

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
