import axiosInstance from './axiosInstance';
import { LoginResponse, LoginCredentials } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};