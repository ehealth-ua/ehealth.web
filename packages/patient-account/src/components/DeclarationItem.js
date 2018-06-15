import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { Title, Link } from "@ehealth/components";
import { CircleIcon } from "@ehealth/icons";
import DECLARATION_STATUSES from "../helpers/statuses";
import { DeclarationHeader } from "../components/Declaration";

const DeclarationItem = ({
  declaration: { status, start_date, id, declaration_number },
  blur,
  onReject,
  type
}) => (
  <>
    <DeclarationHeader
      id={id}
      declaration_number={declaration_number}
      signed_at={start_date}
      blur={blur}
      type={type}
      wrap
    />
    <Footer>
      <Title.H3>
        {onReject ? "Статус декларації: " : "Статус запиту: "}
        <b>{DECLARATION_STATUSES[status]}</b>{" "}
        <CircleIcon fill={status === "active" && "#c9f032"} />
      </Title.H3>

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
