import React from "react";
import styled from "@emotion/styled";
import { Heading, Button, Link } from "@ehealth/components";
import { EhealthLogoIcon } from "@ehealth/icons";

const ErrorDefault = ({ number, text }) => (
  <Layout>
    <Link href="/">
      <EhealthLogoIcon height="45" />
    </Link>
    <ErrorTitle weight="bold">Помилка</ErrorTitle>
    {number && <Number>{number}</Number>}
    <ErrorText weight="bold">{text}</ErrorText>
    <Link href="/">
      <Button>Повернутись на головну</Button>
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
  text-align: center;
  max-width: 420px;
  padding-top: 50px;
  margin: 0 auto;
`;

const Number = styled(Heading.H1)`
  font-size: 85px;
  font-weight: 200;
  margin: 0 0 50px;
  line-height: 85px;
`;

const ErrorTitle = styled(Heading.H2)`
  margin: 70px 0 40px;
`;

const ErrorText = styled(Heading.H2)`
  margin-bottom: 50px;
`;
