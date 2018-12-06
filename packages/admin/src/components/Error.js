import React from "react";
import system from "system-components/emotion";
import { Box, Flex } from "rebass/emotion";
import { Modal } from "@ehealth/components";
import { EhealthLogoIcon } from "@ehealth/icons";
import Button from "./Button";
import Link from "./Link";

const ErrorDefault = ({ number, text, error }) => (
  <Modal width={760} px={76} py={32} placement="center" backdrop>
    <Wrapper>
      <EhealthLogoIcon height="80" />
      <ErrorTitle weight="bold">Помилка</ErrorTitle>
      {number && <Number>{number}</Number>}
      {text && <ErrorText weight="bold">{text}</ErrorText>}
      {error && (
        <ErrorDetails>
          <Box mr={3}>
            {error.message}
            {error.errorDetails && ":"}
          </Box>
          <Box>
            {error.errorDetails &&
              error.errorDetails.map(e => (
                <Description>{e.description}</Description>
              ))}
          </Box>
        </ErrorDetails>
      )}
      {number === "404" || number === "500" ? (
        <>
          <br />
          <Link is="a" href="/">
            <Button variant="blue">Повернутись на головну</Button>
          </Link>
        </>
      ) : null}
    </Wrapper>
  </Modal>
);

const Error = {};
Error.ServerError = ({ error }) => (
  <ErrorDefault text="Повторіть спробу пізніше" error={error} number="500" />
);
Error.NotFound = ({ error }) => (
  <ErrorDefault
    text="Сторінка, яку ви шукаєте відсутня"
    error={error}
    number="404"
  />
);
Error.ClientError = ({ error }) => (
  <ErrorDefault text="Сталася помилка. Спробуйте пізніше" error={error} />
);
Error.ConflictError = ({ error }) => (
  <ErrorDefault
    text="Сталася помилка. Спробуйте пізніше"
    error={error}
    number="409"
  />
);
Error.Forbidden = ({ error }) => (
  <ErrorDefault
    text="У вас немає доступу до даної операції"
    error={error}
    number="403"
  />
);
Error.UnprocessableEntity = ({ error }) => (
  <ErrorDefault error={error} number="422" />
);
Error.Default = ({ error }) => (
  <ErrorDefault text="Щось пішло не так" error={error} />
);

export default Error;

const Wrapper = system({
  is: Flex,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
});

const Number = system({
  is: "h1",
  mt: 0,
  mb: 50,
  fontSize: "85px",
  lineHeight: "85px",
  fontWeight: 200
});

const ErrorTitle = system({
  is: "h2",
  mt: 50,
  mb: 40,
  fontWeight: 200
});

const ErrorText = system({
  is: "h2",
  mb: 50,
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
