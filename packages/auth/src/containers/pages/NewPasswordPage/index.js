import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1, H3 } from "../../../components/Title";
import Button from "../../../components/Button";
import NewPasswordForm from "../../forms/NewPasswordForm";

import { onSubmit } from "./redux";
import styles from "./styles.module.css";

class NewPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: false
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    return this.props.onSubmit(values, this.props).then(action => {
      if (action.error) {
        return this.setState({
          code: action.payload.status
        });
      }
      return this.setState({ code: 200 });
    });
  }

  render() {
    return (
      <section className={styles.main} id="sign-in-page">
        <header className={styles.header}>
          <H1>Відновлення паролю до системи eHealth</H1>
        </header>
        <article className={styles.form}>
          {!this.state.code && <NewPasswordForm onSubmit={this.onSubmit} />}
          {this.state.code === 200 && (
            <div>
              <H3>Пароль успішно оновлено</H3>
              <div className={styles.description}>
                <Button color="blue" to="/sign-in">
                  Повернутися до входу
                </Button>
              </div>
            </div>
          )}
          {this.state.code === 422 && (
            <div>
              <H3>Вийшов час дії токену</H3>
            </div>
          )}
          {this.state.code === 400 && (
            <div>
              <H3>Помилка коду відновлення</H3>
              <div className={styles.description}>
                Спробуйте перейти за посиланням у листі заново.
              </div>
              <div className={styles.description}>
                <Button color="blue" to="/sign-in">
                  Повернутися до входу
                </Button>
              </div>
            </div>
          )}
          {this.state.code === 404 && (
            <div>
              <H3>Дана ссилка на відновлення паролю не дійсна</H3>
            </div>
          )}
        </article>
      </section>
    );
  }
}

export default compose(withRouter, connect(null, { onSubmit }))(
  NewPasswordPage
);
