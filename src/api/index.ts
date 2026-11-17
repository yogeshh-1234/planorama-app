import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { API_BASE_URL } from './urls';
import { OfflineAPI } from './offlineApi';
import { OfflineDB } from '../storage/offlineDB';

// OFFLINE MODE FLAG - Set to true for offline operation
const OFFLINE_MODE = true;

// Initialize offline database
if (OFFLINE_MODE) {
  OfflineDB.initializeDefaultData();
}

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
    // console.log(error)
    if (error.message === "Network Error") {
      // Handle network error
      // console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network error, please check your internet connection",
      });
    } else if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error Response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response:', error.request);
      return Promise.reject(
        error?.message
          ? error
          : {
              message: "No response received from server",
            }
      );
    } else {
      // Something else happened while setting up the request
      console.error('Error', error.message);
      return Promise.reject({ error: error.message });
    }
  },
);

export const fetchData = async <T,>(endpoint: string): Promise<T> => {
  if (OFFLINE_MODE) {
    // Offline mode - return mock data
    throw new Error('fetchData not implemented in offline mode');
  }
  
  try {
    const response: AxiosResponse<T> = await apiClient.get(`${endpoint}.php`);
    // console.log('response.data',response.data)
    return response.data;
  } catch (error) {
    // console.log('fetchData Error:',error)
    throw error;
  }
};

export const postData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  if (OFFLINE_MODE) {
    // Route to offline API based on endpoint and mode
    return routeOfflineRequest(endpoint, data) as Promise<R>;
  }
  
  try {
    console.log('formData',data)
    const response: AxiosResponse<R> = await apiClient.post(`${endpoint}.php`,data);
    console.log('response.data',endpoint,response.data)
    return response.data;
  } catch (error) {
    console.log('postData Error:',endpoint,error)
    throw error;
  }
};

// Route offline requests to appropriate handlers
async function routeOfflineRequest(endpoint: string, data: any): Promise<any> {
  const mode = data.mode;
  
  // Auth endpoints
  if (endpoint === 'login') {
    if (mode === 'SEND_OTP') return OfflineAPI.sendOTP(data);
    if (mode === 'VERIFY_OTP') return OfflineAPI.verifyOTP(data);
    if (mode === 'REGISTER') return OfflineAPI.register(data);
    if (mode === 'LOGOUT') return OfflineAPI.logout(data);
  }
  
  // Profile endpoints
  if (endpoint === 'profile') {
    if (mode === 'VIEW_PROFILE') return OfflineAPI.viewProfile(data);
    if (mode === 'UPDATE_PROFILE') return OfflineAPI.updateProfile(data);
    if (mode === 'UPDATE_DEVICE_TOKEN') return OfflineAPI.updateDeviceToken(data);
    if (mode === 'ADD_CONTACTS') return OfflineAPI.addContacts(data);
    if (mode === 'VIEW_CONTACTS') return OfflineAPI.viewContacts(data);
  }
  
  // Dashboard endpoints
  if (endpoint === 'dashboard') {
    if (mode === 'MY_EVT_LIST_UP' || mode === 'MY_EVT_LIST_PREV' || 
        mode === 'INV_EVT_LIST_UP' || mode === 'INV_EVT_LIST_PREV') {
      return OfflineAPI.getDashboardEvents(data);
    }
  }
  
  // Event endpoints
  if (endpoint === 'event') {
    if (mode === 'ADD_EVENT') return OfflineAPI.addEvent(data);
    if (mode === 'UPDATE_EVENT') return OfflineAPI.updateEvent(data);
    if (mode === 'VIEW_EVENT') return OfflineAPI.viewEvent(data);
    if (mode === 'DELETE_EVENT') return OfflineAPI.deleteEvent(data);
    if (mode === 'ADD_GALLERY') return OfflineAPI.addGallery(data);
    if (mode === 'VIEW_GALLERY') return OfflineAPI.viewGallery(data);
    if (mode === 'UPDATE_EVENT_CONFIG') return OfflineAPI.updateEventConfig(data);
    if (mode === 'VIEW_EVENT_CONFIG') return OfflineAPI.viewEventConfig(data);
    if (mode === 'VIEW_EVENT_GUEST') return OfflineAPI.viewEventGuests(data);
    if (mode === 'ADD_EVENT_GUEST') return OfflineAPI.addEventGuests(data);
    if (mode === 'UPDATE_GUESTS_RSVP') return OfflineAPI.updateGuestRSVP(data);
    if (mode === 'DELETE_EVENT_GUEST') return OfflineAPI.deleteEventGuest(data);
    if (mode === 'ADD_GUEST_SELF') return OfflineAPI.addGuestSelf(data);
    if (mode === 'VIEW_MESSAGES') return OfflineAPI.viewMessages(data);
    if (mode === 'ADD_MESSAGE') return OfflineAPI.addMessage(data);
    if (mode === 'GET_QUESTIONS') return OfflineAPI.getQuestions(data);
    if (mode === 'ADD_QUESTION') return OfflineAPI.addQuestion(data);
  }
  
  // WhatsApp endpoints
  if (endpoint === 'whatsapp') {
    if (mode === 'CHECK_CONNECTION') return OfflineAPI.checkConnection(data);
    if (mode === 'DISCONNECT_CONNECTION') return OfflineAPI.disconnectConnection(data);
    if (mode === 'GET_QR_MSG') return OfflineAPI.getQRMessage(data);
    if (mode === 'SEND_QR_EMAIL') return OfflineAPI.sendQREmail(data);
    if (mode === 'GET_TEMPLATES') return OfflineAPI.getWhatsAppTemplates(data);
    if (mode === 'SEND_MESSAGE') return OfflineAPI.sendWhatsAppMessage(data);
  }
  
  // Default fallback
  console.warn(`Unhandled offline request: ${endpoint} - ${mode}`);
  return {
    StatusCode: 200,
    data: {},
    message: 'Operation completed (offline mode)',
  };
}

// You can add more methods like putData, deleteData, etc.
