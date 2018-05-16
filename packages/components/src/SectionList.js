import React, { Fragment } from "react";

const SectionList = ({ data, label, renderRow, renderHeader }) => (
  <>
    {renderHeader && renderHeader()}
    {Object.entries(data).map(([key, text], index) => {
      return <Fragment key={index}>{renderRow(text, label[key])}</Fragment>;
    })}
  </>
);

export default SectionList;
