import React from "react";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { loader } from "graphql.macro";
import { BooleanValue } from "react-values";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Text } from "@rebass/emotion";
import { PositiveIcon, CancelIcon } from "@ehealth/icons";
import { Form, Validation, Link } from "@ehealth/components";

import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Ability from "../../components/Ability";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingOverlay from "../../components/LoadingOverlay";
import DefinitionListView from "../../components/DefinitionListView";

const ProgramMedicationQuery = loader(
  "../../graphql/ProgramMedicationQuery.graphql"
);
const UpdateProgramMedicationMutation = loader(
  "../../graphql/UpdateProgramMedicationMutation.graphql"
);

const Details = ({ id }) => (
  <Query query={ProgramMedicationQuery} variables={{ id }}>
    {({ loading, error, data: { programMedication = {} } }) => {
      if (isEmpty(programMedication)) return null;
      const {
        databaseId,
        medicationRequestAllowed,
        isActive,
        ...details
      } = programMedication;

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/program-medications">
                  <Trans>Search program medications</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Program medication details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-start">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Participant ID</Trans>,
                    isActive: <Trans>Status</Trans>,
                    medicationRequestAllowed: (
                      <Trans>Medication request allowed</Trans>
                    )
                  }}
                  data={{
                    databaseId,
                    isActive: (
                      <Badge
                        type="PROGRAM_MEDICATION_STATUS"
                        name={isActive}
                        variant={!isActive}
                        minWidth={100}
                      />
                    ),
                    medicationRequestAllowed: (
                      <Badge
                        type="MEDICATION_REQUEST_ALLOWED"
                        name={medicationRequestAllowed}
                        variant={!medicationRequestAllowed}
                        minWidth={100}
                      />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="120px"
                />
              </Box>
              <Ability action="write" resource="program_medication">
                <Mutation
                  mutation={UpdateProgramMedicationMutation}
                  refetchQueries={() => [
                    {
                      query: ProgramMedicationQuery,
                      variables: { id }
                    }
                  ]}
                >
                  {updateProgramMedication => (
                    <Flex>
                      <Box mr={2}>
                        <Button
                          variant={isActive ? "red" : "blue"}
                          disabled={isActive && medicationRequestAllowed}
                          onClick={async () => {
                            await updateProgramMedication({
                              variables: {
                                input: {
                                  id,
                                  isActive: !isActive
                                }
                              }
                            });
                          }}
                        >
                          {isActive ? (
                            <Trans>Deactivate</Trans>
                          ) : (
                            <Trans>Activate</Trans>
                          )}
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          disabled={!isActive}
                          variant={medicationRequestAllowed ? "red" : "green"}
                          onClick={async () => {
                            await updateProgramMedication({
                              variables: {
                                input: {
                                  id,
                                  medicationRequestAllowed: !medicationRequestAllowed
                                }
                              }
                            });
                          }}
                        >
                          {medicationRequestAllowed ? (
                            <Trans>Disallow Request</Trans>
                          ) : (
                            <Trans>Allow Request</Trans>
                          )}
                        </Button>
                      </Box>
                    </Flex>
                  )}
                </Mutation>
              </Ability>
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General info</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo path="/" isActive={isActive} data={details} />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  isActive,
  data: {
    id,
    wholesalePrice,
    consumerPrice,
    estimatedPaymentAmount,
    reimbursementDailyDosage,
    medication,
    medicalProgram,
    reimbursement,
    ...data
  }
}) => {
  const {
    id: medicationId,
    databaseId: medicationDatabaseId,
    name: medicationName
  } = medication;
  const {
    databaseId: medicalProgramId,
    name: medicalProgramName
  } = medicalProgram;
  const { type, reimbursementAmount } = reimbursement;

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          medicationName: <Trans>Medication name</Trans>
        }}
        data={{
          medicationName
        }}
        labelWidth="280px"
      />
      <DefinitionListView
        labels={{
          medicationId: <Trans>Medication ID</Trans>
        }}
        data={{
          medicationId: (
            <Link to={`../../medications/${medicationId}`}>
              {medicationDatabaseId}
            </Link>
          )
        }}
        color="blueberrySoda"
        labelWidth="280px"
      />
      <Line />
      <DefinitionListView
        labels={{
          medicalProgramName: <Trans>Medical program name</Trans>
        }}
        data={{
          medicalProgramName
        }}
        labelWidth="280px"
      />
      <DefinitionListView
        labels={{
          medicalProgramId: <Trans>Medical program ID</Trans>
        }}
        data={{
          medicalProgramId: (
            <Link
              to={`../../medical-programs/search?first=10&filter.databaseId=${medicalProgramId}`}
            >
              {medicalProgramId}
            </Link>
          )
        }}
        color="blueberrySoda"
        labelWidth="280px"
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
          //TODO: add dictionary value for the type
          type,
          reimbursementAmount: isActive ? (
            <ReimbursementAmount
              id={id}
              reimbursementAmount={reimbursementAmount}
            />
          ) : (
            <Price amount={reimbursementAmount} />
          ),
          wholesalePrice: <Price amount={wholesalePrice} />,
          consumerPrice: <Price amount={consumerPrice} />,
          estimatedPaymentAmount: <Price amount={estimatedPaymentAmount} />,
          reimbursementDailyDosage: <Price amount={reimbursementDailyDosage} />
        }}
        labelWidth="280px"
      />
    </Box>
  );
};

const ReimbursementAmount = ({ id, reimbursementAmount }) => (
  <BooleanValue>
    {({ value: opened, toggle }) =>
      opened ? (
        <Mutation
          mutation={UpdateProgramMedicationMutation}
          refetchQueries={() => [
            {
              query: ProgramMedicationQuery,
              variables: { id }
            }
          ]}
        >
          {updateProgramMedication => (
            <Form
              onSubmit={async ({ reimbursementAmount }) => {
                const amount = parseFloat(reimbursementAmount);
                await updateProgramMedication({
                  variables: {
                    input: {
                      id,
                      reimbursement: {
                        reimbursementAmount: amount
                      }
                    }
                  }
                });
                toggle();
              }}
              initialValues={{ reimbursementAmount }}
            >
              <Flex>
                <Field.Number
                  name="reimbursementAmount"
                  value={reimbursementAmount}
                  placeholder="0 - 1 000 000"
                  postfix={<Trans>uah</Trans>}
                />
                <Validation.Required
                  field="reimbursementAmount"
                  message="Required field"
                />
                <Box mx={2} color="redPigment">
                  <Button
                    variant="none"
                    border="none"
                    px="0"
                    type="reset"
                    onClick={toggle}
                  >
                    <CancelIcon />
                  </Button>
                </Box>
                <Box>
                  <Button variant="none" border="none" px="0">
                    <PositiveIcon />
                  </Button>
                </Box>
              </Flex>
            </Form>
          )}
        </Mutation>
      ) : (
        <Flex>
          <Price amount={reimbursementAmount} />
          <Button variant="none" border="none" px="0" py="0" onClick={toggle}>
            <Text fontSize={0} color="rockmanBlue" fontWeight="bold" ml={2}>
              <Trans>Change</Trans>
            </Text>
          </Button>
        </Flex>
      )
    }
  </BooleanValue>
);

const Price = ({ amount }) =>
  amount && (
    <>
      {amount} <Trans>uah</Trans>
    </>
  );

export default Details;
