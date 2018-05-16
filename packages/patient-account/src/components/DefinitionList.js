import React from "react";
import styled from "react-emotion/macro";

import { SectionList } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";

const DefinitionList = ({ title, label, data, onEdit }) => (
  <SectionList
    label={label}
    data={data}
    renderRow={(detail, label) => (
      <DefinitionWrapper>
        <Term>{label}</Term>
        <Details>{detail}</Details>
      </DefinitionWrapper>
    )}
    renderHeader={() =>
      title && (
        <SubTitle>
          {title}
          {onEdit && (
            <EditLink onClick={onEdit}>
              <EditIcon height="14" width="14" />
              Редагувати профіль
            </EditLink>
          )}
        </SubTitle>
      )
    }
  />
);

const EditIcon = styled(PencilIcon)`
  margin-right: 5px;
  vertical-align: middle;
`;

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

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: bold;
`;

const EditLink = styled.span`
  margin-left: auto;
  font-size: 10px;
  color: #4880ed;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
`;

export default DefinitionList;
