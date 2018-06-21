import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { Heading, Link } from "@ehealth/components";
import { CircleIcon } from "@ehealth/icons";
import DECLARATION_STATUSES from "../helpers/statuses";
import { DeclarationHeader } from "../components/Declaration";

const DeclarationItem = ({
  declaration: { id, status, startDate, declarationNumber },
  blur,
  onReject,
  type
}) => (
  <>
    <DeclarationHeader
      id={id}
      declarationNumber={declarationNumber}
      signedAt={startDate}
      blur={blur}
      type={type}
      wrap
    />
    <Footer>
      <Heading.H3>
        {onReject ? "Статус декларації: " : "Статус запиту: "}
        <b>{DECLARATION_STATUSES[status]}</b>{" "}
        <CircleIcon fill={status === "active" && "#c9f032"} />
      </Heading.H3>

      {onReject && (
        <Link
          onClick={() => console.log("onreject")}
          color="red"
          bold
          upperCase
        >
          Розірвати декларацію
        </Link>
      )}
    </Footer>
  </>
);

export default DeclarationItem;

const Footer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-top: 25px;
`;
