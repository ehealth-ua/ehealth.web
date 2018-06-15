import React from "react";
import styled from "react-emotion/macro";
import { Slider, Slide } from "react-projector";
import { ifProp } from "styled-tools";
import { ResponsiveSlide } from "react-projector-responsive";

export default class Tabs extends React.Component {
  state = {
    activeTab: 0
  };

  render() {
    const { theme, children } = this.props;
    const { activeTab } = this.state;

    return (
      <>
        <TabControl
          activeTab={activeTab}
          onChange={this.changeTab}
          tabs={children.map(({ title }) => title)}
        />
        <Slider activeSlide={activeTab} onSlideChange={this.changeTab}>
          {children.map(({ content }, index) => (
            <Slide key={index} component={ResponsiveSlide}>
              <Content>{content}</Content>
            </Slide>
          ))}
        </Slider>
      </>
    );
  }

  changeTab = index => this.setState({ activeTab: index });
}

const TabControl = ({ tabs, activeTab, onChange = () => {} }) => (
  <TabHeader>
    <TabNav>
      {tabs.map((title, index) => (
        <TabItem
          key={index}
          active={activeTab === index}
          onClick={() => onChange(index)}
        >
          {title}
        </TabItem>
      ))}
    </TabNav>
  </TabHeader>
);

const TabHeader = styled.div`
  position: relative;

  @media screen and (min-width: 768px) {
    margin: 0 60px;
  }
`;

const TabNav = styled.ul`
  background: repeating-linear-gradient(
    transparent,
    transparent 54px,
    #dad9d8 54px,
    #dad9d8 55px
  );
  height: 55px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  list-style: none;

  @media screen and (min-width: 768px) {
    justify-content: space-around;
  }
`;

const TabItem = styled.li`
  cursor: pointer;
  margin: 0 5px 1px;
  padding: 16px 0;
  white-space: nowrap;
  font-weight: ${ifProp("active", "700")};
  font-size: 16px;
  box-shadow: ${ifProp("active", "inset 0 -5px 0 #4880ed")};

  @media screen and (min-width: 768px) {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const Content = styled.div`
  margin-top: 25px;
  padding: 10px 15px;
`;
