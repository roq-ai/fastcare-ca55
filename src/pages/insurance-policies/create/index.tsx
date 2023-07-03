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
import { createInsurancePolicy } from 'apiSdk/insurance-policies';
import { Error } from 'components/error';
import { insurancePolicyValidationSchema } from 'validationSchema/insurance-policies';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { InsurancePolicyInterface } from 'interfaces/insurance-policy';

function InsurancePolicyCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InsurancePolicyInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInsurancePolicy(values);
      resetForm();
      router.push('/insurance-policies');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InsurancePolicyInterface>({
    initialValues: {
      policy_name: '',
      policy_details: '',
      insurance_agent_id: (router.query.insurance_agent_id as string) ?? null,
    },
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
            Create Insurance Policy
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(InsurancePolicyCreatePage);
