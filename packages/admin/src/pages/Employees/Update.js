import React from "react";
import isEmpty from "lodash/isEmpty";
import { I18n } from "@lingui/react";
import Composer from "react-composer";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Mutation, Query } from "react-apollo";
import { Trans, t, DateFormat } from "@lingui/macro";
import { Heading, Flex, Box, Text } from "@rebass/emotion";
import {
  Field as ControlledField,
  Form,
  Validation,
  Validations
} from "@ehealth/components";
import { PositiveIcon, RemoveItemIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";
import {
  parsePhone,
  formatPhone,
  getFullName,
  cleanDeep
} from "@ehealth/utils";
import { subYears, format } from "date-fns";

import Line from "../../components/Line";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import DocumentView from "../../components/DocumentView";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";
import {
  TAX_ID_PATTERN,
  NO_TAX_ID_DOCUMENT_PATTERN,
  UUID_PATTERN,
  CYRILLIC_NAME
} from "../../constants/validationPatterns";

import env from "../../env";

import EmployeeQuery from "./";

const CreateEmployeeRequestMutation = loader(
  "../../graphql/CreateEmployeeRequestMutation.graphql"
);

const Update = ({ id, location: { state } }) => (
  <Query query={EmployeeQuery} variables={{ id }}>
    {({ data: { employee = {} } }) => {
      if (isEmpty(employee)) return null;
      return (
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
            <CreationForm path="/" employee={employee} />
            <Confirmation path="/confirm" />
          </Router>
        </>
      );
    }}
  </Query>
);

const CreationForm = ({
  navigate,
  location,
  employee,
  location: { state }
}) => {
  const { toUpdateEmployeeData } = state || {};
  const {
    id,
    databaseId,
    party: {
      firstName,
      lastName,
      secondName,
      taxId,
      noTaxId,
      gender,
      email,
      phones = [],
      birthDate,
      documents = []
    },
    position,
    employeeType,
    startDate,
    division
  } = employee;

  const taxDocument = noTaxId
    ? {
        passport: taxId
      }
    : {
        taxNumber: taxId
      };
  const formattedPhones = phones.map(({ type, number }) => ({
    type,
    number
  }));
  const formattedDocuments = documents.map(
    ({ type, number, issuedBy, issuedAt }) => ({
      type,
      number,
      issued_by: issuedBy,
      issued_at: issuedAt
    })
  );

  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Updating employee</Trans>
      </Heading>
      <Form
        onSubmit={data => {
          navigate("./confirm", {
            state: {
              toUpdateEmployeeData: data
            }
          });
        }}
        initialValues={
          toUpdateEmployeeData || {
            position,
            employee_type: employeeType,
            start_date: startDate,
            division_id: division && division.databaseId,
            employee_id: databaseId,
            party: {
              first_name: firstName,
              last_name: lastName,
              second_name: secondName,
              birth_date: birthDate,
              gender,
              email,
              phones: formattedPhones,
              no_tax_id: noTaxId,
              tax_id: taxDocument,
              documents: formattedDocuments
            }
          }
        }
      >
        <Flex mx={-1}>
          <Box px={1} width={1 / 3}>
            <Trans
              id="Enter first name"
              render={({ translation }) => (
                <Field.Text
                  name="party.first_name"
                  label={<Trans>First name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validations field="party.first_name">
              <Validation.Required message="Required field" />
              <Validation.Matches
                options={CYRILLIC_NAME}
                message="Invalid first name"
              />
            </Validations>
          </Box>
          <Box px={1} width={1 / 3}>
            <Trans
              id="Enter second name"
              render={({ translation }) => (
                <Field.Text
                  name="party.second_name"
                  label={<Trans>Second name</Trans>}
                  placeholder={translation}
                />
              )}
            />
          </Box>
          <Box px={1} width={1 / 3}>
            <Trans
              id="Enter last name"
              render={({ translation }) => (
                <Field.Text
                  name="party.last_name"
                  label={<Trans>Last name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validations field="party.last_name">
              <Validation.Required message="Required field" />
              <Validation.Matches
                options={CYRILLIC_NAME}
                message="Invalid last name"
              />
            </Validations>
          </Box>
        </Flex>
        <Flex mx={-1}>
          <Box px={1} width={1 / 3}>
            <Composer
              components={[
                <DictionaryValue name="GENDER" />,
                ({ render }) => <Trans id="Select option" render={render} />
              ]}
            >
              {([dict, { translation }]) => (
                <Field.Select
                  name="party.gender"
                  label={<Trans>Gender</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              )}
            </Composer>
            <Validation.Required
              field="party.gender"
              message="Required field"
            />
          </Box>
          <Box px={1} width={1 / 3}>
            <Field.DatePicker
              name="party.birth_date"
              label={<Trans>Date of birth</Trans>}
              minDate={format(subYears(new Date(), 150), "YYYY-MM-DD")}
            />
            <Validations field="party.birth_date">
              <Validation.Required message="Required field" />
              <Validation.BirthDate message="Invalid birth date" />
            </Validations>
          </Box>
        </Flex>
        <Line />
        <Text fontSize={2} mb={6}>
          <Trans>Job information</Trans>
        </Text>
        <Flex mx={-1}>
          <Box px={1} width={1 / 4}>
            <Composer
              components={[
                <DictionaryValue name="POSITION" />,
                ({ render }) => <Trans id="Select option" render={render} />
              ]}
            >
              {([dict, { translation }]) => (
                <Field.Select
                  name="position"
                  label={<Trans>Position</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              )}
            </Composer>
            <Validation.Required field="position" message="Required field" />
          </Box>
          <Box px={1} width={1 / 4}>
            <Composer
              components={[
                <DictionaryValue name="EMPLOYEE_TYPE" />,
                ({ render }) => <Trans id="Select option" render={render} />
              ]}
            >
              {([dict, { translation }]) => (
                <Field.Select
                  name="employee_type"
                  label={<Trans>Employee type</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict).filter(item => /^NHS/.test(item))}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              )}
            </Composer>
            <Validation.Required
              field="employee_type"
              message="Required field"
            />
          </Box>
          <Box px={1} width={1 / 4}>
            <Field.DatePicker
              name="start_date"
              label={<Trans>Start date</Trans>}
              minDate="1900-01-01"
            />
            <Validation.Required field="start_date" message="Required field" />
          </Box>
          <Box px={1} width={1 / 4}>
            <Trans
              id="Enter division ID"
              render={({ translation }) => (
                <Field.Text
                  name="division_id"
                  label={<Trans>Division ID</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validation.Matches
              field="division_id"
              options={UUID_PATTERN}
              message="Invalid ID"
            />
          </Box>
        </Flex>
        <Line />
        <Text fontSize={2} mb={6}>
          <Trans>Contact information</Trans>
        </Text>
        <Box pr={1} width={1 / 3}>
          <Trans
            id="Enter email"
            render={({ translation }) => (
              <Field.Text
                name="party.email"
                label={<Trans>Email</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validations field="party.email">
            <Validation.Required message="Required field" />
            <Validation.Email message="Invalid email" />
          </Validations>
        </Box>
        <Field.Array
          name="party.phones"
          addText={<Trans>Add phone</Trans>}
          fields={PhonesForm}
          removeButton={({ onClick }) => <RemoveButton onClick={onClick} />}
        />
        <Line />
        <Text fontSize={2} mb={6}>
          <Trans>Documents</Trans>
        </Text>
        <Flex>
          <Box pr={2} width={2 / 9}>
            <Trans
              id="Enter the number"
              render={({ translation }) => (
                <ControlledField
                  name="party.no_tax_id"
                  subscription={{ value: true }}
                >
                  {({ input: { value } }) =>
                    value ? (
                      <>
                        <Field.Text
                          name="party.tax_id.passport"
                          label={<Trans>Passport</Trans>}
                          placeholder={translation}
                          maxLength={9}
                        />
                        <Validation.Matches
                          field="party.tax_id.passport"
                          options={NO_TAX_ID_DOCUMENT_PATTERN}
                          message="Invalid passport number"
                        />
                      </>
                    ) : (
                      <>
                        <Field.Text
                          name="party.tax_id.taxNumber"
                          label={<Trans>INN</Trans>}
                          placeholder={translation}
                          maxLength={10}
                        />
                        <Validation.Matches
                          field="party.tax_id.taxNumber"
                          options={TAX_ID_PATTERN}
                          message="Invalid tax number"
                        />
                      </>
                    )
                  }
                </ControlledField>
              )}
            />
          </Box>
          <Box alignSelf="center">
            <Field.Checkbox
              label={<Trans>Person waived of tax ID</Trans>}
              name="party.no_tax_id"
            />
            <ControlledField.Listener
              field="party.no_tax_id"
              set="party.tax_id"
              to=""
            />
          </Box>
        </Flex>
        <Field.Array
          name="party.documents"
          addText={<Trans>Add document</Trans>}
          fields={DocumentsForm}
          removeButton={({ onClick }) => <RemoveButton onClick={onClick} />}
        />
        <Line />
        <Flex mb={200}>
          <Box mr={3}>
            <Button
              type="reset"
              variant="blue"
              width={140}
              onClick={() => navigate(`/employees/${id}`)}
            >
              <Trans>Back</Trans>
            </Button>
          </Box>
          <Box>
            <Button variant="green" width={140}>
              <Trans>Update</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const PhonesForm = ({ name }) => (
  <>
    <Box pr={2} width={2 / 9}>
      <Field.Text
        name={`${name}.number`}
        label={<Trans>Phone number</Trans>}
        format={formatPhone}
        parse={parsePhone}
      />
      <Validations field={`${name}.number`}>
        <Validation.Required message="Required field" />
        <Validation.Matches
          options={"^\\+380\\d{9}$"}
          message="Invalid phone number"
        />
        <Validation.Custom
          options={({
            value,
            allValues: {
              party: { phones }
            }
          }) => {
            const duplicates = phones.filter(
              phone => phone && phone.number === value
            );
            return duplicates.length === 1;
          }}
          message="This number is used more than once"
        />
      </Validations>
    </Box>
    <Box pr={2} width={2 / 9}>
      <Composer components={[<DictionaryValue name="PHONE_TYPE" />, <I18n />]}>
        {([dict, { i18n }]) => {
          const translation = i18n._(t`Select option`);
          return (
            <Field.Select
              name={`${name}.type`}
              label={<Trans>Phone type</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          );
        }}
      </Composer>
      <Validation.Required field={`${name}.type`} message="Required field" />
    </Box>
  </>
);

const DocumentsForm = ({ name }) => (
  <>
    <Box pr={2} width={2 / 9}>
      <Composer
        components={[<DictionaryValue name="DOCUMENT_TYPE" />, <I18n />]}
      >
        {([dict, { i18n }]) => {
          const translation = i18n._(t`Select option`);
          return (
            <Field.Select
              name={`${name}.type`}
              label={<Trans>Select document type</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          );
        }}
      </Composer>
      <Validations field={`${name}.type`}>
        <Validation.Required message="Required field" />
        <Validation.Custom
          options={({
            value,
            allValues: {
              party: { documents }
            }
          }) => {
            const duplicates = documents.filter(
              doc => doc && doc.type === value
            );
            return duplicates.length === 1;
          }}
          message="This document type is used more than once"
        />
      </Validations>
    </Box>
    <Box pr={2} width={2 / 9}>
      <I18n>
        {({ i18n }) => (
          <Field.Text
            name={`${name}.number`}
            label={<Trans>Document number</Trans>}
            placeholder={i18n._(t`Enter the number`)}
          />
        )}
      </I18n>
      <Validation.Required field={`${name}.number`} message="Required field" />
    </Box>
    <Box pr={2} width={2 / 9}>
      <I18n>
        {({ i18n }) => (
          <Field.Text
            name={`${name}.issued_by`}
            label={<Trans>Authority that issued</Trans>}
            placeholder={i18n._(t`Enter authority name`)}
            autoComplete="off"
          />
        )}
      </I18n>
      <Validation.Required
        field={`${name}.issued_by`}
        message="Required field"
      />
    </Box>
    <Box pr={2} width={2 / 9}>
      <Field.DatePicker
        name={`${name}.issued_at`}
        label={<Trans>Date of issue</Trans>}
        minDate="1900-01-01"
      />
      <Validation.Required
        field={`${name}.issued_at`}
        message="Required field"
      />
    </Box>
  </>
);

const Confirmation = ({ navigate, location: { state } }) => {
  if (!state) return null;
  const {
    toUpdateEmployeeData: { division_id, party, ...toUpdateEmployeeData }
  } = state;

  const cleanedEmployeeData = cleanDeep(
    {
      ...toUpdateEmployeeData,
      division_id: division_id ? division_id : undefined
    },
    { nullableValues: false }
  );

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          fullName: <Trans>Name of employee</Trans>,
          gender: <Trans>Gender</Trans>,
          birthDate: <Trans>Date of birth</Trans>
        }}
        data={{
          fullName: getFullName({
            firstName: party.first_name,
            secondName: party.second_name,
            lastName: party.last_name
          }),
          gender: <DictionaryValue name="GENDER" item={party.gender} />,
          birthDate: <DateFormat value={party.birth_date} />
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          position: <Trans>Position</Trans>,
          employeeType: <Trans>Employee type</Trans>,
          startDate: <Trans>Start date</Trans>
        }}
        data={{
          position: (
            <DictionaryValue
              name="POSITION"
              item={toUpdateEmployeeData.position}
            />
          ),
          employeeType: (
            <DictionaryValue
              name="EMPLOYEE_TYPE"
              item={toUpdateEmployeeData.employee_type}
            />
          ),
          startDate: <DateFormat value={toUpdateEmployeeData.start_date} />
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          email: <Trans>Email</Trans>,
          phones: <Trans>Phones</Trans>
        }}
        data={{
          email: party.email,
          phones: party.phones.map(({ number }) => number).join(", ")
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          taxId: party.no_tax_id ? <Trans>Passport</Trans> : <Trans>INN</Trans>,
          noTaxId: <Trans>No tax ID</Trans>,
          documents: <Trans>Documents</Trans>
        }}
        data={{
          taxId: party.tax_id.taxNumber || party.tax_id.passport,
          noTaxId: party.no_tax_id ? <PositiveIcon /> : null,
          documents: party.documents.map(
            ({ number, type, issued_at, issued_by }, index) => (
              <Box key={index} pb={4}>
                <Heading fontSize="0" fontWeight="bold" pb={3}>
                  <DictionaryValue name="DOCUMENT_TYPE" item={type} />
                </Heading>
                <DocumentView
                  data={{
                    number,
                    issuedAt: issued_at,
                    issuedBy: issued_by
                  }}
                />
              </Box>
            )
          )
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
                  toUpdateEmployeeData: {
                    ...cleanedEmployeeData,
                    party
                  }
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
              <Mutation mutation={CreateEmployeeRequestMutation}>
                {createEmployeeRequest => (
                  <Button
                    variant="green"
                    width={140}
                    onClick={async () => {
                      const { signedContent } = await signData({
                        employee_request: {
                          ...cleanedEmployeeData,
                          party: {
                            ...party,
                            tax_id:
                              party.tax_id.taxNumber || party.tax_id.passport
                          },
                          status: "NEW"
                        }
                      });
                      await createEmployeeRequest({
                        variables: {
                          input: {
                            signedContent: {
                              content: signedContent,
                              encoding: "BASE64"
                            }
                          }
                        }
                      });
                      await navigate("/employee-requests");
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
    </Box>
  );
};

const RemoveButton = ({ onClick }) => (
  <Box width={1 / 9} alignSelf="center">
    <RemoveItemIcon onClick={onClick} />
  </Box>
);

export default Update;
