import React from "react";
import {
  addValidation,
  ErrorMessages,
  ErrorMessage
} from "react-nebo15-validate";

import isUuidValid from "../../helpers/validators/uuid";
import isUrlValid from "../../helpers/validators/url";

addValidation("uuid", isUuidValid);
addValidation("url", isUrlValid);

export default class ErrorMessagesTranslated extends React.Component {
  render() {
    const { children, ...rest } = this.props;
    return (
      <ErrorMessages {...rest}>
        {children}
        <ErrorMessage when="required">Обов&#700;язкове поле</ErrorMessage>
        <ErrorMessage when="email">Невірний формат Email</ErrorMessage>
        <ErrorMessage when="userName">Невірне прізвище</ErrorMessage>
        <ErrorMessage when="maxLength">
          {`Довжина має бути менше ніж ${this.props.error.maxLength}`}
        </ErrorMessage>
        <ErrorMessage when="card_number">Невірний номер карти</ErrorMessage>
        <ErrorMessage when="uniqueCardName">
          Карта з такою назвою вже існує
        </ErrorMessage>
        <ErrorMessage when="uniqueCardNumber">
          Карта з таким номером вже існує
        </ErrorMessage>
        <ErrorMessage when="cardType">
          {`Ми підтримуємо тільки картки ${this.props.error.cardType &&
            this.props.error.cardType.join(", ")}`}
        </ErrorMessage>
        <ErrorMessage when="min">
          {`Мінімальне значення ${this.props.error.min}`}
        </ErrorMessage>
        <ErrorMessage when="max">
          {`Максимальне значення ${this.props.error.max}`}
        </ErrorMessage>

        <ErrorMessage when="accountPasswordMismatch">
          Невірний e-mail або пароль
        </ErrorMessage>
        <ErrorMessage when="uuid">Некоректний формат ID</ErrorMessage>
        <ErrorMessage when="url">Некоректний формат URL</ErrorMessage>
      </ErrorMessages>
    );
  }
}
