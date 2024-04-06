import axios from 'axios';

async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
const images = fetchData('http://localhost:3300/aws/images')

export { images };
