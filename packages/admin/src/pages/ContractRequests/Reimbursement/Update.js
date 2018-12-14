import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { getFullName } from "@ehealth/utils";
import Badge from "../../../components/Badge";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import * as Field from "../../../components/Field/index";
import { SearchIcon } from "../../../components/MultiSelectView";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);
const EmployeesQuery = loader("../../../graphql/EmployeesQuery.graphql");
const UpdateContractRequestMutation = loader(
  "../../../graphql/UpdateContractRequestMutation.graphql"
);

const Update = ({ id }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./">
          <Trans>Дозаповніть поля</Trans>
        </Steps.Item>
        <Steps.Item to="../approve">
          <Trans>Підтвердіть з ЕЦП</Trans>
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
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const { reimbursementContractRequest } = data;
            const {
              status,
              databaseId,
              contractorLegalEntity: {
                databaseId: legalEntityId,
                name,
                edrpou
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
                      databaseId: <Trans>ID заяви</Trans>,
                      status: <Trans>Статус</Trans>,
                      edrpou: <Trans>ЄДРПОУ</Trans>,
                      name: <Trans>Назва</Trans>,
                      legalEntityId: <Trans>ID аптеки</Trans>
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
                      legalEntityId
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
                      nhsSignerId: nhsSigner,
                      miscellaneous
                    }}
                    locationParams={locationParams}
                    onSubmit={setLocationParams}
                    data={reimbursementContractRequest}
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
  id
}) => {
  const { nhsSignerBase, issueCity } = initialValues;
  return (
    <Box m={5}>
      <Query
        query={EmployeesQuery}
        variables={{
          first: 50,
          filter: {
            employeeType: ["NHS_SIGNER"],
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
                      nhsPaymentMethod: { key } = {}
                    } = locationParams;
                    await updateContractRequest({
                      variables: {
                        input: {
                          ...locationParams,
                          id,
                          nhsPaymentMethod: key,
                          nhsSignerId: nhsSignerId ? nhsSignerId.id : undefined
                        }
                      }
                    });
                    navigate("../approve");
                  }}
                  initialValues={{
                    ...initialValues,
                    nhsSignerBase: nhsSignerBase || (
                      <Trans>
                        Положення про Національну службу здоров'я України,
                        затвердженого постановою Кабінету Міністрів України від
                        27 грудня 2017 року № 1101
                      </Trans>
                    ),
                    issueCity: issueCity || <Trans>Київ</Trans>
                  }}
                >
                  <Form.AutoSubmit
                    onSubmit={values => setLocationParams(values)}
                  />
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <Trans
                        id="Введіть підписанта"
                        render={({ translate }) => (
                          <Field.Select
                            name="nhsSignerId"
                            label={
                              <Trans>Підписант зі сторони Замовника</Trans>
                            }
                            placeholder={translate}
                            items={employees}
                            renderItem={item => item && getFullName(item.party)}
                            itemToString={item => {
                              if (!item) return "";
                              return typeof item === "string"
                                ? item
                                : getFullName(item.party);
                            }}
                            filterOptions={{
                              keys: ["party.lastName", "party.firstName"]
                            }}
                            iconComponent={SearchIcon}
                          />
                        )}
                      />

                      <Validation.Required
                        field="nhsSignerId"
                        message={<Trans>Обовʼязкове поле</Trans>}
                      />
                    </Box>
                    <Box width={2 / 5}>
                      <Trans
                        id="Оберіть підставу"
                        render={({ translate }) => (
                          <Field.Text
                            name="nhsSignerBase"
                            label={<Trans>Що діє на підставі</Trans>}
                            placeholder={translate}
                          />
                        )}
                      />
                      <Validation.Required
                        field="nhsSignerBase"
                        message={<Trans>Обовʼязкове поле</Trans>}
                      />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <Trans
                        id="Введіть місто"
                        render={({ translate }) => (
                          <Field.Text
                            name="issueCity"
                            label={<Trans>Місто укладення договору</Trans>}
                            placeholder={translate}
                          />
                        )}
                      />
                      <Validation.Required
                        field="issueCity"
                        message={<Trans>Обовʼязкове поле</Trans>}
                      />
                    </Box>
                    <Box width={2 / 5}>
                      <DictionaryValue
                        name="CONTRACT_PAYMENT_METHOD"
                        render={dict => (
                          <Trans
                            id="Оберіть cпосіб"
                            render={({ translate }) => (
                              <Field.Select
                                type="select"
                                name="nhsPaymentMethod"
                                label={<Trans>Спосіб оплати</Trans>}
                                placeholder={translate}
                                itemToString={item => {
                                  return item && item.key
                                    ? dict[item.key]
                                    : dict[item];
                                }}
                                items={[
                                  ...Object.entries(dict).map(
                                    ([key, value]) => ({
                                      value,
                                      key
                                    })
                                  )
                                ]}
                                renderItem={({ value }) => value}
                                size="small"
                                sendForm="key"
                              />
                            )}
                          />
                        )}
                      />
                      <Validation.Required
                        field="nhsPaymentMethod"
                        message={<Trans>Обовʼязкове поле</Trans>}
                      />
                    </Box>
                  </Flex>
                  <Box width={2 / 5}>
                    <Trans
                      id="Перерахуйте умови (за наявності)"
                      render={({ translate }) => (
                        <Field.Textarea
                          name="miscellaneous"
                          label={
                            <Trans>
                              Інші умови (залежно від виду медичних послуг)
                            </Trans>
                          }
                          placeholder={translate}
                          rows={5}
                        />
                      )}
                    />
                  </Box>
                  <Flex mt={5}>
                    <Box mr={3}>
                      <Link to="../">
                        <ButtonWidth variant="blue">
                          <Trans>Повернутися</Trans>
                        </ButtonWidth>
                      </Link>
                    </Box>
                    <ButtonWidth variant="green">
                      <Trans>Оновити</Trans>
                    </ButtonWidth>
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

const OpacityBox = system({ is: Box, opacity: 0.5 });

const ButtonWidth = system({ is: Button, width: 140 });

export default Update;
