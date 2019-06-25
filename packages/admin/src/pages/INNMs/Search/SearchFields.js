import React from "react";
import { Trans, t } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import { SearchIcon } from "@ehealth/icons";
import { Validation } from "@ehealth/components";

import * as Field from "../../../components/Field";
import parseDigits from "../../../helpers/parseDigits";
import * as SearchField from "../../../components/SearchField";
import { UUID_PATTERN } from "../../../constants/validationPatterns";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
      <SearchField.INNM
        name="filter.name"
        placeholder={t`Choose INNM`}
        getItemByKey="name"
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <SearchField.INNM
        name="filter.nameOriginal"
        placeholder={t`Choose INNM original name`}
        label={<Trans>INNM original name</Trans>}
        getItemByKey="nameOriginal"
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter INNM ID"
        render={({ translation }) => (
          <Field.Text
            name="filter.databaseId"
            label={<Trans>Search by INNM ID</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
      <Validation.Matches
        field="filter.databaseId"
        options={UUID_PATTERN}
        message="Invalid ID"
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter SCTID"
        render={({ translation }) => (
          <Field.Text
            name="filter.sctid"
            label={<Trans>Search by SCTID</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
            maxLength={8}
            format={parseDigits}
          />
        )}
      />
    </Box>
  </Flex>
);

export { PrimarySearchFields };
