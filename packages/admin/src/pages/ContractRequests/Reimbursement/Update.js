import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { loader } from "graphql.macro";
import { Trans, t } from "@lingui/macro";
import { I18n } from "@lingui/react";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { getFullName } from "@ehealth/utils";
import { SearchIcon } from "@ehealth/icons";
import isEmpty from "lodash/isEmpty";

import Badge from "../../../components/Badge";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import InfoBox from "../../../components/InfoBox";
import LinkComponent from "../../../components/Link";
import * as Field from "../../../components/Field/index";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);
const EmployeesQuery = loader(
  "../../../graphql/GetAssignEmployeeQuery.graphql"
);
const UpdateContractRequestMutation = loader(
  "../../../graphql/UpdateContractRequestMutation.graphql"
);

const Update = ({ id }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./">
          <Trans>Fill in fields</Trans>
        </Steps.Item>
        <Steps.Item to="../approve">
          <Trans>Confirm with EDS</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <Query
          query={ReimbursementContractRequestQuery}
          variables={{
            id
          }}
        >
          {({
            loading,
            error,
            data: { reimbursementContractRequest } = {}
          }) => {
            if (isEmpty(reimbursementContractRequest)) return null;
            const {
              status,
              databaseId,
              contractorLegalEntity: {
                id: legalEntityId,
                databaseId: legalEntityDatabaseId,
                name,
                edrpou,
                status: contractorLegalEntityStatus
              },
              issueCity,
              nhsPaymentMethod,
              nhsSignerBase,
              nhsSigner,
              miscellaneous
            } = reimbursementContractRequest;

            return (
              <>
                <OpacityBox m={5}>
                  <DefinitionListView
                    labels={{
                      databaseId: <Trans>Contract request ID</Trans>,
                      status: <Trans>Status</Trans>,
                      edrpou: <Trans>EDRPOU</Trans>,
                      name: <Trans>Name</Trans>,
                      legalEntityDatabaseId: <Trans>Pharmacy ID</Trans>
                    }}
                    data={{
                      databaseId,
                      status: (
                        <Badge
                          name={status}
                          type="CONTRACT_REQUEST"
                          minWidth={100}
                        />
                      ),
                      edrpou,
                      name,
                      legalEntityDatabaseId: (
                        <LinkComponent to={`/legal-entities/${legalEntityId}`}>
                          {legalEntityDatabaseId}
                        </LinkComponent>
                      )
                    }}
                    color="#7F8FA4"
                    labelWidth="100px"
                  />
                </OpacityBox>
                <Router>
                  <UpdateContractRequest
                    path="/"
                    initialValues={{
                      nhsSignerBase,
                      issueCity,
                      nhsPaymentMethod,
                      nhsSigner,
                      miscellaneous
                    }}
                    locationParams={locationParams}
                    onSubmit={setLocationParams}
                    data={reimbursementContractRequest}
                    contractorLegalEntityStatus={contractorLegalEntityStatus}
                  />
                </Router>
              </>
            );
          }}
        </Query>
      )}
    </LocationParams>
  </>
);

