import { apiInstance } from './instanse';

export const login = async (username: string, password: string): Promise<any> => {
  const result = await apiInstance.post('/user/login', {
    username,
    password,
  });
  return result.data;
};

export const fetchSelf = async (): Promise<any> => {
  const result = await apiInstance.get('/user/me');
  return result.data;
};
