//@flow
import * as React from "react";
import { Trans } from "@lingui/macro";

import * as Field from "../Field";
import STATUSES from "../../helpers/statuses";

const StatusField = ({
  name,
  status,
  label
}: {
  name: string,
  status: string,
  label?: React.ElementType
}) => (
  <Trans
    id="All statuses"
    render={({ translation }) => (
      <Field.Select
        name={name}
        label={label || <Trans>Status</Trans>}
        items={Object.keys(STATUSES[status])}
        itemToString={item => STATUSES[status][item] || translation}
        variant="select"
        emptyOption
      />
    )}
  />
);

export default StatusField;
