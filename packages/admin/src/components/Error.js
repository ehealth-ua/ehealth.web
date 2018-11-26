import React from "react";
import styled from "react-emotion/macro";

import { Heading } from "@ehealth/components";
import { EhealthLogoIcon } from "@ehealth/icons";

import Button from "./Button";
import Link from "./Link";

const ErrorDefault = ({ number, text, error }) => (
  <Layout>
    <Wrapper>
      <EhealthLogoIcon height="100" />
      <ErrorTitle weight="bold">Помилка</ErrorTitle>
      {number && <Number>{number}</Number>}
      <ErrorText weight="bold">{text}</ErrorText>
      {error &&
        error.message && (
          <ErrorDetails>
            <ErrorDetailsTitle>Деталі помилки</ErrorDetailsTitle>
            <ErrorMsg>{error.message}</ErrorMsg>
          </ErrorDetails>
        )}

      <Link is="a" href="/">
        <Button variant="blue">Повернутись на головну</Button>
      </Link>
    </Wrapper>
  </Layout>
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

export default Error;

const Layout = styled.div`
  background-color: #fff;
  position: fixed;
  z-index: 999;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
`;

const Number = styled(Heading.H1)`
  font-size: 85px;
  font-weight: 200;
  margin: 0 0 50px;
  line-height: 85px;
`;

const ErrorTitle = styled(Heading.H2)`
  margin: 50px 0 40px;
`;

const ErrorText = styled(Heading.H2)`
  margin-bottom: 50px;
`;

const ErrorMsg = styled.p`
  padding: 20px;
  white-space: pre-wrap;
`;

const ErrorDetails = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 3px;
  border: 1px solid lightgrey;
`;

const ErrorDetailsTitle = styled.p`
  color: #2ea2f8;
`;
