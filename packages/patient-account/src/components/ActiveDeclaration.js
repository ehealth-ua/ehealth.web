import React from "react";
import { Title, Link, Switch } from "@ehealth/components";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { ArrowRight, CircleIcon, MozLogoIcon } from "@ehealth/icons";
import DECLARATION_STATUSES from "../helpers/statuses";

const ActiveDeclaration = ({ active, blur = false }) => {
  const { status, start_date } = active;
  return (
    <Wrapper blur={blur}>
      <Preview>
        <MozLogoIcon height="100px" />
        <div>
          <Heading>Декларація</Heading>
          <Description>
            про вибір лікаря з надання первинної допомоги
            <br />
            № {active.declaration_number} від {start_date}
          </Description>
        </div>
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

const Heading = styled.h1`
  font-size: 32px;
  color: #292b37;
  text-transform: uppercase;
  text-align: left;
  font-weight: bold;
  margin: 0;
`;

const Description = styled.h4`
  font-size: 16px;
  color: #292b37;
  text-transform: inherit;
  text-align: left;
  font-weight: bold;
  margin: 0;
`;

const Preview = styled.div`
  display: flex;
  text-align: center;
  box-shadow: 0 0 9px rgba(72, 128, 273, 0.75);
  margin: 9px 9px 40px;
  padding: 40px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
