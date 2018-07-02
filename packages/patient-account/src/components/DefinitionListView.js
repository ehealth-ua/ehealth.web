import React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { prop } from "styled-tools";

import { DefinitionList } from "@ehealth/components";

const DefinitionListView = ({ title, labels, data }) => (
  <List>
    <DefinitionList
      labels={labels}
      data={data}
      renderItem={({ label, value }) => (
        <>
          <Label>{label}</Label>
          <Details>{value}</Details>
        </>
      )}
    />
  </List>
);

export default DefinitionListView;

const List = styled.dl`
  display: flex;
  flex-wrap: wrap;
  font-size: ${prop("theme.definitionList.fontSize")}px;
  padding-right: calc(
    100% - ${prop("theme.definitionList.labelWidth")}px -
      ${prop("theme.definitionList.detailsWidth")}px
  );
`;

const itemStyle = css`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.dt`
  flex-basis: ${prop("theme.definitionList.labelWidth")}px;
  font-weight: 700;
  padding-right: 10px;
  ${itemStyle};
`;

const Details = styled.dd`
  flex-basis: calc(100% - ${prop("theme.definitionList.labelWidth")}px);
  margin-left: 0;
  ${itemStyle};
`;
