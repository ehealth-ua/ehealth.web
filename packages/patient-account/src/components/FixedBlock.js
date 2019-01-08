import React from "react";
import styled from "@emotion/styled";

const FixedBlock = ({ children }) => (
  <Wrapper>
    <Inner>{children}</Inner>
  </Wrapper>
);
export default FixedBlock;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: #fff;
  box-shadow: 0 0 18px rgba(174, 174, 174, 0.75);
  border: 1px solid rgba(72, 128, 237, 0.15);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-height: 58px;
`;
