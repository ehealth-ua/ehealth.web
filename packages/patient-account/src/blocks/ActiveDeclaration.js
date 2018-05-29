import React from "react";
import { Title, Link, Switch } from "@ehealth/components";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { ArrowRight, CircleIcon } from "@ehealth/icons";
import DECLARATION_STATUSES from "../helpers/statuses";

const ActiveDeclaration = ({ active, blur = false }) => {
  const { status } = active;
  return (
    <Wrapper blur={blur}>
      <Preview>
        <Title.H1>Декларація № {active.declaration_number}</Title.H1>
        <Title.H1>
          Про вибір лікаря, який надає первинну медичну допомогу
        </Title.H1>
      </Preview>
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

const Preview = styled.div`
  display: block;
  text-align: center;
  box-shadow: 0 0 9px rgba(72, 128, 273, 0.75);
  margin: 9px 9px 40px;
  padding: 40px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
