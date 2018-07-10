import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1, H3 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import NewPasswordForm from "../../forms/NewPasswordForm";

import { onSubmit } from "./redux";
import styles from "./styles.module.css";

class NewPasswordPage extends Component {
  state = {
    code: false
  };

  render() {
    const { router } = this.props;
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
                <Button
                  color="blue"
                  onClick={() =>
                    router.push({ ...router.location, pathname: "/sign-in" })
                  }
                >
                  Повернутися до входу
                </Button>
              </div>
            </div>
          )}
          {this.state.code === 422 && (
            <div>
              <H3>
                Час дії посилання вичерпався, будь ласка відправте форму
                повторно
              </H3>
              <div className={styles.description}>
                <ButtonsGroup>
                  <Button color="blue" to="/reset">
                    Відправити повторно
                  </Button>
                  <Button
                    theme="link"
                    onClick={() =>
                      router.push({ ...router.location, pathname: "/sign-in" })
                    }
                  >
                    Повернутися до входу
                  </Button>
                </ButtonsGroup>
              </div>
            </div>
          )}
          {this.state.code === 400 && (
            <div>
              <H3>Помилка коду відновлення</H3>
              <div className={styles.description}>
                Спробуйте перейти за посиланням у листі заново.
              </div>
              <div className={styles.description}>
                <Button
                  color="blue"
                  onClick={() =>
                    router.push({ ...router.location, pathname: "/sign-in" })
                  }
                >
                  Повернутися до входу
                </Button>
              </div>
            </div>
          )}
          {this.state.code === 404 && (
            <div>
              <H3>Посилання на відновлення паролю не дійсне</H3>
            </div>
          )}
        </article>
      </section>
    );
  }

  onSubmit = async values => {
    const { error, payload } = await this.props.onSubmit(values, this.props);
    const code = error ? payload.status : 200;

    this.setState({ code });
  };
}

export default compose(withRouter, connect(null, { onSubmit }))(
  NewPasswordPage
);
