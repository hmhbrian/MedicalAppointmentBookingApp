export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  fullname: string;
  role: string;
  position: string | null;
}

export interface RegisterCredentials {
  fullname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: number;
  address: string;
  password: string;
  medicalHistory: string;
  insuranceNumber: string;
}