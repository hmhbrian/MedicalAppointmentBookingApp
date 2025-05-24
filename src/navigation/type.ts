
import { Appointment, Patient } from '../types/doctor';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Profile: undefined;
  Feedback: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProfileUser: undefined;
  UpdateProfile: {
    patient: Patient;
  }
  DoctorList: { specialtyId?: number };
  Booking: { doctorId: number };
  AppointmentDetail: {
    appointment: Appointment;
  };
  MedicalRecords: undefined;
};

export type AppointmentStackParamList = {
  AppointmentList: undefined;
  AppointmentDetail: {
    appointment: Appointment;
  };
};
