import styled from "@emotion/styled";

const Container = styled.div`
  position: absolute;
  top: ${props => (props.placement === "bottom" ? "100%" : "auto")};
  right: ${props => (props.placement === "bottom" ? "0" : "auto")};
  bottom: ${props =>
    props.placement === "top" ? "calc(100% + 20px)" : "auto"};
  left: ${props => (props.placement === "top" ? "0" : "auto")};
  z-index: 1000;
  min-width: 300px;
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  color: #354052;
  background: #fff;
  box-shadow: 0 2px 4px rgba(72, 60, 60, 0.2);
`;

export default Container;
