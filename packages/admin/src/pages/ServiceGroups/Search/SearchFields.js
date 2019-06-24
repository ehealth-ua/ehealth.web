import React from "react";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import * as Field from "../../../components/Field";
import * as SearchField from "../../../components/SearchField";

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
      <SearchField.Status name="filter.isActive" status="ACTIVE_STATUS_F" />
    </Box>
  </Flex>
);

export { PrimarySearchFields };
