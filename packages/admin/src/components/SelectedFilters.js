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
      date: {
        startFrom,
        startTo,
        endFrom,
        endTo,
        insertedAtFrom,
        insertedAtTo
      } = {},
      contractorLegalEntity: { name } = {}
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
            <DictionaryValue name="MEDICATION_UNIT" item={form} />
          </Box>
          <RemoveSelected reset={{ form: undefined }} />
        </SelectedItem>
      )}
    </Flex>
  );
};

export default SelectedFilters;
