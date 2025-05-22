export interface Doctor {
  fullname: string;
  email : string;
  phoneNumber :  string;
  dateOfBirth :  string;
  gender : number;
  address :  string;
  avatar_url: string;
  doctorId: number;
  doctorcode: string;
  department: string;
  specialty: string;
  experienceYears : number;
  certificationName :  string;
  issuedBy :  string;
  issueDate :  string;
}

export interface Specialty {
  id: number;
  name: string;
  description: string;
  icon: string; // Placeholder for icon name (e.g., from react-native-vector-icons)
}

export interface Department {
  id: number;
  name: string;
}

export interface Schedule {
  id: number;
  date: string;
  status: string;
  shift: string;
  start_time: string;
  end_time: string;
  location: string;
  maxPatients: number;
  bookedPatients: number;
}

export interface Patient {
  id: number;
  fullname: string; 
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: number,
  address: string,
  avatar_url: string,
  patientcode: string,
  medical_history: string | null;
  insurance_number: string | null;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  doctorScheduleId: number;
  roomName: string;
  appointmentDate: string;
  presentTime: string;
  appointmentTime: string;
  status: string;
}

export interface Feedback {
  id: number;
  patientId: number;
  //patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}