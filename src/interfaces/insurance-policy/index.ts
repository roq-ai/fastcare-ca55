import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface InsurancePolicyInterface {
  id?: string;
  insurance_agent_id?: string;
  policy_name: string;
  policy_details: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface InsurancePolicyGetQueryInterface extends GetQueryInterface {
  id?: string;
  insurance_agent_id?: string;
  policy_name?: string;
  policy_details?: string;
}
