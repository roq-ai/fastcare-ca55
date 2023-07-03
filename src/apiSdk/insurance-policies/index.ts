import axios from 'axios';
import queryString from 'query-string';
import { InsurancePolicyInterface, InsurancePolicyGetQueryInterface } from 'interfaces/insurance-policy';
import { GetQueryInterface } from '../../interfaces';

export const getInsurancePolicies = async (query?: InsurancePolicyGetQueryInterface) => {
  const response = await axios.get(`/api/insurance-policies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInsurancePolicy = async (insurancePolicy: InsurancePolicyInterface) => {
  const response = await axios.post('/api/insurance-policies', insurancePolicy);
  return response.data;
};

export const updateInsurancePolicyById = async (id: string, insurancePolicy: InsurancePolicyInterface) => {
  const response = await axios.put(`/api/insurance-policies/${id}`, insurancePolicy);
  return response.data;
};

export const getInsurancePolicyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/insurance-policies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInsurancePolicyById = async (id: string) => {
  const response = await axios.delete(`/api/insurance-policies/${id}`);
  return response.data;
};
