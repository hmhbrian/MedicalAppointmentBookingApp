import axiosInstance from './axiosInstance';
import { Doctor, Specialty, Schedule, Patient, Appointment, Feedback } from '../types/doctor';

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

export const getDoctorById = async (doctorId: number): Promise<Doctor> => {
  const response = await axiosInstance.get(`/doctors/${doctorId}`);
  return response.data;
};

export const getDoctorSchedules = async (doctorId: number): Promise<Schedule[]> => {
  const response = await axiosInstance.get(`/schedules/doctor/${doctorId}`);
  return response.data;
};

export const createAppointment = async (appointmentData: {
  patientId: number;
  doctorId: number;
  doctorScheduleId: number;
  appointmentTime: string;
}) => {
  const response = await axiosInstance.post('/appointments', appointmentData);
  return response.data;
};

export const getPatientByUserId = async (userId: number): Promise<Patient> => {
  const response = await axiosInstance.get(`/patients/${userId}`);
  return response.data;
};

export const getAppointmentsByPatientId = async (patientId: number): Promise<Appointment[]> => {
  const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
  return response.data;
};

export const cancelAppointmentById = async (
  appointmentId: number,
  reason: string,
  updatedByUserId: number
) => {
  const res = await axiosInstance.post('/appointments/status', {
    appointmentId,
    status: 'hủy',
    reason,
    updatedByUserId,
  });

  return res.data;
};

export const createFeedback = async (
  patientId: number,
  rating: number,
  comment: string
) => {
  const res = await axiosInstance.post('/feedbacks', {
    patientId,
    rating,
    comment,
  });

  return res.data;
};

export const getFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axiosInstance.get('/feedbacks');
  return response.data;
};

export const updateProfile = async (patientId: number, updatedData: Partial<Patient>): Promise<Patient> => {
  const res = await axiosInstance.put('/patients', { patientId, ...updatedData });
  return res.data;
};