import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { reset } from "redux-form";

import { resetAuthMethod } from "../../../redux/persons";

import ResetAuthenticationMethodForm from "../../forms/ResetAuthenticationMethodForm";

import { H1 } from "../../../components/Title";
import { Confirm, Alert } from "../../../components/Popup";

class ResetAuthenticationMethodPage extends Component {
  state = {};

  render() {
    const { showConfirm, alertTitle, alertTheme, showAlert } = this.state;

    return (
      <div>
        <Helmet
          title="Скинути метод авторизації"
          meta={[
            { property: "og:title", content: "Скинути метод авторизації" }
          ]}
        />

        <H1>Скинути метод авторизації</H1>

        <ResetAuthenticationMethodForm
          onSubmit={({ person_id }) =>
            this.setState({ person_id, showConfirm: true })
          }
        />

        <Confirm
          title="Скинути метод авторизації?"
          active={showConfirm}
          theme="error"
          cancel="Скасувати"
          confirm="Так"
          onCancel={() => this.setState({ showConfirm: false })}
          onConfirm={this.resetAuthMethod}
        />

        <Alert
          title={alertTitle}
          active={showAlert}
          theme={alertTheme}
          ok="Ok"
          onClose={() =>
            this.setState({
              showAlert: false,
              alertTitle: null,
              alertTheme: null
            })
          }
        />
      </div>
    );
  }

  resetAuthMethod = () => {
    const { resetAuthMethod, reset } = this.props;
    const { person_id } = this.state;

    resetAuthMethod(person_id).then(({ error }) => {
      this.setState({
        person_id: null,
        showConfirm: false,
        showAlert: true,
        alertTitle: error
          ? "Обліковий запис не знайдено"
          : "Метод авторизації успішно скинутий",
        alertTheme: error ? "error" : "success"
      });

      if (!error) return reset("reset-authentication-method-form");
    });
  };
}

export default connect(
  null,
  { resetAuthMethod, reset }
)(ResetAuthenticationMethodPage);
