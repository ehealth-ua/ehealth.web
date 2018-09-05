import React from "react";
import styled from "react-emotion/macro";
import { Heading, Link } from "@ehealth/components";
import { EhealthLogoIcon } from "@ehealth/icons";

import Button from "./Button";

const ErrorDefault = ({ number, text }) => (
  <Layout>
    <Link href="/">
      <EhealthLogoIcon height="100" />
    </Link>
    <ErrorTitle weight="bold">Помилка</ErrorTitle>
    {number && <Number>{number}</Number>}
    <ErrorText weight="bold">{text}</ErrorText>
    <Link href="/">
      <Button variant="blue">Повернутись на головну</Button>
    </Link>
  </Layout>
);

const Error = {};
Error.ServerError = () => (
  <ErrorDefault text="Повторіть спробу пізніше" number="500" />
);
Error.NotFound = () => (
  <ErrorDefault text="Сторінка, яку ви шукаєте відсутня" number="404" />
);
Error.ClientError = () => (
  <ErrorDefault text="Сталася помилка. Спробуйте пізніше" />
);
Error.ConflictError = () => (
  <ErrorDefault text="Сталася помилка. Спробуйте пізніше" number="409" />
);

export default Error;

const Layout = styled.div`
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
