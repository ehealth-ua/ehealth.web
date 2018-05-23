import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import {
  REACT_APP_DIGITAL_SIGNATURE_ENABLED,
  REACT_APP_CLIENT_ID
} from "../../../env";

import { Button, SUBMIT_ERROR } from "@ehealth/components";

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
    const { router } = this.props;
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
            <Button theme="link" onClick={() => router.goBack()} block>
              Увійти за допомогою email
            </Button>
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
      location: { query },
      router
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
      payload: {
        value,
        details: { redirect_uri, client_id } = {},
        response: { error: error_body } = {}
      },
      meta: { next_step } = {},
      error: token_error
    } = await createSessionToken({
      drfo,
      signed_content,
      client_id: REACT_APP_CLIENT_ID,
      grant_type: "digital_signature",
      signed_content_encoding: "base64",
      scope: "app:authorize"
    });
    if (token_error) {
      if (error_body.type === "validation_failed") {
        return { [SUBMIT_ERROR]: error.invalid };
      }
      return router.push(`/sign-in/failure/${error_body.type}`);
    }

    login(value);

    if (next_step === "REQUEST_APPS") {
      authorize({
        clientId: query.client_id,
        redirectUri: query.redirect_uri
      }).then(({ payload, error }) => {
        return window && (window.location = payload.headers.get("location"));
      });
    }
  };
}

export default compose(
  withRouter,
  connect(null, {
    getNonce,
    createSessionToken,
    login,
    authorize
  })
)(SignInDSPage);
