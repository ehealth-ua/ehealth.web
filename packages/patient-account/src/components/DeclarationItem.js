import React, { Component } from "react";
import styled from "react-emotion/macro";
import { CircleIcon } from "@ehealth/icons";
import { Title, Link } from "@ehealth/components";

import DECLARATION_STATUSES from "../helpers/statuses";
import { DeclarationHeader } from "../components/Declaration";
import DeclarationReject from "../components/DeclarationReject";

class DeclarationItem extends Component {
  state = {
    isRejectActive: false
  };

  handleReject() {
    this.setState({
      isRejectActive: false
    });
  }

  render() {
    const { isRejectActive } = this.state;
    const {
      declaration: { id, status, startDate, declarationNumber },
      blur,
      onReject,
      type
    } = this.props;

    return (
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
          <Title.H3>
            {onReject ? "Статус декларації: " : "Статус запиту: "}
            <b>{DECLARATION_STATUSES[status]}</b>{" "}
            <CircleIcon fill={status === "active" && "#c9f032"} />
          </Title.H3>

          {onReject && (
            <Link
              onClick={() => this.setState({ isRejectActive: true })}
              color="red"
              bold
              upperCase
            >
              Розірвати декларацію
            </Link>
          )}
        </Footer>

        {isRejectActive && (
          <DeclarationReject
            id={id}
            onReject={onReject}
            onClose={this.handleReject.bind(this)}
          />
        )}
      </>
    );
  }
}

export default DeclarationItem;

const Footer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-top: 25px;
`;
