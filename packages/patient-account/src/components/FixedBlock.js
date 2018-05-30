import React from "react";
import styled from "react-emotion/macro";

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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
