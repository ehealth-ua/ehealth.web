import React from "react";
import gql from "graphql-tag";
import { Router } from "@reach/router";
import { SearchIcon } from "@ehealth/icons";
import { Mutation } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { Heading, Flex, Box } from "@rebass/emotion";
import { Form, Validation } from "@ehealth/components";

import Line from "../../components/Line";
import Price from "../../components/Price";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import * as SearchField from "../../components/SearchField";
import DefinitionListView from "../../components/DefinitionListView";
import STATUSES from "../../helpers/statuses";

const Create = ({ location: { state } }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          <Trans>Fill in the form</Trans>
        </Steps.Item>
        <Steps.Item to="./confirm" state={state} disabled>
          <Trans>Confirm</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <Router>
      <CreationForm path="/" />
      <Confirmation path="/confirm" />
    </Router>
  </>
);

const CreationForm = ({ navigate, location, location: { state } }) => {
  const { data, data: { reimbursement } = {} } = state || {};
  const { type, reimbursementAmount } = reimbursement || {};
  return (
    <Box p={5} pb={300}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Create program medication</Trans>
      </Heading>
      <Form
        onSubmit={data => {
          navigate("./confirm", {
            state: {
              data
            }
          });
        }}
        initialValues={{
          ...data,
          reimbursement: {
            type: type || "FIXED",
            reimbursementAmount
          }
        }}
      >
        <Flex>
          <Box pr={2} width={2 / 5}>
            <SearchField.Medication name="medication" />
            <Validation.Required field="medication" message="Required field" />
          </Box>
          <Box width={2 / 5}>
            <SearchField.MedicalProgram name="medicalProgram" />
            <Validation.Required
              field="medicalProgram"
              message="Required field"
            />
          </Box>
        </Flex>
        <Flex alignItems="flex-end">
          <Box pr={2} width={2 / 5}>
            <Field.Number
              name="reimbursement.reimbursementAmount"
              label={
                <Trans>
                  Reimbursement amount for the package of the medicinal product
                </Trans>
              }
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
            <Validation.Required
              field="reimbursement.reimbursementAmount"
              message="Required field"
            />
          </Box>
          <Box width={2 / 5}>
            <Trans
              id="Select type"
              render={({ translation }) => (
                <Field.Select
                  name="reimbursement.type"
                  label={<Trans>Reimbursement type</Trans>}
                  items={Object.keys(STATUSES.REIMBURSEMENT_TYPES)}
                  itemToString={item => STATUSES.REIMBURSEMENT_TYPES[item]}
                  variant="select"
                />
              )}
            />
          </Box>
        </Flex>
        <Box mt={-1} width={4 / 5}>
          <Line />
        </Box>
        <Flex>
          <Box pr={2} width={2 / 5}>
            <Field.Number
              name="wholesalePrice"
              label={<Trans>Wholesale price</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
          </Box>
          <Box width={2 / 5}>
            <Field.Number
              name="consumerPrice"
              label={<Trans>Consumer price</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
          </Box>
        </Flex>
        <Flex alignItems="flex-end">
          <Box pr={2} width={2 / 5}>
            <Field.Number
              name="estimatedPaymentAmount"
              label={<Trans>Estimated payment amount</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
          </Box>
          <Box width={2 / 5}>
            <Field.Number
              name="reimbursementDailyDosage"
              label={<Trans>Reimbursement daily dosage</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
          </Box>
        </Flex>
        <Box mt={-1} width={4 / 5}>
          <Line />
        </Box>
        <Flex mx={-1}>
          <Box px={1} width={2 / 5}>
            <Trans
              id="Enter registry number"
              render={({ translation }) => (
                <Field.Text
                  name="registryNumber"
                  label={<Trans>Registry number</Trans>}
                  placeholder={translation}
                  postfix={<SearchIcon color="silverCity" />}
                  autoComplete="off"
                />
              )}
            />
          </Box>
          <Box px={1} width={1 / 5}>
            <Field.DatePicker
              name="startDate"
              label={<Trans>Start date</Trans>}
              minDate="1900-01-01"
            />
          </Box>
          <Box px={1} width={1 / 5}>
            <Field.DatePicker
              name="endDate"
              label={<Trans>End date</Trans>}
              minDate="1900-01-01"
            />
          </Box>
        </Flex>
        <Flex>
          <Box mr={3}>
            <Button
              type="reset"
              variant="blue"
              width={140}
              onClick={() => navigate("../search")}
            >
              <Trans>Back</Trans>
            </Button>
          </Box>
          <Box>
            <Button variant="green" width={140}>
              <Trans>Add</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const Confirmation = ({ navigate, location: { state } }) => {
  if (!state) return null;
  const {
    data,
    data: {
      medication,
      medicalProgram,
      wholesalePrice,
      consumerPrice,
      estimatedPaymentAmount,
      reimbursementDailyDosage,
      registryNumber,
      startDate,
      endDate,
      reimbursement: { type, reimbursementAmount }
    }
  } = state;
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          medicationName: <Trans>Medication name</Trans>,
          medicalProgramName: <Trans>Medical program name</Trans>
        }}
        data={{
          medicationName: medication.name,
          medicalProgramName: medicalProgram.name
        }}
        labelWidth="225px"
      />
      <Line />
      <DefinitionListView
        labels={{
          type: <Trans>Reimbursement type</Trans>,
          reimbursementAmount: (
            <Trans>
              Reimbursement amount for the package of the medicinal product
            </Trans>
          ),
          wholesalePrice: <Trans>Wholesale price</Trans>,
          consumerPrice: <Trans>Consumer price</Trans>,
          estimatedPaymentAmount: <Trans>Estimated payment amount</Trans>,
          reimbursementDailyDosage: <Trans>Reimbursement daily dosage</Trans>
        }}
        data={{
          type,
          reimbursementAmount: <Price amount={reimbursementAmount} />,
          wholesalePrice: <Price amount={wholesalePrice} />,
          consumerPrice: <Price amount={consumerPrice} />,
          estimatedPaymentAmount: <Price amount={estimatedPaymentAmount} />,
          reimbursementDailyDosage: <Price amount={reimbursementDailyDosage} />
        }}
        labelWidth="225px"
      />
      <Line />
      <DefinitionListView
        labels={{
          startDate: <Trans>Start date</Trans>,
          endDate: <Trans>End date</Trans>,
          registryNumber: <Trans>Registry number</Trans>
        }}
        data={{
          startDate: startDate ? <DateFormat value={startDate} /> : "-",
          endDate: endDate ? <DateFormat value={endDate} /> : "-",
          registryNumber: registryNumber ? registryNumber : "-"
        }}
        labelWidth="225px"
      />

      <Flex mt={5}>
        <Box mr={3}>
          <Button
            variant="blue"
            width={140}
            onClick={() => {
              navigate("../", {
                state: {
                  data
                }
              });
            }}
          >
            <Trans>Back</Trans>
          </Button>
        </Box>
        <Box>
          <Mutation mutation={CreateProgramMedicationMutation}>
            {createProgramMedication => (
              <Button
                variant="green"
                width={140}
                onClick={async () => {
                  await createProgramMedication({
                    variables: {
                      input: {
                        medicationId: medication.id,
                        medicalProgramId: medicalProgram.id,
                        wholesalePrice: getPriceVariable(wholesalePrice),
                        consumerPrice: getPriceVariable(consumerPrice),
                        estimatedPaymentAmount: getPriceVariable(
                          estimatedPaymentAmount
                        ),
                        reimbursementDailyDosage: getPriceVariable(
                          reimbursementDailyDosage
                        ),
                        reimbursement: {
                          type,
                          reimbursementAmount: parseFloat(reimbursementAmount)
                        },
                        startDate,
                        endDate,
                        registryNumber
                      }
                    }
                  });
                  await navigate("../../search");
                }}
              >
                <Trans>Add</Trans>
              </Button>
            )}
          </Mutation>
        </Box>
      </Flex>
    </Box>
  );
};

const getPriceVariable = price => parseFloat(price) || undefined;

const CreateProgramMedicationMutation = gql`
  mutation CreateProgramMedicationMutation(
    $input: CreateProgramMedicationInput!
  ) {
    createProgramMedication(input: $input) {
      programMedication {
        id
      }
    }
  }
`;

export default Create;
