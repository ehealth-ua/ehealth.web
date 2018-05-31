import React from "react";
import { Title, Link, Switch } from "@ehealth/components";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { ArrowRight, CircleIcon, MozLogoIcon } from "@ehealth/icons";
import DECLARATION_STATUSES from "../helpers/statuses";
import { DeclarationHeader } from "./DeclarationPreview";

const ActiveDeclaration = ({ active, blur = false }) => {
  const { status, start_date, id } = active;
  return (
    <Wrapper blur={blur}>
      <DeclarationHeader id={id} signed_at={start_date} wrap />
      <Flex>
        <Link to="/" color="red" bold upperCase>
          Розірвати декларацію
        </Link>
        <Title.H3>
          Статус декларації:
          <Switch
            value={status}
            pending_verification={
              <>
                <b> {DECLARATION_STATUSES[status]}</b> <CircleIcon />
              </>
            }
            active={
              <>
                <b> {DECLARATION_STATUSES[status]}</b>{" "}
                <CircleIcon fill="#c9f032" />
              </>
            }
          />
          <b />
        </Title.H3>
      </Flex>
    </Wrapper>
  );
};
export default ActiveDeclaration;

const Wrapper = styled.div`
  opacity: ${ifProp("blur", "0.5")};
  user-select: ${ifProp("blur", "none")};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
