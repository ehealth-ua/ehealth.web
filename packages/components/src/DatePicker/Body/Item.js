import styled from "react-emotion/macro";
import { prop, ifProp, ifNotProp } from "styled-tools";

const Item = styled.button`
  display: inline-block;
  width: calc((100% / ${prop("col")}) - 4px);
  border: none;
  margin: 2px;
  user-select: none;
  height: ${ifNotProp("weekday", "30px")};
  border-radius: 50%;
  color: ${ifProp(
    "selected",
    "#fff",
    ifProp("currentMonth", "#9aa0a9"),
    ifProp("today", "#2292f2"),
    ifProp("weekday", "#9aa0a9")
  )};
  font-size: ${ifProp("weekday", "10px")};
  background: ${ifProp("selected", "#1A91EB")};
  cursor: pointer;
  &:focus {
    outline: 0;
  }
  &:hover {
    color: ${ifProp("selected", "#fff", "#2292f2")};
  }
  &[disabled] {
    background: #eaeaea;
    color: #333;
    cursor: not-allowed;
  }
`;

export default Item;
