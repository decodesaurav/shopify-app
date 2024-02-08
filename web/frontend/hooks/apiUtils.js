// useApiCall.js
import { useAuthenticatedFetch } from '../hooks/index.js';

export const useApiCall = () => {
  const fetch = useAuthenticatedFetch();

  const makeApiCall = async (url, method = 'get', data = null) => {
    try {
      console.log(data, url, method);

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      return { data: response.data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };

  return makeApiCall;
};
