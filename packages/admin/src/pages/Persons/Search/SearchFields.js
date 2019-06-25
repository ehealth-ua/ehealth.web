//@flow
import React from "react";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { Validation, Field as DependedField } from "@ehealth/components";
import { formatPhone, parsePhone } from "@ehealth/utils";

import STATUSES from "../../../helpers/statuses";
import {
  EDRPOU_PATTERN,
  PHONE_PATTERN,
  CYRILLIC_NAME,
  BIRTH_CERTIFICATE,
  NATIONAL_ID,
  UUID_PATTERN
} from "../../../constants/validationPatterns";
import * as Field from "../../../components/Field";
import DictionaryValue from "../../../components/DictionaryValue";
import Button from "../../../components/Button";
import Line from "../../../components/Line";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={2 / 5}>
      <Trans
        id="Enter INN"
        render={({ translation }) => (
          <Field.Text
            name="filter.taxId"
            label={<Trans>INN</Trans>}
            placeholder={translation}
            maxLength={10}
          />
        )}
      />
      <Validation.Matches
        field="filter.taxId"
        options={EDRPOU_PATTERN}
        message="Invalid tax id"
      />
    </Box>
    <Divider />
    <Box px={1} width={2 / 5}>
      <Trans
        id="Enter ID"
        render={({ translation }) => (
          <Field.Text
            name="filter.databaseId"
            label={<Trans>Person ID</Trans>}
            placeholder={translation}
          />
        )}
      />
      <Validation.Matches
        field="filter.databaseId"
        options={UUID_PATTERN}
        message="Invalid person ID"
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <Flex mx={-1}>
    <Box width={2 / 5}>
      <Line my={4} />
      <Flex>
        <Box px={1} width={1 / 2}>
          <Trans
            id="Enter first name"
            render={({ translation }) => (
              <Field.Text
                name="filter.identity.firstName"
                label={<Trans>First name</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Matches
            field="filter.identity.firstName"
            options={CYRILLIC_NAME}
            message="Invalid name"
          />
          <DependedField
            name="filter.identity.lastName"
            subscription={{ value: true }}
          >
            {({ input: { value } }) =>
              value ? (
                <Validation.Required
                  field="filter.identity.firstName"
                  message="Required field"
                />
              ) : null
            }
          </DependedField>
        </Box>
        <Box px={1} width={1 / 2}>
          <Trans
            id="Enter last name"
            render={({ translation }) => (
              <Field.Text
                name="filter.identity.lastName"
                label={<Trans>Last name</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Matches
            field="filter.identity.lastName"
            options={CYRILLIC_NAME}
            message="Invalid last name"
          />
          <DependedField
            name="filter.identity.firstName"
            subscription={{ value: true }}
          >
            {({ input: { value } }) =>
              value ? (
                <Validation.Required
                  field="filter.identity.lastName"
                  message="Required field"
                />
              ) : null
            }
          </DependedField>
        </Box>
      </Flex>
      <Flex>
        <Box px={1} width={1 / 2}>
          <Trans
            id="Enter document number"
            render={({ translation }) => (
              <DependedField
                name="filter.identity.type"
                subscription={{ value: true }}
              >
                {({ input: { value } }) => {
                  const { pattern, maxLength } = getValidationPattern(value);

                  return (
                    <>
                      <Field.Text
                        name="filter.identity.number"
                        label={<Trans>Document number</Trans>}
                        placeholder={translation}
                        disabled={!value}
                        maxLength={maxLength}
                        width="100%"
                      />
                      <Validation.Matches
                        field="filter.identity.number"
                        options={pattern}
                        message="Invalid number"
                      />
                    </>
                  );
                }}
              </DependedField>
            )}
          />
          <DependedField.Listener
            field="filter.identity.type"
            set="filter.identity.number"
            to=""
          />
        </Box>
        <Box px={1} width={1 / 2}>
          <DictionaryValue name="DOCUMENT_TYPE">
            {documentTypes => (
              <Trans
                id="Select document type"
                render={({ translation }) => (
                  <Field.Select
                    name="filter.identity.type"
                    label="&nbsp;"
                    items={Object.keys(documentTypes)}
                    itemToString={item => documentTypes[item] || translation}
                    variant="select"
                    emptyOption
                  />
                )}
              />
            )}
          </DictionaryValue>
        </Box>
      </Flex>
    </Box>
    <Divider />
    <DependedField name="filter.identity" subscription={{ value: true }}>
      {({ input: { value } }) => {
        const identity = Object.keys(value).filter(
          item => value[item] && item !== "type"
        );
        return (
          <Box width={2 / 5}>
            <Line my={4} />
            <Box px={1}>
              <Field.Text
                name="filter.personal.authenticationMethod.phoneNumber"
                label={<Trans>Phone number</Trans>}
                format={formatPhone}
                parse={parsePhone}
                disabled={isEmpty(identity)}
              />
              <Validation.Matches
                field="filter.personal.authenticationMethod.phoneNumber"
                options={PHONE_PATTERN}
                message="Invalid phone number"
              />
            </Box>
            <Flex>
              <Box px={1} width={1 / 2}>
                <Field.DatePicker
                  name="filter.personal.birthDate"
                  label={<Trans>Date of birth</Trans>}
                  minDate="1900-01-01"
                  disabled={isEmpty(identity)}
                />
              </Box>
              <Box px={1} width={1 / 2}>
                <Trans
                  id="Select person status"
                  render={({ translation }) => (
                    <Field.Select
                      name="filter.status"
                      label={<Trans>Person status</Trans>}
                      items={Object.keys(STATUSES.PERSON)}
                      itemToString={item =>
                        STATUSES.PERSON[item] || translation
                      }
                      variant="select"
                      emptyOption
                    />
                  )}
                />
              </Box>
            </Flex>
          </Box>
        );
      }}
    </DependedField>
  </Flex>
);

const SearchButton = () => (
  <DependedField name="filter" subscription={{ value: true }}>
    {({
      input: {
        value: {
          taxId,
          databaseId,
          identity = {},
          personal = {},
          personal: { authenticationMethod: { phoneNumber = {} } = {} } = {}
        }
      }
    }) => (
      <Button
        variant="blue"
        disabled={
          isEmpty(taxId) &&
          isEmpty(databaseId) &&
          ((isEmpty(identity.number) &&
            (isEmpty(identity.firstName) || isEmpty(identity.lastName))) ||
            (isEmpty(phoneNumber) && isEmpty(personal.birthDate)))
        }
      >
        <Trans>Search</Trans>
      </Button>
    )}
  </DependedField>
);

export { PrimarySearchFields, SecondarySearchFields, SearchButton };

const getValidationPattern = data => {
  switch (data) {
    case "BIRTH_CERTIFICATE":
    case "TEMPORARY_PASSPORT": {
      return {
        pattern: BIRTH_CERTIFICATE,
        maxLength: 25
      };
    }
    case "NATIONAL_ID": {
      return {
        pattern: NATIONAL_ID,
        maxLength: 9
      };
    }
    default: {
      return {
        pattern: "^((?![ЫЪЭЁ])([А-ЯҐЇІЄ])){2}[0-9]{6}$",
        maxLength: 8
      };
    }
  }
};

const Divider = system(
  {
    mx: 5,
    width: "1px",
    bg: "januaryDawn"
  },
  "color",
  "width",
  "space"
);
