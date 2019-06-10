import React, { Fragment } from "react";
import isEmpty from "lodash/isEmpty";

type DefinitionListProps = {
  data: { value: React.Node },
  labels: { value: string },
  renderItem: () => mixed,
  keyExtractor?: () => mixed
};

const DefinitionList = ({
  data,
  labels,
  renderItem,
  keyExtractor = name => name
}: DefinitionListProps) =>
  Object.entries(labels)
    .filter(([name]) => !isEmpty(data[name]))
    .map(([name, label], index) => (
      <Fragment key={keyExtractor(name, index)}>
        {renderItem({ label, value: data[name] })}
      </Fragment>
    ));

export default DefinitionList;
