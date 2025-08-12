import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";


const client = axios.create({
  baseURL: import.meta.env.VITE_BACKENT_URL,
});


// Request Interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);
// Response Interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => {
    
    return response.data;
  },
  async (error) => {
    
  
      return Promise.reject(new Error(error.response.data.message));
    }
  
);

export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    return await client(options);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error("unexpted error");
    }
  }
};


