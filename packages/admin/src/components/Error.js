import React from "react";
import system from "@ehealth/system-components";
import { Box, Flex } from "@rebass/emotion";
import { Switch, Modal } from "@ehealth/components";
import { EhealthLogoIcon, CloseIcon } from "@ehealth/icons";
import * as Sentry from "@sentry/browser";

import Button from "./Button";

const Error = ({ error, blocking, onClose }) => {
  const code = getErrorCode(error);
  if (code === "UNPROCESSABLE_ENTITY") return null;

  const {
    extensions: { exception },
    message
  } = error;

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
        {!["NETWORK_ERROR", "INTERNAL_SERVER_ERROR", "UNKNOWN_ERROR"].includes(
          code
        ) && (
          <ErrorDetails>
            {code === "CONFLICT" && <Description>{message}</Description>}
            {code === "FORBIDDEN" && (
              <Description>
                {exception ? (
                  <>
                    Відсутній дозвіл на наступні дії:
                    <ul>
                      {exception.missingAllowances.map(scope => (
                        <li key={scope}>{scope}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  message
                )}
              </Description>
            )}
          </ErrorDetails>
        )}
        <Flex justifyContent="center" mt={3}>
          {["NETWORK_ERROR", "INTERNAL_SERVER_ERROR", "UNKNOWN_ERROR"].includes(
            code
          ) && (
            <Button
              variant="blue"
              mx={2}
              onClick={() => Sentry.showReportDialog()}
            >
              Описати проблему
            </Button>
          )}
          {[
            "FORBIDDEN",
            "NETWORK_ERROR",
            "INTERNAL_SERVER_ERROR",
            "UNKNOWN_ERROR"
          ].includes(code) && (
            <Button is="a" href="/" mx={2}>
              Повернутись на головну
            </Button>
          )}
        </Flex>
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

const Wrapper = system(
  {
    extend: Flex
  },
  {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
);

const ErrorTitle = system(
  {
    is: "h2",
    mt: 50,
    mb: 40,
    fontWeight: 200
  },
  "space",
  "fontWeight"
);

const ErrorDetails = system(
  {
    extend: Flex,
    p: 2,
    m: 2
  },
  {
    background: "#f9f9f9",
    fontFamily: "monospace",
    justifyContent: "center",
    border: "1px solid #ddd"
  },
  "space"
);

const Description = system(
  {
    extend: Box,
    mb: 2
  },
  `
    &:last-child {
      margin-bottom: 0;
    }
  `,
  "space"
);

const CloseButton = system(
  {},
  {
    position: "absolute",
    top: 30,
    right: 30,
    width: 15,
    height: 15
  }
);
