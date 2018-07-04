import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, switchProp, withProp } from "styled-tools";

const DEFAULT_FONT_SIZES = [22, 18, 16, 14, 14, 12];

const H1 = props => (
  <Heading justifyContent="center" upperCase {...props} level={1} />
);

const H2 = props => <Heading weight="light" upperCase {...props} level={2} />;

const H3 = props => <Heading weight="regular" {...props} level={3} />;

const H4 = props => <Heading weight="regular" {...props} level={4} />;

const H5 = props => <Heading weight="regular" {...props} level={5} />;

const H6 = props => <Heading {...props} level={6} />;

const Heading = ({ level = 1, ...props }) => {
  const Component = BasicHeading.withComponent(`h${level}`);
  return <Component level={level} {...props} />;
};

const BasicHeading = styled.div`
  text-align: center;
  color: #454545;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: ${withProp(
    [prop("theme.heading.sizes", DEFAULT_FONT_SIZES), "level"],
    (sizes, level) => `${sizes[level - 1]}px`
  )};
  font-weight: ${switchProp(prop("weight", "bold"), {
    light: 300,
    regular: 400,
    bold: 700
  })};
  text-transform: ${ifProp("upperCase", "uppercase")};
`;

Heading.H1 = H1;
Heading.H2 = H2;
Heading.H3 = H3;
Heading.H4 = H4;
Heading.H5 = H5;
Heading.H6 = H6;

export default Heading;
