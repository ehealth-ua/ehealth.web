import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Switch } from "@ehealth/components";

import { REACT_APP_DIGITAL_SIGNATURE_ENABLED } from "../../../env";
import { getToken } from "../../../reducers";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";

import { exchangeToken, checkSignUpAbility } from "./redux";

class SignUpValidatePage extends Component {
  state = {
    tokenExchangeState: "pending"
  };

  async componentDidMount() {
    try {
      const { params: { token }, exchangeToken } = this.props;
      await exchangeToken({ token });

      this.setState({ tokenExchangeState: "success" });
    } catch (error) {
      console.log(error);
      this.setState({ tokenExchangeState: error.type });
    }
  }

  render() {
    return (
      <Main>
        <Header>
          <H1>Реєстрація</H1>
        </Header>
        <Article>
          <Switch
            value={this.state.tokenExchangeState}
            success={
              <NarrowContainer>
                <p>За допомогою Електронного Цифрового Підпису</p>
                <DigitalSignatureForm onSubmit={this.handleSubmit} />
              </NarrowContainer>
            }
            jwt_expired={
              <>
                <p>Час дії посилання вичерпався.</p>
                <p>Будь ласка, відправте форму повторно.</p>
                <Button to="/sign-up">Відправити повторно</Button>
              </>
            }
            email_exists={
              <>
                <p>Ви вже скористались цим посиланням.</p>
                <p>Будь ласка, увійдіть.</p>
                <Button to="/sign-in">Увійти</Button>
              </>
            }
            access_denied={
              <>
                <p>Некоректне посилання. У доступі відмовлено.</p>
                <p>Будь ласка, перевірте правильність посилання.</p>
              </>
            }
          />
        </Article>
      </Main>
    );
  }

  handleSubmit = async ds => {
    const { token, checkSignUpAbility } = this.props;

    const content = JSON.stringify({ token });
    const signed_content = REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? ds.SignDataInternal(true, content, true)
      : btoa(content);

    const drfo = REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? undefined
      : ds.privKeyOwnerInfo.subjDRFOCode;

    return checkSignUpAbility({ signed_content, drfo });
  };
}

export default connect(state => ({ token: getToken(state) }), {
  exchangeToken,
  checkSignUpAbility
})(SignUpValidatePage);
