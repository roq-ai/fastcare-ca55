import * as yup from 'yup';

export const patientRecordValidationSchema = yup.object().shape({
  patient_name: yup.string().required(),
  patient_details: yup.string().required(),
  medical_staff_id: yup.string().nullable(),
});
