import React, { Component } from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { reduxForm, Field } from "redux-form";
import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button, { ButtonsGroup } from "../../../components/Button";
import ColoredText from "../../../components/ColoredText";
import { FormBlock } from "../../../components/Form";

class OtpForm extends Component {
  state = {
    send: false,
    isSending: false,
    otp_timeout: false,
    token_expires: false
  };

  onClickResend() {
    if (!this.props.onResend) return null;
    const res = this.props.onResend();
    if (!res || typeof res.then !== "function") return res;

    this.setState({ sent: false, isSending: true });
    setTimeout(() => {
      res.then(
        () => {
          this.setState({ isSending: false, sent: true });
          setTimeout(() => this.setState({ sent: false }), 5000);
        },
        () => {
          this.setState({ isSending: false });
        }
      );
    }, 1000);
    return res;
  }

  render() {
    const {
      handleSubmit,
      submitting,
      repeat = false,
      btnColor = "blue"
    } = this.props;
    const { sent, isSending, otp_timeout, token_expires } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <FormBlock>
          <div>
            <Field
              placeholder="Введіть код, що прийшов на телефон"
              name="code"
              component={FieldInput}
            >
              <ErrorMessage when="format">
                Значення повинном бути числом
              </ErrorMessage>
            </Field>
          </div>
          <ButtonsGroup>
            <Button disabled={submitting} type="submit" color={btnColor}>
              Ввести
            </Button>
            {repeat && (
              <Button
                theme="link"
                onClick={() =>
                  this.onClickResend().then(action => {
                    if (!action) return this.setState({ otp_timeout: true });
                    if (
                      action.payload.response.error.message === "Token expired"
                    ) {
                      return this.setState({ token_expires: true });
                    }
                    if (
                      action.payload.response.error.message ===
                      "Sending OTP timeout. Try later."
                    ) {
                      return this.setState({ token_expires: true });
                    }
                    return action;
                  })
                }
                disabled={sent || isSending || otp_timeout || token_expires}
              >
                {sent && !otp_timeout && !token_expires && "Відправлено"}
                {isSending &&
                  !otp_timeout &&
                  !token_expires &&
                  "Відправляємо..."}
                {!sent &&
                  !otp_timeout &&
                  !isSending &&
                  !token_expires &&
                  "Відправити знову"}
                {otp_timeout &&
                  !token_expires && (
                    <ColoredText color="red">
                      Перевищено кількість спроб авторизації. Спробуйте пізніше
                    </ColoredText>
                  )}
                {token_expires && (
                  <ColoredText color="red">
                    Термін cecії користувача вичерпано. Радимо повернутися до
                    попереднього кроку
                  </ColoredText>
                )}
              </Button>
            )}
          </ButtonsGroup>
        </FormBlock>
      </form>
    );
  }
}

export default compose(
  withRouter,
  reduxForm({
    form: "otp-form",
    validate: reduxFormValidate({
      code: {
        required: true,
        format: /^\d*$/
      }
    })
  })
)(OtpForm);
