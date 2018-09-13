import styled from "react-emotion/macro";

export const Container = styled.div`
  width: 245px;
  position: relative;
`;

export const SelectedItem = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  background-color: #f1f4f8;
  border: 1px solid #d5dce6;
  color: #333c48;
  border-radius: 3px;
  height: 30px;
  padding: 0 12px;
  margin: 2px 0 0 2px;
  box-sizing: border-box;
`;

export const CloseButton = styled.button`
  position: relative;

  &:before,
  &:after {
    content: " ";
    position: absolute;
    top: 50%;
    width: 8px;
    height: 2px;
    background-color: #c7d2e0;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;
