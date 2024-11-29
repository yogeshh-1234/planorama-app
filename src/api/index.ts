import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { API_BASE_URL } from './urls';


const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    // 'Content-Type': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

// Add a request interceptor to add token or any other config if needed
apiClient.interceptors.request.use(
  config => {
    // Modify config (like adding token to headers) before the request is sent
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Error handling 
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.log('Error Response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log('Error No Response:', error.request);
      return Promise.reject('No response received from server');
    } else {
      // Something else happened while setting up the request
      console.log('Error', error.message);
      return Promise.reject(error.message);
    }
  },
);

export const fetchData = async <T,>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(`${endpoint}.php`);
    console.log('response.data',response.data)
    return response.data;
  } catch (error) {
    console.log('fetchData Error:',error)
    throw error;
  }
};

export const postData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    console.log('formData',data)
    const response: AxiosResponse<R> = await apiClient.post(`${endpoint}.php`,data);
    console.log('response.data',response.data)
    return response.data;
  } catch (error) {
    console.log('postData Error:',error)
    throw error;
  }
};

// You can add more methods like putData, deleteData, etc.
