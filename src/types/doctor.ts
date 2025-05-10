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