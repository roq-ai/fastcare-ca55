import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PatientRecordInterface {
  id?: string;
  medical_staff_id?: string;
  patient_name: string;
  patient_details: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PatientRecordGetQueryInterface extends GetQueryInterface {
  id?: string;
  medical_staff_id?: string;
  patient_name?: string;
  patient_details?: string;
}
