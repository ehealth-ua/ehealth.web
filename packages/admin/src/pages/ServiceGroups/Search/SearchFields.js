import React from "react";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter group name"
        render={({ translation }) => (
          <Field.Text
            name="filter.name"
            label={<Trans>Search by group name</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter group code"
        render={({ translation }) => (
          <Field.Text
            name="filter.code"
            label={<Trans>Search by group code</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
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

export { PrimarySearchFields };
