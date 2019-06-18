import { Box } from "@rebass/emotion";
import system from "@ehealth/system-components";

const InfoBox = system(
  {
    extend: Box,
    p: 4,
    my: 5,
    fontSize: 0,
    border: 1,
    borderColor: "januaryDawn"
  },
  {
    position: "relative",
    lineHeight: 1.5,
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
  "space",
  "fontSize",
  "border",
  "borderColor"
);

export default InfoBox;
