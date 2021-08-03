import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: 'http://localhost:9292',
  withCredentials: true,
});
