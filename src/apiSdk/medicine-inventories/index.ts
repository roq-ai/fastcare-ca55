import axios from 'axios';
import queryString from 'query-string';
import { MedicineInventoryInterface, MedicineInventoryGetQueryInterface } from 'interfaces/medicine-inventory';
import { GetQueryInterface } from '../../interfaces';

export const getMedicineInventories = async (query?: MedicineInventoryGetQueryInterface) => {
  const response = await axios.get(`/api/medicine-inventories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMedicineInventory = async (medicineInventory: MedicineInventoryInterface) => {
  const response = await axios.post('/api/medicine-inventories', medicineInventory);
  return response.data;
};

export const updateMedicineInventoryById = async (id: string, medicineInventory: MedicineInventoryInterface) => {
  const response = await axios.put(`/api/medicine-inventories/${id}`, medicineInventory);
  return response.data;
};

export const getMedicineInventoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/medicine-inventories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMedicineInventoryById = async (id: string) => {
  const response = await axios.delete(`/api/medicine-inventories/${id}`);
  return response.data;
};
