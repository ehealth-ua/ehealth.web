import React from "react";
import styled from "react-emotion/macro";

import { DefinitionList } from "@ehealth/components";

const DefinitionListView = ({ title, labels, data }) => (
  <DefinitionList
    labels={labels}
    data={data}
    renderRow={(detail, labels) => (
      <DefinitionWrapper>
        <Term>{labels}</Term>
        <Details>{detail}</Details>
      </DefinitionWrapper>
    )}
  />
);

const DefinitionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 18px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Details = styled.div`
  margin-bottom: 20px;
`;

const Term = styled(Details)`
  flex-basis: 200px;
  font-weight: 700;
  padding-right: 10px;
`;

export default DefinitionListView;