const UpdateContractRequest = ({
  onSubmit: setLocationParams,
  initialValues,
  navigate,
  locationParams,
  id,
  contractorLegalEntityStatus
}) => {
  const { nhsSignerBase, issueCity, nhsPaymentMethod } = initialValues;
  const isUpdateDisabled = contractorLegalEntityStatus !== "ACTIVE";

  return (
    <Box m={5}>
      <Query
        query={EmployeesQuery}
        variables={{
          first: 50,
          filter: {
            employeeType: ["NHS ADMIN SIGNER"],
            status: "APPROVED"
          },
          orderBy: "INSERTED_AT_DESC"
        }}
      >
        {({
          loading,
          error,
          data: { employees: { nodes: employees = [] } = {} } = {}
        }) => {
          return (
            <Mutation
              mutation={UpdateContractRequestMutation}
              refetchQueries={() => [
                {
                  query: ReimbursementContractRequestQuery,
                  variables: { id }
                }
              ]}
            >
              {updateContractRequest => (
                <Form
                  onSubmit={async () => {
                    const {
                      nhsSignerId,
                      miscellaneous,
                      nhsPaymentMethod,
                      issueCity,
                      nhsSignerBase
                    } = locationParams;
                    await updateContractRequest({
                      variables: {
                        input: {
                          id,
                          nhsPaymentMethod,
                          issueCity,
                          nhsSignerBase,
                          nhsSignerId: nhsSignerId ? nhsSignerId.id : undefined,
                          miscellaneous: miscellaneous || ""
                        }
                      }
                    });
                    await navigate("../approve");
                  }}
                  initialValues={{
                    ...initialValues,
                    nhsPaymentMethod: nhsPaymentMethod || "BACKWARD",
                    nhsSignerBase:
                      nhsSignerBase ||
                      "Положення про Національну службу здоров'я України, затвердженого постановою Кабінету Міністрів України від 27 грудня 2017 року № 1101",
                    issueCity: issueCity || "Київ"
                  }}
                >
                  <Form.AutoSubmit
                    onSubmit={values => setLocationParams(values)}
                  />
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <Trans
                        id="Enter signer"
                        render={({ translation }) => (
                          <Field.Select
                            name="nhsSignerId"
                            label={
                              <Trans>Signatory from the Customers side</Trans>
                            }
                            placeholder={translation}
                            items={employees.map(
                              ({
                                party: { firstName, secondName, lastName },
                                id
                              }) => ({
                                party: { firstName, secondName, lastName },
                                id
                              })
                            )}
                            itemToString={item =>
                              item && getFullName(item.party)
                            }
                            filterOptions={{
                              keys: ["party.lastName", "party.firstName"]
                            }}
                            iconComponent={SearchIcon}
                          />
                        )}
                      />

                      <Validation.Required
                        field="nhsSignerId"
                        message="Required field"
                      />
                    </Box>
                    <Box width={2 / 5}>
                      <I18n>
                        {({ i18n }) => (
                          <Field.Text
                            name="nhsSignerBase"
                            label={<Trans>Basis</Trans>}
                            placeholder={i18n._(t`Choose base`)}
                            maxLength={255}
                            showLengthHint
                          />
                        )}
                      </I18n>
                      <Validation.Required
                        field="nhsSignerBase"
                        message="Required field"
                      />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <I18n>
                        {({ i18n }) => (
                          <Field.Text
                            name="issueCity"
                            label={
                              <Trans>
                                The city of the conclusion of the contract
                              </Trans>
                            }
                            placeholder={i18n._(t`Enter city`)}
                            maxLength={100}
                            showLengthHint
                          />
                        )}
                      </I18n>
                      <Validation.Required
                        field="issueCity"
                        message="Required field"
                      />
                    </Box>
                    <Box width={2 / 5}>
                      <DictionaryValue
                        name="CONTRACT_PAYMENT_METHOD"
                        render={dict => (
                          <Trans
                            id="Choose payment method"
                            render={({ translation }) => (
                              <Field.Select
                                variant="select"
                                name="nhsPaymentMethod"
                                label={<Trans>Payment method</Trans>}
                                placeholder={translation}
                                itemToString={item => dict[item]}
                                items={Object.keys(dict)}
                                size="small"
                                sendForm="key"
                              />
                            )}
                          />
                        )}
                      />
                      <Validation.Required
                        field="nhsPaymentMethod"
                        message="Required field"
                      />
                    </Box>
                  </Flex>
                  <Box width={2 / 5}>
                    <I18n>
                      {({ i18n }) => (
                        <Field.Textarea
                          name="miscellaneous"
                          label={
                            <Trans>
                              Miscellaneous (depending on the type of medical
                              service)
                            </Trans>
                          }
                          placeholder={i18n._(t`List the conditions`)}
                          rows={5}
                        />
                      )}
                    </I18n>
                  </Box>
                  <Flex mt={5}>
                    <Box mr={3}>
                      <Link to="../">
                        <Button variant="blue" width={140}>
                          <Trans>Return</Trans>
                        </Button>
                      </Link>
                    </Box>
                    <Box>
                      <Button
                        variant="green"
                        width={140}
                        disabled={isUpdateDisabled}
                      >
                        <Trans>Refresh</Trans>
                      </Button>
                      {isUpdateDisabled && (
                        <InfoBox>
                          <Trans>
                            It is impossible to update the contract request,
                            because the pharmacy is inactive.
                          </Trans>
                        </InfoBox>
                      )}
                    </Box>
                  </Flex>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    </Box>
  );
};

const OpacityBox = system({ extend: Box, opacity: 0.5 }, "opacity", "space");

export default Update;
