import React from "react";
import { Link, Match } from "@reach/router";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { css } from "react-emotion";

import { SmallChevronLeftIcon, SmallChevronRightIcon } from "@ehealth/icons";

/**
 * @example
 *
 * ```jsx
 * import Tabs from "../../components/Tabs";

 * <Tabs.Nav>
 *   <Tabs.NavItem to="./">Особиста інформація</Tabs.NavItem>
 *   <Tabs.NavItem to="auth">Метод аутентифікації</Tabs.NavItem>
 *   <Tabs.NavItem to="declarations">Декларації</Tabs.NavItem>
 * </Tabs.Nav>
 * <Tabs.Content>
 *   <Router>
 *     <UserInfo path="./" />
 *     <AuthInfo path="auth" />
 *     <DeclarationsInfo path="declarations" />
 *   </Router>
 * </Tabs.Content>
*/

const PADDING_X = 45;

const NavItem = ({ to, ...props }) => (
  <Match path={to}>
    {({ match }) => (
      <TabItem active={match}>
        <NavLink to={to} {...props} />
      </TabItem>
    )}
  </Match>
);

class Nav extends React.Component {
  state = {
    withControls: false,
    leftActive: false,
    rightActive: true
  };

  wrapper = React.createRef();
  container = React.createRef();

  componentDidMount() {
    this.container.current.scrollWidth > this.wrapper.current.scrollWidth &&
      this.setState({
        withControls: true
      });
  }

  handleArrowClick(step = 0) {
    this.container.current.scrollLeft += step;

    this.setState({
      leftActive: !!this.container.current.scrollLeft,
      rightActive:
        this.container.current.scrollWidth -
          this.container.current.scrollLeft +
          PADDING_X * 2 !==
        this.wrapper.current.scrollWidth
    });
  }

  render() {
    const { withControls, leftActive, rightActive } = this.state;
    return (
      <Wrapper innerRef={this.wrapper}>
        {withControls && (
          <Arrow
            onClick={() => this.handleArrowClick(-50)}
            disabled={!leftActive}
          >
            <SmallChevronLeftIcon />
          </Arrow>
        )}
        <Container innerRef={this.container}>{this.props.children}</Container>
        {withControls && (
          <Arrow
            right
            onClick={() => this.handleArrowClick(50)}
            disabled={!rightActive}
          >
            <SmallChevronRightIcon />
          </Arrow>
        )}
      </Wrapper>
    );
  }
}

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 12px;
  padding: 0;
  ${ifProp(
    "right",
    css`
      right: 15px;
    `,
    css`
      left: 15px;
    `
  )};
  color: ${ifProp("disabled", "#ced0da", "#2ea2f8")};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  background-color: #fafbfc;
  border: 1px solid #dfe2e5;
  padding: 5px ${PADDING_X}px 0;
`;

const Container = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  margin-bottom: -1px;
  font-size: 14px;
  overflow: hidden;
`;

const TabItem = styled.li`
  margin-bottom: -1px;
  background-color: ${ifProp("active", "#fff")};
  border: 1px solid ${ifProp("active", "#dfe2e5", "transparent")};
  border-bottom: 0;
  white-space: nowrap;
  cursor: pointer;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 16px 22px;
  color: #354052;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 10px;
  border-width: 0 1px 0 1px;
  border-color: #dfe2e5;
  border-style: solid;
  &:last-child {
    border-width: 0 1px 1px 1px;
  }
`;

const Tabs = { Nav, NavItem, Content };

export default Tabs;
