import * as yup from 'yup';

export const medicineInventoryValidationSchema = yup.object().shape({
  medicine_name: yup.string().required(),
  medicine_details: yup.string().required(),
  pharmacy_staff_id: yup.string().nullable(),
});
