import * as yup from 'yup';

export const insurancePolicyValidationSchema = yup.object().shape({
  policy_name: yup.string().required(),
  policy_details: yup.string().required(),
  insurance_agent_id: yup.string().nullable(),
});
