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
    isLeftArrowActive: true,
    isRightArrowActive: true,
    containerLeftX: 0,
    containerRightX: 0
  };

  wrapper = React.createRef();
  container = React.createRef();

  async componentDidMount() {
    await this.setControlsObservers();

    this.setState({
      containerRightX: await this.container.current.scrollWidth
    });
  }

  render() {
    const { withControls, isLeftArrowActive, isRightArrowActive } = this.state;
    return (
      <Controls>
        {withControls && (
          <Arrow
            onClick={() => this.handleArrowClick(50)}
            disabled={!isLeftArrowActive}
          >
            <SmallChevronLeftIcon />
          </Arrow>
        )}
        <Wrapper innerRef={this.wrapper}>
          <Container
            style={{ left: `${this.state.containerLeftX}px` }}
            innerRef={this.container}
          >
            {this.props.children}
          </Container>
        </Wrapper>
        {withControls && (
          <Arrow
            right
            onClick={() => this.handleArrowClick(-50)}
            disabled={!isRightArrowActive}
          >
            <SmallChevronRightIcon />
          </Arrow>
        )}
      </Controls>
    );
  }

  createObserver(stateKey, childElement) {
    const observer = new IntersectionObserver(
      children => {
        this.setState({
          [stateKey]:
            children[0].intersectionRatio < 1 &&
            children[0].boundingClientRect.y > 0
        });
      },
      {
        threshold: 1
      }
    );

    observer.observe(childElement);
  }

  async setControlsObservers() {
    const { children } = await this.container.current;
    const lastNavItem = children.length - 1;

    this.createObserver("withControls", this.container.current);
    this.createObserver("isLeftArrowActive", children[0]);
    this.createObserver("isRightArrowActive", children[lastNavItem]);
  }

  handleArrowClick(step = 0) {
    const { clientWidth: wrapperWidth } = this.wrapper.current;
    const { containerLeftX, containerRightX } = this.state;

    let nextStep;
    if (step < 0) {
      nextStep =
        containerRightX + step < wrapperWidth
          ? wrapperWidth - containerRightX
          : step;
    } else {
      nextStep = containerLeftX + step > 0 ? -containerLeftX : step;
    }

    this.setState({
      containerLeftX: containerLeftX + nextStep,
      containerRightX: containerRightX + nextStep
    });
  }
}

const Controls = styled.div`
  position: relative;
  padding: 5px 45px 0;
  background-color: #fafbfc;
  border: 1px solid #dfe2e5;
`;

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
  display: flex;
  overflow: hidden;
  margin-bottom: -1px;
`;

const Container = styled.ul`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  font-size: 14px;
`;

const TabItem = styled.li`
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
