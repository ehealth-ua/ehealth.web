import React, { Component } from "react";
import { css } from "emotion";
import styled from "react-emotion/macro";
import { Link } from "@ehealth/components";

export default class UserNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
  }

  handleTooltip(hidden) {
    this.setState({
      hidden
    });
  }

  render() {
    const { hidden } = this.state;
    return (
      <UserNavWrapper
        onMouseEnter={ev => this.handleTooltip(false)}
        onMouseLeave={ev => this.handleTooltip(true)}
      >
        <User>Григорій Квітка-Основяненко</User>
        <Tooltip isHidden={hidden}>
          <TooltipInner>
            <NavLink to="/profile" color="black">
              Мій профіль
            </NavLink>
            <NavLink to="/security" color="black">
              Безпека
            </NavLink>
            <NavLink to="/loguot" bold>
              Вийти
            </NavLink>
          </TooltipInner>
        </Tooltip>
      </UserNavWrapper>
    );
  }
}

const UserNavWrapper = styled.div`
  position: relative;
`;

const User = styled.div`
  position: relative;
  padding-right: 15px;
  color: #4880ed;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;

  &::after {
    position: absolute;
    top: 4px;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    border-color: #4880ed transparent transparent transparent;
    content: "";
  }
`;

const tooltipHidden = props =>
  props.isHidden
    ? css`
        visibility: hidden;
        opacity: 0;
      `
    : css`
        visibility: visible;
        opacity: 0.9;
      `;

const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  ${tooltipHidden};
  &::after {
    position: absolute;
    top: -5px;
    right: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #fff transparent;
    content: "";
  }
`;

const TooltipInner = styled.div`
  padding: 10px 30px 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const NavLink = styled(Link)`
  margin-top: 20px;
`;
