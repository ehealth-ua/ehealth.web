import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

const Header = styled.div`
  display: flex;
  justify-content: ${ifProp("center", "center", "space-between")};
  padding: 15px;
  border-bottom: 1px solid #dfe3e9;
`;

export default Header;
