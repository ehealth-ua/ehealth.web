import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { loader } from "graphql.macro";

import {
  LocationParams,
  Form,
  Validation,
  Validations
} from "@ehealth/components";
import { getFullName } from "@ehealth/utils";
import Badge from "../../components/Badge";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import { SearchIcon } from "../../components/MultiSelectView";
import DefinitionListView from "../../components/DefinitionListView";
import STATUSES from "../../helpers/statuses";

const ContractRequestQuery = loader(
  "../../graphql/ContractRequestQuery.graphql"
);
const EmployeesQuery = loader("../../graphql/EmployeesQuery.graphql");
const UpdateContractRequestMutation = loader(
  "../../graphql/UpdateContractRequestMutation.graphql"
);
const nhsPaymentMethod = Object.entries(STATUSES.NHS_PAYMENT_METHOD).map(
  ([key, value]) => ({ key, value })
);

const Update = ({ id }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./">Дозаповніть поля</Steps.Item>
        <Steps.Item to="../approve">Підтвердіть з ЕЦП</Steps.Item>
      </Steps.List>
    </Box>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <Query
          query={ContractRequestQuery}
          variables={{
            id
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const { contractRequest } = data;
            const {
              status,
              databaseId,
              contractorLegalEntity: {
                databaseId: legalEntityId,
                name,
                edrpou
              },
              issueCity,
              nhsContractPrice,
              nhsPaymentMethod,
              nhsSignerBase,
              nhsSigner,
              miscellaneous
            } = contractRequest;

            return (
              <>
                <OpacityBox m={5}>
                  <DefinitionListView
                    labels={{
                      databaseId: "ID заяви",
                      status: "Статус",
                      edrpou: "ЄДРПОУ",
                      name: "Назва",
                      legalEntityId: "ID медзакладу"
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
                      nhsContractPrice,
                      nhsPaymentMethod,
                      nhsSignerId: nhsSigner,
                      miscellaneous
                    }}
                    locationParams={locationParams}
                    onSubmit={setLocationParams}
                    data={contractRequest}
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
  const [initialNhsPaymentMethod] = nhsPaymentMethod.filter(
    ({ key }) => key === initialValues.nhsPaymentMethod
  );
  const { nhsSignerBase, issueCity, nhsContractPrice } = initialValues;
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
                  query: ContractRequestQuery,
                  variables: { id }
                }
              ]}
            >
              {updateContractRequest => (
                <Form
                  onSubmit={async () => {
                    const {
                      nhsSignerId,
                      nhsContractPrice,
                      nhsPaymentMethod: { key } = {}
                    } = locationParams;
                    await updateContractRequest({
                      variables: {
                        input: {
                          ...locationParams,
                          id,
                          nhsPaymentMethod: key,
                          nhsContractPrice: parseInt(nhsContractPrice, 10),
                          nhsSignerId: nhsSignerId ? nhsSignerId.id : undefined
                        }
                      }
                    });
                    navigate("../approve");
                  }}
                  initialValues={{
                    ...initialValues,
                    nhsSignerBase:
                      nhsSignerBase ||
                      "Положення про Національну службу здоров'я України, затвердженого постановою Кабінету Міністрів України від 27 грудня 2017 року № 1101",
                    issueCity: issueCity || "Київ",
                    nhsContractPrice: nhsContractPrice || 0,
                    nhsPaymentMethod: initialNhsPaymentMethod
                  }}
                >
                  <Form.AutoSubmit
                    onSubmit={values => setLocationParams(values)}
                  />
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <Field.Select
                        name="nhsSignerId"
                        label="Підписант зі сторони Замовника"
                        placeholder="Введіть підписанта"
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

                      <Validation.Required
                        field="nhsSignerId"
                        message="Обов&#700;язкове поле"
                      />
                    </Box>
                    <Box width={2 / 5}>
                      <Field.Text
                        name="nhsSignerBase"
                        label="Що діє на підставі"
                        placeholder="Оберіть підставу"
                      />
                      <Validation.Required
                        field="nhsSignerBase"
                        message="Обов&#700;язкове поле"
                      />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box mr={5} width={2 / 5}>
                      <Field.Number
                        name="nhsContractPrice"
                        label="Сума контракту"
                        placeholder="0 - 1 000 000"
                        postfix="грн"
                      />
                      <Validations field="nhsContractPrice">
                        <Validation.Required message="Об&#700;язкове поле" />
                        {/*<Validation.Matches*/}
                        {/*options={"^(\\d{1,7})(\\.\\d{1,2})?$"}*/}
                        {/*message="Не вірно вказана сума"*/}
                        {/*/>*/}
                      </Validations>
                    </Box>
                    <Box width={2 / 5}>
                      <Field.Select
                        type="select"
                        name="nhsPaymentMethod"
                        label="Спосіб оплати"
                        placeholder="Оберіть cпосіб"
                        items={nhsPaymentMethod}
                        itemToString={({ value }) => value}
                        renderItem={({ value }) => value}
                        size="small"
                        sendForm="key"
                      />
                      <Validation.Required
                        field="nhsPaymentMethod"
                        message="Обов&#700;язкове поле"
                      />
                    </Box>
                  </Flex>
                  <Box width={2 / 5}>
                    <Field.Text
                      name="issueCity"
                      label="Місто укладення договору"
                      placeholder="Введіть місто"
                    />
                    <Validation.Required
                      field="issueCity"
                      message="Обов&#700;язкове поле"
                    />
                  </Box>
                  <Box width={2 / 5}>
                    <Field.Textarea
                      name="miscellaneous"
                      label="Інші умови (залежно від виду медичних послуг)"
                      placeholder="Перерахуйте умови (за наявності)"
                      rows={5}
                    />
                  </Box>
                  <Flex mt={5}>
                    <Box mr={3}>
                      <Link to="../">
                        <ButtonWidth variant="blue">Повернутися</ButtonWidth>
                      </Link>
                    </Box>
                    <ButtonWidth variant="green">Оновити</ButtonWidth>
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
