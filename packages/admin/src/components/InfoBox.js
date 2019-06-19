import { Box } from "@rebass/emotion";
import system from "@ehealth/system-components";

const InfoBox = system(
  {
    extend: Box,
    variant: "default",
    fontSize: 0,
    border: 1,
    borderColor: "januaryDawn"
  },
  {
    position: "relative",
    lineHeight: 1.5
  },
  ({ variant }) => boxes[variant],
  "space",
  "fontSize",
  "border",
  "borderColor"
);

const boxes = {
  default: {
    margin: "25px 0",
    padding: "20px",
    "&::before": {
      content: '""',
      position: "absolute",
      display: "block",
      top: "-10px",
      left: "30px",
      width: "20px",
      height: "20px",
      border: "1px solid #dfe2e5",
      transform: "rotate(45deg)",
      clipPath: "polygon(100% 0,0 100%,0 0)",
      backgroundColor: "#fff"
    }
  },
  horizontal: {
    margin: "0 20px",
    padding: "8px 10px",
    "&::before": {
      content: '""',
      position: "absolute",
      display: "block",
      top: "10px",
      left: "-6px",
      width: "12px",
      height: "12px",
      border: "1px solid #dfe2e5",
      transform: "rotate(-45deg)",
      clipPath: "polygon(100% 0,0 100%,0 0)",
      backgroundColor: "#fff"
    }
  }
};

export default InfoBox;
