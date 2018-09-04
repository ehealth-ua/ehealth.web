import { keyframes } from "react-emotion";

const toTopBounce = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const toCenterBounce = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

export const placements = {
  top: {
    top: 0,
    left: "50%",
    transform: "translate(-50%, 0)",
    animation: `${toTopBounce} .5s ease forwards`
  },
  center: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: `${toCenterBounce} .5s ease forwards`
  }
};
const colors = {
  red: "#ff0001"
};

export default {
  placements,
  colors
};
