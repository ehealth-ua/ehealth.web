import React from "react";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";

import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";
import * as SearchField from "../../../components/SearchField";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
      <SearchField.MedicalProgram name="filter.medicalProgram" />
    </Box>
    <Box px={1} width={1 / 4}>
      <SearchField.Service name="filter.service" />
    </Box>
    <Box px={1} width={1 / 4}>
      <SearchField.ServiceGroup name="filter.serviceGroup" />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.isActive"
            label={<Trans>Status</Trans>}
            items={Object.keys(STATUSES.ACTIVE_STATUS_F)}
            itemToString={item => STATUSES.ACTIVE_STATUS_F[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.requestAllowed"
            label={<Trans>Is request allowed</Trans>}
            items={Object.keys(STATUSES.YES_NO)}
            itemToString={item => STATUSES.YES_NO[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

export { PrimarySearchFields, SecondarySearchFields };
