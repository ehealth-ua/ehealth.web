import React, { Fragment } from "react";

const SectionList = ({
  data,
  label,
  renderRow,
  renderHeader,
  keyExtractor = index => index
}) => {
  return (
    <>
      {renderHeader ? renderHeader() : null}
      {Object.entries(data).map(([key, text], index) => {
        return (
          <Fragment key={keyExtractor(index)}>
            {renderRow(text, label[key])}
          </Fragment>
        );
      })}
    </>
  );
};

export default SectionList;
