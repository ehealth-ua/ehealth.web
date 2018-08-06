import React from "react";
import { Signer } from "@ehealth/react-iit-digital-signature";

import {
  REACT_APP_ALLOWED_SIGN_ORIGINS,
  REACT_APP_DIGITAL_SIGNATURE_ENABLED
} from "../../../env";

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
          {({ data, onSignSuccess, onSignError }) =>
            data && (
              <DigitalSignatureForm
                onSubmit={ds => {
                  try {
                    const content = JSON.stringify(data);

                    const signedContent = REACT_APP_DIGITAL_SIGNATURE_ENABLED
                      ? ds.SignDataInternal(true, content, true)
                      : btoa(unescape(encodeURIComponent(content)));

                    let meta;

                    if (!REACT_APP_DIGITAL_SIGNATURE_ENABLED) {
                      meta = {
                        drfo: ds.privKeyOwnerInfo.subjDRFOCode,
                        given_name: encodeURIComponent(
                          ds.privKeySubject.GivenName
                        ),
                        surname: encodeURIComponent(ds.privKeySubject.SN)
                      };
                    }

                    onSignSuccess({ signedContent, meta });
                  } catch (error) {
                    onSignError(error);
                  }
                }}
              />
            )
          }
        </Signer.Child>
      </NarrowContainer>
    </Article>
  </Main>
);

export default SignPage;
