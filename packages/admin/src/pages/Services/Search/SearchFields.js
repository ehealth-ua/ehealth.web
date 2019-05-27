import React from "react";
import Composer from "react-composer";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";
import { Validation } from "@ehealth/components";

import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";
import DictionaryValue from "../../../components/DictionaryValue";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter service name"
        render={({ translation }) => (
          <Field.Text
            name="filter.name"
            label={<Trans>Search by service name</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter service code"
        render={({ translation }) => (
          <Field.Text
            name="filter.code"
            label={<Trans>Search by service code</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.isActive"
            label={<Trans>Status</Trans>}
            items={Object.keys(STATUSES.ACTIVE_STATUS_M)}
            itemToString={item => STATUSES.ACTIVE_STATUS_M[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Composer
        components={[
          <DictionaryValue name="SERVICE_CATEGORY" />,
          ({ render }) => <Trans id="Select option" render={render} />
        ]}
      >
        {([dict, { translation }]) => (
          <Field.Select
            name="filter.category"
            label={<Trans>Service category</Trans>}
            placeholder={translation}
            items={Object.keys(dict)}
            itemToString={item => dict[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      </Composer>
    </Box>
  </Flex>
);

export { PrimarySearchFields };
