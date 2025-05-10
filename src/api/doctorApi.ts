import axiosInstance from './axiosInstance';
import { Doctor, Specialty } from '../types/doctor';

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await axiosInstance.get('/doctors');
  return response.data;
};

export const getSpecialties = async (): Promise<Specialty[]> => {
  const response = await axiosInstance.get('/specialties');
  return response.data;
};

export const getDoctorsBySpecialty = async (specialtyId: number): Promise<Doctor[]> => {
  const response = await axiosInstance.get(`doctors/specialty/${specialtyId}`);
  return response.data;
};