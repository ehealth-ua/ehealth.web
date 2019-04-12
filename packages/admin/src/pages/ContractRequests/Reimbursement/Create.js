import React from "react";
import isEmpty from "lodash/isEmpty";
import { I18n } from "@lingui/react";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Trans, t } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import { SearchIcon } from "@ehealth/icons";
import { getFullName } from "@ehealth/utils";
import { Query, Mutation } from "react-apollo";
import system from "@ehealth/system-components";
import { Form, Validation, Validations } from "@ehealth/components";
import { Router, Link as RouterLink } from "@reach/router";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../../components/Line";
import Link from "../../../components/Link";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import * as Field from "../../../components/Field/index";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import env from "../../../env";

const GetDataToCreateReimbursementContractRequestQuery = loader(
  "../../../graphql/GetDataToCreateReimbursementContractRequestQuery.graphql"
);
const GetAssignEmployeeQuery = loader(
  "../../../graphql/GetAssignEmployeeQuery.graphql"
);
const CreateContractRequestMutation = loader(
  "../../../graphql/CreateContractRequestMutation.graphql"
);

const Create = ({ id, location: { state } }) => (
  <Box px={6}>
    <Box pt={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          <Trans>Fill in fields</Trans>
        </Steps.Item>
        <Steps.Item to="./confirm" disabled>
          <Trans>Confirm with EDS</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <Query
      query={GetDataToCreateReimbursementContractRequestQuery}
      variables={{ id }}
    >
      {({ loading, error, data: { reimbursementContract } }) => {
        if (isEmpty(reimbursementContract)) return null;
        const {
          contractorLegalEntity: { databaseId: legalEntityId, name },
          toCreateRequestContent
        } = reimbursementContract;
        const { contract_number } = toCreateRequestContent || {};

        return (
          <LoadingOverlay loading={loading}>
            <OpacityBox my={5}>
              <DefinitionListView
                labels={{
                  contractType: <Trans>Type</Trans>,
                  contract_number: <Trans>Contract Number</Trans>,
                  name: <Trans>Name</Trans>,
                  legalEntityId: <Trans>Legal entity ID</Trans>
                }}
                data={{
                  contractType: <Trans>Reimbursement contract type</Trans>,
                  contract_number: (
                    <Link to={`/contracts/reimbursement/${id}`}>
                      {contract_number}
                    </Link>
                  ),
                  name,
                  legalEntityId
                }}
                color="#7F8FA4"
                labelWidth="120px"
              />
              <Line />
            </OpacityBox>
            <Router>
              <CreateContractRequest
                path="/"
                initialValues={toCreateRequestContent}
                data={reimbursementContract}
              />
              <Confirmation path="/confirm" />
            </Router>
          </LoadingOverlay>
        );
      }}
    </Query>
  </Box>
);

const CreateContractRequest = ({
  initialValues,
  navigate,
  location: { state = {} }
}) => {
  const {
    nhs_signer_id,
    nhs_signer_base,
    issue_city,
    nhsSigner,
    misc,
    ...initialData
  } = state.createContractRequest || initialValues;

  return (
    <Query
      query={GetAssignEmployeeQuery}
      fetchPolicy="cache-first"
      variables={{
        skip: !nhs_signer_id,
        first: 1,
        filter: {
          employeeType: ["NHS_SIGNER"],
          status: "APPROVED",
          databaseId: nhs_signer_id
        }
      }}
    >
      {({
        loading,
        error,
        data: { employees: { nodes: employees = [] } = {} } = {},
        refetch: refetchSigner
      }) => (
        <Form
          onSubmit={async createContractRequest => {
            await navigate("./confirm", {
              state: {
                createContractRequest
              }
            });
          }}
          initialValues={{
            ...initialData,
            misc,
            nhsSigner: nhsSigner ? nhsSigner : nhs_signer_id && employees[0],
            nhs_signer_base:
              nhs_signer_base ||
              "Положення про Національну службу здоров'я України, затвердженого постановою Кабінету Міністрів України від 27 грудня 2017 року № 1101",
            issue_city: issue_city || "Київ"
          }}
        >
          <Flex>
            <Box mr={5} width={2 / 5}>
              <I18n>
                {({ i18n }) => (
                  <Field.Select
                    name="nhsSigner"
                    label={<Trans>Signatory from the Customers side</Trans>}
                    placeholder={i18n._(t`Enter signer`)}
                    items={employees.map(
                      ({
                        party: { firstName, secondName, lastName },
                        databaseId
                      }) => ({
                        party: { firstName, secondName, lastName },
                        databaseId
                      })
                    )}
                    onInputValueChange={debounce(
                      (fullName, { selectedItem, inputValue }) => {
                        const filter =
                          typeof selectedItem === "object"
                            ? { party: { fullName } }
                            : { databaseId: nhs_signer_id };

                        return (
                          (selectedItem && getFullName(selectedItem.party)) !==
                            inputValue &&
                          refetchSigner({
                            skip: false,
                            first: 20,
                            filter: {
                              employeeType: ["NHS_SIGNER"],
                              status: "APPROVED",
                              ...filter
                            }
                          })
                        );
                      },
                      1000
                    )}
                    itemToString={item => item && getFullName(item.party)}
                    filterOptions={{
                      keys: ["party.lastName", "party.firstName"]
                    }}
                    iconComponent={SearchIcon}
                  />
                )}
              </I18n>
              <Validation.Required field="nhsSigner" message="Required field" />
            </Box>
            <Box width={2 / 5}>
              <I18n>
                {({ i18n }) => (
                  <Field.Text
                    name="nhs_signer_base"
                    label={<Trans>Basis</Trans>}
                    placeholder={i18n._(t`Choose base`)}
                    maxlength={255}
                    showLengthHint
                  />
                )}
              </I18n>
              <Validation.Required
                field="nhs_signer_base"
                message="Required field"
              />
            </Box>
          </Flex>
          <Flex>
            <Box mr={5} width={2 / 5}>
              <I18n>
                {({ i18n }) => (
                  <Field.Text
                    name="issue_city"
                    label={
                      <Trans>The city of the conclusion of the contract</Trans>
                    }
                    placeholder={i18n._(t`Enter city`)}
                    maxlength={100}
                    showLengthHint
                  />
                )}
              </I18n>
              <Validation.Required
                field="issue_city"
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
                        name="nhs_payment_method"
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
                field="nhs_payment_method"
                message="Required field"
              />
            </Box>
          </Flex>
          <Flex>
            <Box mr={5} width={2 / 5}>
              <Query
                query={GetAssignEmployeeQuery}
                fetchPolicy="cache-first"
                variables={{
                  skip: true
                }}
              >
                {({
                  loading,
                  error,
                  data: { employees: { nodes: employees = [] } = {} } = {},
                  refetch: refetchEmployees
                }) => (
                  <I18n>
                    {({ i18n }) => (
                      <Field.Select
                        name="assigneeId"
                        label={<Trans>Performer</Trans>}
                        placeholder={i18n._(t`Enter signer`)}
                        items={employees.map(
                          ({
                            party: { firstName, secondName, lastName },
                            databaseId
                          }) => ({
                            party: { firstName, secondName, lastName },
                            databaseId
                          })
                        )}
                        itemToString={item => item && getFullName(item.party)}
                        filterOptions={{
                          keys: ["party.lastName", "party.firstName"]
                        }}
                        filter={fullName => fullName}
                        onInputValueChange={debounce(
                          (fullName, { selectedItem, inputValue }) =>
                            (selectedItem &&
                              getFullName(selectedItem.party)) !== inputValue &&
                            refetchEmployees({
                              skip: false,
                              first: 20,
                              filter: {
                                employeeType: ["NHS", "NHS_SIGNER"],
                                status: "APPROVED",
                                party: {
                                  fullName
                                }
                              }
                            }),
                          1000
                        )}
                        iconComponent={SearchIcon}
                      />
                    )}
                  </I18n>
                )}
              </Query>
              <Validation.Required
                field="assigneeId"
                message="Required field"
              />
            </Box>
            <Box width={2 / 5}>
              <I18n>
                {({ i18n }) => (
                  <Field.Textarea
                    name="misc"
                    label={
                      <Trans>
                        Miscellaneous (depending on the type of medical service)
                      </Trans>
                    }
                    placeholder={i18n._(t`List the conditions`)}
                    rows={5}
                  />
                )}
              </I18n>
            </Box>
          </Flex>
          <Flex mt={5}>
            <Box mr={3}>
              <RouterLink to="../">
                <Button variant="blue" width={140}>
                  <Trans>Return</Trans>
                </Button>
              </RouterLink>
            </Box>
            <Button variant="green" width={140}>
              <Trans>Refresh</Trans>
            </Button>
          </Flex>
        </Form>
      )}
    </Query>
  );
};

const Confirmation = ({ navigate, location: { state } }) => {
  if (!state) return null;
  const {
    createContractRequest,
    createContractRequest: {
      nhsSigner,
      assigneeId,
      nhs_payment_method,
      ...contractRequestData
    }
  } = state;

  return (
    <>
      <DefinitionListView
        labels={{
          assigneeId: <Trans>Performer</Trans>,
          nhsSigner: <Trans>Signatory from the Customers side</Trans>,
          nhs_signer_base: <Trans>Basis</Trans>,
          nhs_payment_method: <Trans>Payment method</Trans>,
          issue_city: <Trans>The city of the conclusion of the contract</Trans>,
          misc: <Trans>Miscellaneous</Trans>
        }}
        data={{
          assigneeId: assigneeId && getFullName(assigneeId.party),
          nhsSigner: nhsSigner && getFullName(nhsSigner.party),
          nhs_payment_method: (
            <DictionaryValue
              name="CONTRACT_PAYMENT_METHOD"
              item={nhs_payment_method}
            />
          ),
          ...contractRequestData
        }}
        labelWidth="300px"
        marginBetween={2}
        flexDirection="column"
      />

      <Flex mt={5}>
        <Box mr={3}>
          <Button
            variant="blue"
            width={140}
            onClick={() => {
              navigate("../", {
                state: {
                  createContractRequest
                }
              });
            }}
          >
            <Trans>Back</Trans>
          </Button>
        </Box>
        <Box>
          <Signer.Parent
            url={env.REACT_APP_SIGNER_URL}
            features={{ width: 640, height: 589 }}
          >
            {({ signData }) => (
              <Mutation mutation={CreateContractRequestMutation}>
                {createContractRequest => (
                  <Button
                    variant="green"
                    width={140}
                    onClick={async () => {
                      const { signedContent } = await signData({
                        ...contractRequestData,
                        nhs_payment_method,
                        nhs_signer_id: nhsSigner.databaseId
                      });
                      await createContractRequest({
                        variables: {
                          input: {
                            assigneeId: assigneeId.databaseId,
                            signedContent: {
                              content: signedContent,
                              encoding: "BASE64"
                            },
                            type: "REIMBURSEMENT"
                          }
                        }
                      });
                      await navigate("/contract-requests/reimbursement");
                    }}
                  >
                    <Trans>Sign</Trans>
                  </Button>
                )}
              </Mutation>
            )}
          </Signer.Parent>
        </Box>
      </Flex>
    </>
  );
};

const OpacityBox = system({ extend: Box, opacity: 0.5 }, "opacity", "space");

export default Create;
