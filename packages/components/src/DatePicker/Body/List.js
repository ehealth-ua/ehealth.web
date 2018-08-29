import styled from "react-emotion/macro";
import { prop, ifProp } from "styled-tools";

const List = styled.div`
  padding: ${ifProp("week", "20px 30px 0", "10px 30px 25px")};
  text-transform: ${prop("week", "uppercase")};
`;

export default List;
