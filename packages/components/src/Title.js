import React from "react";
import styled from "react-emotion/macro";

const Heading = styled.h1`
  color: #000;
  margin-bottom: 10px;
`;
const LightHeading = styled(Heading)`
  font-weight: 300;
  text-transform: uppercase;
`;
const RegularHeading = styled(Heading)`
  font-weight: 400;
`;
const BoldHeading = styled(Heading)`
  font-weight: 700;
`;
export const H1 = styled(BoldHeading)`
  font-size: 22px;
  text-transform: uppercase;
  text-align: center;
`;
export const H2 = styled(LightHeading.withComponent("h2"))`
  font-size: 18px;
`;
export const H3 = styled(RegularHeading.withComponent("h3"))`
  font-size: 16px;
`;
export const H4 = styled(RegularHeading.withComponent("h4"))`
  font-size: 14px;
`;
export const H5 = styled(RegularHeading.withComponent("h5"))`
  color: #3d3d3d;
  font-size: 14px;
`;
export const H6 = styled(BoldHeading.withComponent("h6"))`
  font-size: 12px;
`;

const Title = () => {};
Title.H1 = H1;
Title.H2 = H2;
Title.H3 = H3;
Title.H4 = H4;
Title.H5 = H5;
Title.H6 = H6;

export default Title;
