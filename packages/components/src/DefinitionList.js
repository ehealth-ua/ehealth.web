import React, { Fragment } from "react";
import isNil from "lodash/isNil";

const DefinitionList = ({
  data,
  labels,
  renderItem,
  keyExtractor = (name, index) => name
}) =>
  Object.entries(labels)
    .filter(([name]) => !isNil(data[name]))
    .map(([name, label], index) => (
      <Fragment key={keyExtractor(name, index)}>
        {renderItem({ label, value: data[name] })}
      </Fragment>
    ));

export default DefinitionList;
