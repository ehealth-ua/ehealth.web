import React from "react";
import { Box, Flex } from "@rebass/emotion";
import { RemoveItem, SelectedItem } from "./Field/MultiSelectView";
import { DateFormat, Trans } from "@lingui/macro";
import STATUSES from "../helpers/statuses";
import { RemoveItemIcon } from "@ehealth/icons";
import isEmpty from "lodash/isEmpty";
import DictionaryValue from "../components/DictionaryValue";
import resetPaginationParams from "../helpers/resetPaginationParams";

const SelectedFilters = ({ initialValues, onSubmit }) => {
  const {
    filter: {
      legalEntityRelation,
      isSuspended,
      medicalProgram,
      form,
      databaseId,
      employeeType,
      position,
      date: {
        startFrom,
        startTo,
        endFrom,
        endTo,
        insertedAtFrom,
        insertedAtTo
      } = {},
      startDate: { from, to } = {},
      contractorLegalEntity: { name } = {},
      employeeStatus,
      party: { noTaxId, ...party } = {}
    } = {}
  } = initialValues;

  const resetValues = values => ({
    ...initialValues,
    ...resetPaginationParams(initialValues),
    filter: {
      ...initialValues.filter,
      ...values
    }
  });

  const RemoveSelected = ({ reset }) => (
    <RemoveItem onClick={() => onSubmit(resetValues(reset))}>
      <RemoveItemIcon />
    </RemoveItem>
  );

  return (
    <Flex>
      {!isEmpty(medicalProgram) && (
        <SelectedItem mx={1}>
          {medicalProgram.name}
          <RemoveSelected reset={{ medicalProgram: undefined }} />
        </SelectedItem>
      )}
      {!isEmpty(isSuspended) && (
        <SelectedItem mx={1}>
          {STATUSES.SUSPENDED[isSuspended]}
          <RemoveSelected reset={{ isSuspended: undefined }} />
        </SelectedItem>
      )}
      {legalEntityRelation && (
        <SelectedItem mx={1}>
          <Trans>
            contract of {STATUSES.LEGAL_ENTITY_RELATION[legalEntityRelation]}{" "}
            legal entity
          </Trans>
          <RemoveSelected reset={{ legalEntityRelation: undefined }} />
        </SelectedItem>
      )}
      {(startFrom || startTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract start date</Trans>:
          {startFrom && (
            <Box ml={1}>
              з <DateFormat value={startFrom} />
            </Box>
          )}
          {startTo && (
            <Box ml={1}>
              по <DateFormat value={startTo} />
            </Box>
          )}
          <RemoveSelected
            reset={{
              date: {
                startFrom: undefined,
                startTo: undefined,
                endFrom,
                endTo,
                insertedAtFrom,
                insertedAtTo
              }
            }}
          />
        </SelectedItem>
      )}
      {(endFrom || endTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract end date</Trans>:
          {endFrom && (
            <Box ml={1}>
              з <DateFormat value={endFrom} />
            </Box>
          )}
          {endTo && (
            <Box ml={1}>
              по <DateFormat value={endTo} />
            </Box>
          )}
          <RemoveSelected
            reset={{
              date: {
                startFrom,
                startTo,
                endFrom: undefined,
                endTo: undefined,
                insertedAtFrom,
                insertedAtTo
              }
            }}
          />
        </SelectedItem>
      )}
      {(insertedAtFrom || insertedAtTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract inserted date</Trans>:
          {insertedAtFrom && (
            <Box ml={1}>
              з <DateFormat value={insertedAtFrom} />
            </Box>
          )}
          {insertedAtTo && (
            <Box ml={1}>
              по <DateFormat value={insertedAtTo} />
            </Box>
          )}
          <RemoveSelected
            reset={{
              date: {
                startFrom,
                startTo,
                endFrom,
                endTo,
                insertedAtFrom: undefined,
                insertedAtTo: undefined
              }
            }}
          />
        </SelectedItem>
      )}
      {(from || to) && (
        <SelectedItem mx={1}>
          <Trans>Start date</Trans>:
          {from && (
            <Box ml={1}>
              з <DateFormat value={from} />
            </Box>
          )}
          {to && (
            <Box ml={1}>
              по <DateFormat value={to} />
            </Box>
          )}
          <RemoveSelected
            reset={{
              startDate: {
                from: undefined,
                to: undefined
              }
            }}
          />
        </SelectedItem>
      )}
      {name && (
        <SelectedItem mx={1}>
          <Trans>Legal entity name</Trans>:<Box ml={1}>{name}</Box>
          <RemoveSelected
            reset={{ contractorLegalEntity: { name: undefined } }}
          />
        </SelectedItem>
      )}
      {form && (
        <SelectedItem mx={1}>
          <Trans>Form</Trans>:
          <Box ml={1}>
            <DictionaryValue name="MEDICATION_FORM" item={form} />
          </Box>
          <RemoveSelected reset={{ form: undefined }} />
        </SelectedItem>
      )}
      {databaseId && (
        <SelectedItem mx={1}>
          {databaseId}
          <RemoveSelected reset={{ databaseId: undefined }} />
        </SelectedItem>
      )}
      {employeeType && (
        <SelectedItem mx={1}>
          <Trans>Type</Trans>:
          <Box ml={1}>
            <DictionaryValue name="EMPLOYEE_TYPE" item={employeeType} />
          </Box>
          <RemoveSelected reset={{ employeeType: undefined }} />
        </SelectedItem>
      )}
      {position && (
        <SelectedItem mx={1}>
          <Trans>Position</Trans>:
          <Box ml={1}>
            <DictionaryValue name="POSITION" item={position} />
          </Box>
          <RemoveSelected reset={{ position: undefined }} />
        </SelectedItem>
      )}
      {employeeStatus && (
        <SelectedItem mx={1}>
          <Trans>Employee status</Trans>:
          <Box ml={1}>
            <DictionaryValue name="EMPLOYEE_STATUS" item={employeeStatus} />
          </Box>
          <RemoveSelected reset={{ employeeStatus: undefined }} />
        </SelectedItem>
      )}
      {noTaxId && (
        <SelectedItem mx={1}>
          <Trans>{STATUSES.NO_TAX_ID[noTaxId]} </Trans>
          <RemoveSelected reset={{ party: { ...party, noTaxId: undefined } }} />
        </SelectedItem>
      )}
    </Flex>
  );
};

export default SelectedFilters;
