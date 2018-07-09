import React from "react";
import styled from "react-emotion/macro";
import { Heading, Button } from "@ehealth/components";

const ServerError = () => (
  <Layout>
    <Number>500</Number>
    <Heading.H1>Упс... сталася помилка. Спробуйте пізніше</Heading.H1>
  </Layout>
);

const NotFound = () => (
  <Layout>
    <Number>404</Number>
    <Heading.H1>Сторінка, яку ви шукаєте відсутня</Heading.H1>
  </Layout>
);
const ClientError = msg => (
  <Layout>
    <Heading.H1>Сталася помилка. Спробуйте пізніше</Heading.H1>
  </Layout>
);

const Error = {};
Error.ServerError = ServerError;
Error.NotFound = NotFound;
Error.ClientError = ClientError;

export default Error;

const Layout = styled.div`
  text-align: center;
  max-width: 420px;
  margin: 40% auto;
  height: 100vh;
`;

const Number = styled.h4`
  font-size: 80px;
  color: #70cffc;
  margin-bottom: 0;
`;
