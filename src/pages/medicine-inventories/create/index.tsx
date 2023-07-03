import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMedicineInventory } from 'apiSdk/medicine-inventories';
import { Error } from 'components/error';
import { medicineInventoryValidationSchema } from 'validationSchema/medicine-inventories';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { MedicineInventoryInterface } from 'interfaces/medicine-inventory';

function MedicineInventoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MedicineInventoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMedicineInventory(values);
      resetForm();
      router.push('/medicine-inventories');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MedicineInventoryInterface>({
    initialValues: {
      medicine_name: '',
      medicine_details: '',
      pharmacy_staff_id: (router.query.pharmacy_staff_id as string) ?? null,
    },
    validationSchema: medicineInventoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Medicine Inventory
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="medicine_name" mb="4" isInvalid={!!formik.errors?.medicine_name}>
            <FormLabel>Medicine Name</FormLabel>
            <Input
              type="text"
              name="medicine_name"
              value={formik.values?.medicine_name}
              onChange={formik.handleChange}
            />
            {formik.errors.medicine_name && <FormErrorMessage>{formik.errors?.medicine_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="medicine_details" mb="4" isInvalid={!!formik.errors?.medicine_details}>
            <FormLabel>Medicine Details</FormLabel>
            <Input
              type="text"
              name="medicine_details"
              value={formik.values?.medicine_details}
              onChange={formik.handleChange}
            />
            {formik.errors.medicine_details && <FormErrorMessage>{formik.errors?.medicine_details}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'pharmacy_staff_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'medicine_inventory',
    operation: AccessOperationEnum.CREATE,
  }),
)(MedicineInventoryCreatePage);
