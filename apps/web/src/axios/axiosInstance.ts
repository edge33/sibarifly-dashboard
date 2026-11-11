import axios from 'axios';
import config from '../config';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    _index?: number;
  }
}

const backoff = (index: number) => 1000 * Math.pow(2, index);

const wait = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const axiosConfig = {
  baseURL: config.API_URL,
  timeout: 10000,
  _index: 0,
};

const instance = axios.create(axiosConfig);

instance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log(
      'error',
      error.response?.status,
      originalRequest._index,
      originalRequest._retry,
    );

    if (error && originalRequest._retry) {
      if (error.response.status === 401) {
        originalRequest.index;
        try {
          const response = await instance.post<{ token: string }>(
            '/auth/refreshToken',
          );

          setToken(response.data.token);
          return instance(originalRequest);
        } catch (error) {
          console.error(error);
        }
      }

      if (originalRequest._index < 5) {
        originalRequest._index = originalRequest._index + 1;
        console.log(
          'error waiting',
          backoff(originalRequest._index),
          originalRequest._index,
        );
        await wait(backoff(originalRequest._index));
        return instance(originalRequest);
      } else {
        setToken('');
      }
    }

    return Promise.reject(error);
  },
);

export const setToken = (token: string) => {
  if (token.length > 0) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;
