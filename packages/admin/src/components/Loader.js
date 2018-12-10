import React from "react";
import { Flex, Box } from "rebass/emotion";
import { LoaderIcon } from "@ehealth/icons";
import system from "system-components/emotion";

const Loader = ({ ...props }) => (
  <Wrapper justifyContent="center" alignItems="center">
    <LoaderIcon {...props} />
  </Wrapper>
);

const Wrapper = system(
  {
    is: Flex
  },
  {
    position: "absolute",
    width: "calc(100% - 200px)",
    left: "200px",
    top: "0",
    height: "100vh"
  }
);

export default Loader;
