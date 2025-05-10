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
  DoctorList: { specialtyId?: number };
};