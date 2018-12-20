import React from "react";
import system from "system-components/emotion";
import { Box, Flex } from "rebass/emotion";
import { Switch, Modal } from "@ehealth/components";
import { EhealthLogoIcon, CloseIcon } from "@ehealth/icons";

import Button from "./Button";

const Error = ({ error, blocking, onClose }) => {
  const code = getErrorCode(error);

  return (
    <Modal width={760} px={76} py={32} placement="center" backdrop>
      {blocking || (
        <CloseButton onClick={onClose}>
          <CloseIcon width={15} height={15} />
        </CloseButton>
      )}
      <Wrapper>
        <EhealthLogoIcon height="80" />
        <ErrorTitle weight="bold">
          <Switch
            value={code}
            CONFLICT="Сталася помилка. Спробуйте пізніше"
            FORBIDDEN="У вас немає доступу до даної операції"
            NETWORK_ERROR="Сталася мережева помилка. Спробуйте пізніше"
            default="Щось пішло не так"
          />
        </ErrorTitle>
        <ErrorDetails>
          {/* TODO: Remove this block as soon as we will stabilize errors format */}
          <Box mr={3}>{error.message}</Box>
          <Box>
            {error.errors &&
              error.errors.map(e => {
                const [description] = Object.values(e).map(i => i.description);
                return <Description>{description}</Description>;
              })}
          </Box>
        </ErrorDetails>
        {[
          "FORBIDDEN",
          "NETWORK_ERROR",
          "INTERNAL_SERVER_ERROR",
          "UNKNOWN_ERROR"
        ].includes(code) && (
          <Button is="a" href="/" variant="blue" mt={3}>
            Повернутись на головну
          </Button>
        )}
      </Wrapper>
    </Modal>
  );
};

export default Error;

const getErrorCode = error => {
  switch (error.name) {
    case "GraphQLError":
      return error.extensions && error.extensions.code;
    case "NetworkError":
      return "NETWORK_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
};

const Wrapper = system({
  is: Flex,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
});

const ErrorTitle = system({
  is: "h2",
  mt: 50,
  mb: 40,
  fontWeight: 200
});

const ErrorDetails = system({
  is: Flex,
  justifyContent: "center",
  border: "1px solid #ddd",
  p: 2,
  m: 2,
  background: "#f9f9f9",
  fontFamily: "monospace"
});

const Description = system(
  {
    is: Box,
    mb: 2
  },
  `
    &:last-child {
      margin-bottom: 0;
    }
  `
);

const CloseButton = system({
  position: "absolute",
  top: 30,
  right: 30,
  width: 15,
  height: 15
});
