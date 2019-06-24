import React from "react";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";
import * as SearchField from "../../../components/SearchField";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <SearchField.MedicalProgram name="filter.medicalProgram" />
    </Box>
    <Box px={1} width={1 / 3}>
      <SearchField.Medication name="filter.medication" />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter INNM dosage name"
        render={({ translation }) => (
          <Field.Text
            name="filter.medication.innmDosages.name"
            label={<Trans>INNM dosage name</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
            autoComplete="off"
          />
        )}
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter registry number"
        render={({ translation }) => (
          <Field.Text
            name="filter.registryNumber"
            label={<Trans>Registry number</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
            autoComplete="off"
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <SearchField.Status
        name="filter.isActive"
        status="ACTIVE_STATUS_M"
        label={<Trans>Participant status</Trans>}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Select option"
        render={({ translation }) => (
          <Field.Select
            name="filter.medicationRequestAllowed"
            label={<Trans>Prescription creation</Trans>}
            items={Object.keys(STATUSES.MEDICATION_REQUEST_ALLOWED)}
            itemToString={item =>
              STATUSES.MEDICATION_REQUEST_ALLOWED[item] || translation
            }
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

export { PrimarySearchFields, SecondarySearchFields };
