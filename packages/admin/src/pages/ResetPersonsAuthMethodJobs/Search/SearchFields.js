import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Flex } from "@rebass/emotion";
import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Status</Trans>}
            placeholder={translation}
            items={Object.keys(STATUSES.JOBS)}
            itemToString={item => STATUSES.JOBS[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

export { PrimarySearchFields };
