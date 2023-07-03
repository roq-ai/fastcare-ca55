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
import { getInsurancePolicyById, updateInsurancePolicyById } from 'apiSdk/insurance-policies';
import { Error } from 'components/error';
import { insurancePolicyValidationSchema } from 'validationSchema/insurance-policies';
import { InsurancePolicyInterface } from 'interfaces/insurance-policy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function InsurancePolicyEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InsurancePolicyInterface>(
    () => (id ? `/insurance-policies/${id}` : null),
    () => getInsurancePolicyById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InsurancePolicyInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInsurancePolicyById(id, values);
      mutate(updated);
      resetForm();
      router.push('/insurance-policies');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InsurancePolicyInterface>({
    initialValues: data,
    validationSchema: insurancePolicyValidationSchema,
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
            Edit Insurance Policy
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
            <FormControl id="policy_name" mb="4" isInvalid={!!formik.errors?.policy_name}>
              <FormLabel>Policy Name</FormLabel>
              <Input type="text" name="policy_name" value={formik.values?.policy_name} onChange={formik.handleChange} />
              {formik.errors.policy_name && <FormErrorMessage>{formik.errors?.policy_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="policy_details" mb="4" isInvalid={!!formik.errors?.policy_details}>
              <FormLabel>Policy Details</FormLabel>
              <Input
                type="text"
                name="policy_details"
                value={formik.values?.policy_details}
                onChange={formik.handleChange}
              />
              {formik.errors.policy_details && <FormErrorMessage>{formik.errors?.policy_details}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'insurance_agent_id'}
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
    entity: 'insurance_policy',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InsurancePolicyEditPage);
