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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPatientRecordById, updatePatientRecordById } from 'apiSdk/patient-records';
import { Error } from 'components/error';
import { patientRecordValidationSchema } from 'validationSchema/patient-records';
import { PatientRecordInterface } from 'interfaces/patient-record';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function PatientRecordEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PatientRecordInterface>(
    () => (id ? `/patient-records/${id}` : null),
    () => getPatientRecordById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PatientRecordInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePatientRecordById(id, values);
      mutate(updated);
      resetForm();
      router.push('/patient-records');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PatientRecordInterface>({
    initialValues: data,
    validationSchema: patientRecordValidationSchema,
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
            Edit Patient Record
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="patient_name" mb="4" isInvalid={!!formik.errors?.patient_name}>
              <FormLabel>Patient Name</FormLabel>
              <Input
                type="text"
                name="patient_name"
                value={formik.values?.patient_name}
                onChange={formik.handleChange}
              />
              {formik.errors.patient_name && <FormErrorMessage>{formik.errors?.patient_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="patient_details" mb="4" isInvalid={!!formik.errors?.patient_details}>
              <FormLabel>Patient Details</FormLabel>
              <Input
                type="text"
                name="patient_details"
                value={formik.values?.patient_details}
                onChange={formik.handleChange}
              />
              {formik.errors.patient_details && <FormErrorMessage>{formik.errors?.patient_details}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'medical_staff_id'}
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
        )}
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
    entity: 'patient_record',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PatientRecordEditPage);
