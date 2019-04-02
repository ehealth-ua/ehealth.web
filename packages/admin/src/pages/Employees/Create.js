import React from "react";
import { I18n } from "@lingui/react";
import Composer from "react-composer";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Mutation } from "react-apollo";
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
import { parsePhone, formatPhone, getFullName } from "@ehealth/utils";

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
  UUID_PATTERN
} from "../../constants/validationPatterns";

import env from "../../env";

const CreateEmployeeRequestMutation = loader(
  "../../graphql/CreateEmployeeRequestMutation.graphql"
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
  const { createEmployee } = state || {};
  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Add employee</Trans>
      </Heading>
      <Form
        onSubmit={data => {
          navigate("./confirm", {
            state: {
              createEmployee: data
            }
          });
        }}
        initialValues={
          createEmployee || {
            party: {
              documents: [
                {
                  number: ""
                }
              ],
              phones: [
                {
                  number: ""
                }
              ]
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
                  name="party.firstName"
                  label={<Trans>First name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validation.Required
              field="party.firstName"
              message="Required field"
            />
          </Box>
          <Box px={1} width={1 / 3}>
            <Trans
              id="Enter second name"
              render={({ translation }) => (
                <Field.Text
                  name="party.secondName"
                  label={<Trans>Second name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validation.Required
              field="party.secondName"
              message="Required field"
            />
          </Box>
          <Box px={1} width={1 / 3}>
            <Trans
              id="Enter last name"
              render={({ translation }) => (
                <Field.Text
                  name="party.lastName"
                  label={<Trans>Last name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validation.Required
              field="party.lastName"
              message="Required field"
            />
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
              name="party.birthDate"
              label={<Trans>Date of birth</Trans>}
              minDate="1900-01-01"
            />
            <Validation.Required
              field="party.birthDate"
              message="Required field"
            />
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
                  name="employeeType"
                  label={<Trans>Employee type</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              )}
            </Composer>
            <Validation.Required
              field="employeeType"
              message="Required field"
            />
          </Box>
          <Box px={1} width={1 / 4}>
            <Field.DatePicker
              name="startDate"
              label={<Trans>Start date</Trans>}
              minDate="1900-01-01"
            />
            <Validation.Required field="startDate" message="Required field" />
          </Box>
          <Box px={1} width={1 / 4}>
            <Trans
              id="Enter division ID"
              render={({ translation }) => (
                <Field.Text
                  name="divisionId"
                  label={<Trans>Division ID</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validations field="divisionId">
              <Validation.Required message="Required field" />
              <Validation.Matches options={UUID_PATTERN} message="Invalid ID" />
            </Validations>
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
                  name="party.noTaxId"
                  subscription={{ value: true }}
                >
                  {({ input: { value } }) => {
                    const validationPattern = value
                      ? NO_TAX_ID_DOCUMENT_PATTERN
                      : TAX_ID_PATTERN;
                    return (
                      <>
                        <Field.Text
                          name="party.taxId"
                          label={
                            value ? <Trans>Passport</Trans> : <Trans>INN</Trans>
                          }
                          placeholder={translation}
                          maxLength={value ? 9 : 10}
                        />
                        <Validation.Matches
                          field="party.taxId"
                          options={validationPattern}
                          message="Invalid number"
                        />
                      </>
                    );
                  }}
                </ControlledField>
              )}
            />
          </Box>
          <Box alignSelf="center">
            <Field.Checkbox
              label={<Trans>Person waived of tax ID</Trans>}
              name="party.noTaxId"
            />
            <ControlledField.Listener
              field="party.noTaxId"
              set="party.taxId"
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
      <Validation.Required field={`${name}.type`} message="Required field" />
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
            name={`${name}.issuedBy`}
            label={<Trans>Authority that issued</Trans>}
            placeholder={i18n._(t`Enter authority name`)}
            autoComplete="off"
          />
        )}
      </I18n>
      <Validation.Required
        field={`${name}.issuedBy`}
        message="Required field"
      />
    </Box>
    <Box pr={2} width={2 / 9}>
      <Field.DatePicker
        name={`${name}.issuedAt`}
        label={<Trans>Date of issue</Trans>}
        minDate="1900-01-01"
      />
      <Validation.Required
        field={`${name}.issuedAt`}
        message="Required field"
      />
    </Box>
  </>
);

const Confirmation = ({ navigate, location: { state } }) => {
  if (!state) return null;
  const {
    createEmployee,
    createEmployee: {
      position,
      startDate,
      employeeType,
      divisionId,
      party: {
        birthDate,
        gender,
        taxId,
        noTaxId,
        email,
        documents,
        phones,
        ...fullName
      }
    }
  } = state;
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          fullName: <Trans>Name of employee</Trans>,
          gender: <Trans>Gender</Trans>,
          birthDate: <Trans>Date of birth</Trans>
        }}
        data={{
          fullName: getFullName(fullName),
          gender: <DictionaryValue name="GENDER" item={gender} />,
          birthDate: <DateFormat value={birthDate} />
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
          position: <DictionaryValue name="POSITION" item={position} />,
          employeeType: (
            <DictionaryValue name="EMPLOYEE_TYPE" item={employeeType} />
          ),
          startDate: <DateFormat value={startDate} />,
          divisionId
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
          email,
          phones: phones.map(({ number }) => number).join(", ")
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          taxId: noTaxId ? <Trans>Passport</Trans> : <Trans>INN</Trans>,
          noTaxId: <Trans>No tax ID</Trans>,
          documents: <Trans>Documents</Trans>
        }}
        data={{
          taxId,
          noTaxId: noTaxId ? <PositiveIcon /> : null,
          documents: documents.map(({ type, ...documentDetails }, index) => (
            <Box key={index} pb={4}>
              <Heading fontSize="0" fontWeight="bold" pb={3}>
                <DictionaryValue name="DOCUMENT_TYPE" item={type} />
              </Heading>
              <DocumentView data={documentDetails} />
            </Box>
          ))
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
                  createEmployee
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
                        ...createEmployee,
                        status: "NEW"
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

export default Create;