import React from "react";
import Composer from "react-composer";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import * as Field from "../../../components/Field";
import * as SearchField from "../../../components/SearchField";
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
      <SearchField.Status name="filter.isActive" status="ACTIVE_STATUS_M" />
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
