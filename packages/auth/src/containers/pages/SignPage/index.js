import React, { Component } from "react";
import { Signer } from "@ehealth/react-iit-digital-signature";

import { REACT_APP_ALLOWED_SIGN_ORIGINS } from "../../../env";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";

const SignPage = () => (
  <Main>
    <Header>
      <H1>Електронний цифровий підпис</H1>
    </Header>
    <Article>
      <NarrowContainer>
        <Signer.Child
          allowedOrigins={REACT_APP_ALLOWED_SIGN_ORIGINS.split(",")}
        >
          {({ signData }) => <DigitalSignatureForm onSubmit={signData} />}
        </Signer.Child>
      </NarrowContainer>
    </Article>
  </Main>
);

export default SignPage;
