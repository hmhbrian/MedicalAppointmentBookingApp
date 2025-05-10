export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullname: string;
    role: string;
  };
}