import React from "react";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Heading, Flex, Box } from "@rebass/emotion";
import { Form, Validation } from "@ehealth/components";

import Line from "../../components/Line";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import DefinitionListView from "../../components/DefinitionListView";
import STATUSES from "../../helpers/statuses";

const MedicalProgramsQuery = loader(
  "../../graphql/MedicalProgramsQuery.graphql"
);
const SearchMedicationsQuery = loader(
  "../../graphql/SearchMedicationsQuery.graphql"
);
const CreateProgramMedicationMutation = loader(
  "../../graphql/CreateProgramMedicationMutation.graphql"
);

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
    <Box p={5}>
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
            <Trans
              id="Choose medication name"
              render={({ translation }) => (
                <Query
                  query={SearchMedicationsQuery}
                  fetchPolicy="cache-first"
                  variables={{
                    skip: true
                  }}
                >
                  {({
                    loading,
                    error,
                    data: {
                      medications: { nodes: medications = [] } = {}
                    } = {},
                    refetch: refetchMedications
                  }) => (
                    <Field.Select
                      name="medication"
                      label={<Trans>Medication name</Trans>}
                      placeholder={translation}
                      items={medications.map(({ id, name }) => ({
                        id,
                        name
                      }))}
                      itemToString={item => item && item.name}
                      filterOptions={{ keys: ["name"] }}
                      onInputValueChange={debounce(
                        (name, { selectedItem, inputValue }) =>
                          !isEmpty(name) &&
                          selectedItem.name !== inputValue &&
                          refetchMedications({
                            skip: false,
                            first: 20,
                            filter: { name: name }
                          }),
                        1000
                      )}
                    />
                  )}
                </Query>
              )}
            />
            <Validation.Required field="medication" message="Required field" />
          </Box>
          <Box width={2 / 5}>
            <Trans
              id="Choose medical program"
              render={({ translation }) => (
                <Query
                  query={MedicalProgramsQuery}
                  fetchPolicy="cache-first"
                  variables={{
                    skip: true
                  }}
                >
                  {({
                    loading,
                    error,
                    data: {
                      medicalPrograms: { nodes: medicalPrograms = [] } = {}
                    } = {},
                    refetch: refetchMedicalProgram
                  }) => {
                    return (
                      <Field.Select
                        name="medicalProgram"
                        label={<Trans>Medical program</Trans>}
                        placeholder={translation}
                        items={medicalPrograms.map(({ id, name }) => ({
                          id,
                          name
                        }))}
                        itemToString={item => item && item.name}
                        filterOptions={{ keys: ["name"] }}
                        onInputValueChange={debounce(
                          (program, { selectedItem, inputValue }) =>
                            !isEmpty(program) &&
                            selectedItem.name !== inputValue &&
                            refetchMedicalProgram({
                              skip: false,
                              first: 20,
                              filter: { name: program }
                            }),
                          1000
                        )}
                      />
                    );
                  }}
                </Query>
              )}
            />
            <Validation.Required
              field="medicalProgram"
              message="Required field"
            />
          </Box>
        </Flex>
        <Flex>
          <Box pr={2} width={2 / 5}>
            <Field.Number
              name="reimbursement.reimbursementAmount"
              label={<Trans>Reimbursement amount</Trans>}
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
            <Validation.Required
              field="wholesalePrice"
              message="Required field"
            />
          </Box>
          <Box width={2 / 5}>
            <Field.Number
              name="consumerPrice"
              label={<Trans>Consumer price</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
            <Validation.Required
              field="consumerPrice"
              message="Required field"
            />
          </Box>
        </Flex>
        <Flex>
          <Box pr={2} width={2 / 5}>
            <Field.Number
              name="estimatedPaymentAmount"
              label={<Trans>Estimated payment amount</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
            <Validation.Required
              field="estimatedPaymentAmount"
              message="Required field"
            />
          </Box>
          <Box width={2 / 5}>
            <Field.Number
              name="reimbursementDailyDosage"
              label={<Trans>Reimbursement daily dosage</Trans>}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
            <Validation.Required
              field="reimbursementDailyDosage"
              message="Required field"
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
      reimbursement: { type, reimbursementAmount }
    }
  } = state;
  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Confirmation</Trans>
      </Heading>
      <DefinitionListView
        labels={{
          medicationName: <Trans>Medication name</Trans>,
          medicalProgramName: <Trans>Medical program name</Trans>
        }}
        data={{
          medicationName: medication.name,
          medicalProgramName: medicalProgram.name
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          type: <Trans>Reimbursement type</Trans>,
          reimbursementAmount: <Trans>Reimbursement amount</Trans>,
          wholesalePrice: <Trans>Wholesale price</Trans>,
          consumerPrice: <Trans>Consumer price</Trans>,
          estimatedPaymentAmount: <Trans>Estimated payment amount</Trans>,
          reimbursementDailyDosage: <Trans>Reimbursement daily dosage</Trans>
        }}
        data={{
          type,
          reimbursementAmount: createPrice(reimbursementAmount),
          wholesalePrice: createPrice(wholesalePrice),
          consumerPrice: createPrice(consumerPrice),
          estimatedPaymentAmount: createPrice(estimatedPaymentAmount),
          reimbursementDailyDosage: createPrice(reimbursementDailyDosage)
        }}
        labelWidth="200px"
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
                        wholesalePrice: parseFloat(wholesalePrice),
                        consumerPrice: parseFloat(consumerPrice),
                        estimatedPaymentAmount: parseFloat(
                          estimatedPaymentAmount
                        ),
                        reimbursementDailyDosage: parseFloat(
                          reimbursementDailyDosage
                        ),
                        reimbursement: {
                          type,
                          reimbursementAmount: parseFloat(reimbursementAmount)
                        }
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

const createPrice = amount => (
  <>
    {amount} <Trans>uah</Trans>
  </>
);

export default Create;
