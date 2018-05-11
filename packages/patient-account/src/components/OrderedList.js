import React from "react";
import styled from "react-emotion/macro";

const OrderedList = ({ children }) => (
  <Wrapper>{children.map((i, key) => <Item key={key}>{i}</Item>)}</Wrapper>
);
export default OrderedList;

const Wrapper = styled.ul`
  display: flex;
  flex-flow: column wrap;
  align-content: space-between;
  justify-content: flex-start;
  counter-reset: a;
  list-style: none;
  padding-left: 0;
`;

const Item = styled.li`
  position: relative;
  line-height: 70px;
  margin-bottom: 20px;
  padding-left: 70px;
  counter-increment: a;

  &::before {
    content: counter(a);
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    text-align: center;
    color: #4880ed;
    font-size: 70px;
    line-height: 70px;
    font-weight: 300;
  }
`;
