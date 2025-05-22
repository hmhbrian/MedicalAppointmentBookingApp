import axiosInstance from './axiosInstance';
import { LoginResponse, LoginCredentials } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: {
  fullname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: number;
  address: string;
  password: string;
  medicalHistory: string;
  insuranceNumber: string;
}): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};