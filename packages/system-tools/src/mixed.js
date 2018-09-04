import * as system from "styled-system";

const mixed = fnOrStyles => props => {
  const { theme } = props;

  const styles =
    typeof fnOrStyles === "function" ? fnOrStyles(props) : fnOrStyles;

  return system.mixed({ theme, ...styles });
};

export default mixed;
