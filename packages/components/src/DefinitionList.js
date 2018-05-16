import React, { Fragment } from "react";

const DefinitionList = ({ data, labels, renderRow }) =>
  Object.entries(data).map(([key, text], index) => (
    <Fragment key={index}>{renderRow(text, labels[key])}</Fragment>
  ));

export default DefinitionList;
