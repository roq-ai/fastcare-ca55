import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MedicineInventoryInterface {
  id?: string;
  pharmacy_staff_id?: string;
  medicine_name: string;
  medicine_details: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MedicineInventoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  pharmacy_staff_id?: string;
  medicine_name?: string;
  medicine_details?: string;
}
