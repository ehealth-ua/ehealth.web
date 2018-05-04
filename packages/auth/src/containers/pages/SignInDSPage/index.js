import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import {
  REACT_APP_DIGITAL_SIGNATURE_ENABLED,
  REACT_APP_CLIENT_ID
} from "../../../env";

import { Button } from "@ehealth/components";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";

import { getNonce, createSessionToken, authorize } from "../../../redux/auth";
import { login } from "../../../redux/session";

class SignInDSPage extends Component {
  render() {
    return (
      <Main>
        <Header>
          <H1>вхід до системи</H1>
        </Header>
        <Article>
          <NarrowContainer>
            <p>
              за допомогою <br /> Електронного Цифрового Підпису
            </p>
            <DigitalSignatureForm onSubmit={this.handleSubmit} />
          </NarrowContainer>
        </Article>
      </Main>
    );
  }
  handleSubmit = async ds => {
    const {
      getNonce,
      getCabinetToken,
      createSessionToken,
      login,
      authorize,
      location: { query }
    } = this.props;
    const { error, payload: { data: { token } } } = await getNonce(
      query.client_id
    );
    login(token);
    const content = JSON.stringify({ jwt: token });
    const signed_content = REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? ds.SignDataInternal(true, content, true)
      : btoa(content);
    const drfo = REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? undefined
      : ds.privKeyOwnerInfo.subjDRFOCode;

    const {
      payload: { value, details: { redirect_uri, client_id } },
      meta: { next_step }
    } = await createSessionToken({
      drfo,
      signed_content,
      client_id: query.client_id,
      grant_type: "digital_signature",
      signed_content_encoding: "base64",
      scope: "app:authorize"
    });
    login(value);
    if (next_step === "REQUEST_APPS") {
      authorize({
        // scope,
        clientId: client_id,
        redirectUri: redirect_uri
      }).then(({ payload, error }) => {
        return window && (window.location = payload.headers.get("location"));
      });
    }
  };
}

export default connect(null, {
  getNonce,
  createSessionToken,
  login,
  authorize
})(SignInDSPage);
