import React, { Component } from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import { Signer } from "@ehealth/react-iit-digital-signature";

import env from "../../../env";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";
import DigitalStampForm from "../../forms/DigitalStampForm";

class StampPage extends Component {
  state = { sign: null };
  render() {
    const { sign } = this.state;
    return (
      <Main>
        <Header>
          <Steps items={steps} active={sign ? "sign" : "stamp"} />
          <H1>
            {!sign
              ? "Електронний цифровий підпис"
              : "Електронна цифрова печатка"}
          </H1>
        </Header>
        <Article>
          <NarrowContainer>
            <Signer.Child
              allowedOrigins={env.REACT_APP_ALLOWED_SIGN_ORIGINS.split(",")}
            >
              {({ data, onSignSuccess, onSignError }) => {
                if (!data) return null;
                return !sign ? (
                  <DigitalSignatureForm
                    onSubmit={ds => {
                      try {
                        this.submitFormSuccess(
                          ds,
                          data,
                          false,
                          (signedContent, meta) =>
                            this.setState({ sign: signedContent })
                        );
                      } catch (error) {
                        onSignError(error);
                      }
                    }}
                  />
                ) : (
                  <DigitalStampForm
                    onSubmit={ds => {
                      try {
                        this.submitFormSuccess(
                          ds,
                          sign,
                          true,
                          (signedContent, meta) =>
                            onSignSuccess({ signedContent, meta })
                        );
                      } catch (error) {
                        onSignError(error);
                      }
                    }}
                  />
                );
              }}
            </Signer.Child>
          </NarrowContainer>
        </Article>
      </Main>
    );
  }

  submitFormSuccess = (ds, data, status = true, success = () => {}) => {
    const content = !status ? JSON.stringify(data) : data;

    const signedContent = env.REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? ds.SignDataInternal(true, content, status)
      : btoa(unescape(encodeURIComponent(content)));

    let meta;

    if (!env.REACT_APP_DIGITAL_SIGNATURE_ENABLED) {
      meta = {
        drfo: ds.privKeyOwnerInfo.subjDRFOCode,
        given_name: encodeURIComponent(ds.privKeySubject.GivenName),
        surname: encodeURIComponent(ds.privKeySubject.SN)
      };
    }

    success(signedContent, meta);
  };
}

const steps = [
  {
    value: "Додайте електронний підпис",
    key: "sign"
  },
  {
    value: "Підтвердіть електронною печаткою",
    key: "stamp"
  }
];

const Steps = ({ items = [], active }) => {
  return (
    <Flex>
      {items.map(({ value, key }) => (
        <OpacityBox opacity={active === key}>
          <Icon />
          {value}
        </OpacityBox>
      ))}
    </Flex>
  );
};

const OpacityBox = styled.div`
  display: flex;
  align-items: center;
  opacity: ${ifProp("opacity", ".5", "1")};
  font-size: 14px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const Icon = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4a90e2;
  margin-right: 7px;
`;

export default StampPage;
