import axios from 'axios';

export const makeApiCall = async (url, method = 'get', data = null) => {
  try {
    const response = await axios({
      method,
      url,
      data,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};