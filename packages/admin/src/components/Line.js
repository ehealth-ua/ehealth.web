import system from "@ehealth/system-components";
import { mixed } from "@ehealth/system-tools";

const Line = system(
  {
    is: "figure",
    bg: "januaryDawn",
    my: 5,
    mx: 0
  },
  {
    height: "1px",
    width: "100%"
  },
  "space",
  "color"
);

export default Line;
