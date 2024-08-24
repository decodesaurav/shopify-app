// useApiCall.js
import { useAuthenticatedFetch } from '../hooks/index.js';

export const useApiCall = () => {
  const fetch = useAuthenticatedFetch();

  const makeApiCall = async (url, method = 'get', data = null) => {
    try {
      console.log(data, url, method);

      const response = await fetch(url, {
		method: method,
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		...(method === 'POST' ? { body: JSON.stringify(data) } : {})
	  });
	  const responseData = await response.json();
	  console.log(responseData.data)
      return { data: responseData.data, count: responseData.count, error: null, redirectToPricing: responseData.redirectToPricing };
    } catch (error) {
      return { data: null, count:null, error };
    }
  };

  return makeApiCall;
};
