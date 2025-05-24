export interface Doctor {
  fullname: string;
  email : string;
  phoneNumber :  string;
  dateOfBirth :  string;
  gender : number;
  address :  string;
  avatar_url: string;
  id: number;
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
  medicalHistory: string;
  insuranceNumber: string;
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

export interface MedicalRecordResponse {
  id: number;
  patientName: string;
  patientId: number;
  doctorName: string;
  doctorId: number;
  appointmentId: number;
  initialSymptoms: string;
  diagnosis: string;
  visitDate: string; 
  visitNumber: number;
}

export interface PrescriptionResponse {
  id: number;
  recordId: number;
  inpatientRecordId: number;
  doctorId: number;
  doctorName: string;
  pharmacistId: number;
  pharmacistName: string;
  status: string;
  prescriptionDate: string; 
  details: PrescriptionDetailResponse[];
}

export interface PrescriptionDetailResponse {
  id: number;
  medicineId: number;
  medicineName: string;
  quantity: number;
  dosage: string;
  notes: string;
}