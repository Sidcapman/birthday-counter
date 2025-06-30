import axios from 'axios';
import { 
  Birthday, 
  CreateBirthdayRequest, 
  UpdateBirthdayRequest, 
  ApiResponse, 
  DatabaseStatus 
} from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.request.use((config) => {
  console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = handleApiError(error);
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);


export interface ApiError {
  type: 'network' | 'timeout' | 'validation' | 'not_found' | 'server' | 'unknown';
  message: string;
  statusCode?: number;
  validationErrors?: string[];
  originalError?: unknown;
}

function handleApiError(error: unknown): ApiError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosError = error as { response?: { status: number; data: any }; code?: string; message?: string };
  
  if (!axiosError.response) {
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        originalError: axiosError,
      };
    }
    
    if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Request timed out. The server is taking too long to respond.',
        originalError: axiosError,
      };
    }
    
    return {
      type: 'network',
      message: 'Network error. Please check your connection and try again.',
      originalError: error,
    };
  }

  const { status, data } = axiosError.response;
  
  
  switch (status) {
    case 400:
      if (data?.validationErrors?.length > 0) {
        return {
          type: 'validation',
          message: data.message || 'Validation failed',
          statusCode: status,
          validationErrors: data.validationErrors,
          originalError: axiosError,
        };
      }
      return {
        type: 'validation',
        message: data?.message || 'Bad request. Please check your input and try again.',
        statusCode: status,
        originalError: axiosError,
      };
      
    case 404:
      return {
        type: 'not_found',
        message: data?.message || 'The requested resource was not found.',
        statusCode: status,
        originalError: axiosError,
      };
      
    case 422:
      return {
        type: 'validation',
        message: data?.message || 'Validation failed',
        statusCode: status,
        validationErrors: data?.validationErrors || [],
        originalError: axiosError,
      };
      
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: 'server',
        message: 'Server error. Please try again later.',
        statusCode: status,
        originalError: axiosError,
      };
      
    default:
      return {
        type: 'unknown',
        message: data?.message || `An unexpected error occurred (${status})`,
        statusCode: status,
        originalError: axiosError,
      };
  }
}

export const birthdayApi = {
  
  getAllBirthdays: async (filters?: { eventType?: string; daysAhead?: number }): Promise<ApiResponse<Birthday[]>> => {
    const params: Record<string, string | number> = {};
    if (filters?.eventType) params.eventType = filters.eventType;
    if (filters?.daysAhead) params.daysAhead = filters.daysAhead;
    
    const response = await api.get('/birthdays', { params });
    return response.data;
  },

  
  getBirthdayById: async (id: string): Promise<ApiResponse<Birthday>> => {
    const response = await api.get(`/birthdays/${id}`);
    console.log(`Fetching birthday with ID: ${id}`, response);
    return response.data;
  },

  
  createBirthday: async (birthday: CreateBirthdayRequest): Promise<ApiResponse<Birthday>> => {
    const response = await api.post('/birthdays', birthday);

    return response.data;
  },

  
  updateBirthday: async (id: string, birthday: UpdateBirthdayRequest): Promise<ApiResponse<Birthday>> => {
    const response = await api.put(`/birthdays/${id}`, birthday);
    console.log(response)
    return response.data;
  },

  
  deleteBirthday: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/birthdays/${id}`);
    return response.data;
  },

  
  searchBirthdays: async (name: string): Promise<ApiResponse<Birthday[]>> => {
    const response = await api.get(`/birthdays/search`, { params: { name } });
    return response.data;
  },
};

export const databaseApi = {
  
  getStatus: async (): Promise<ApiResponse<DatabaseStatus>> => {
    const response = await api.get('/database/status');
    return response.data;
  },

  
  ping: async (): Promise<ApiResponse<DatabaseStatus>> => {
    const response = await api.get('/database/ping');
    return response.data;
  },
};

export default api;