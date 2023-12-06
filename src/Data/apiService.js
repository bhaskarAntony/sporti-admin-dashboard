// apiService.js
import axios from 'axios';

const BASE_URL = 'https://backend-bp-bpdeveloperscommunity.onrender.com/api'; // Replace with your API endpoint

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
