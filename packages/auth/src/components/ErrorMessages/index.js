import React from "react";
import { ErrorMessages, ErrorMessage } from "react-nebo15-validate";

const PredefinedErrorMessages = ({ children, ...props }) => (
  <ErrorMessages {...props}>
    {children}
    <ErrorMessage when="required">Обов’язкове поле</ErrorMessage>
    <ErrorMessage when="email">Невірний формат Email</ErrorMessage>
    <ErrorMessage when="userName">Невірний формат прізвища</ErrorMessage>
    <ErrorMessage when="phone_number">
      Не вірний формат номеру телефону
    </ErrorMessage>
    <ErrorMessage when="format">
      Пароль повинен містити великі, малі літери та цифри
    </ErrorMessage>

    <ErrorMessage when="maxLength">
      {"Довжина повинна бути менше <%= params %>"}
    </ErrorMessage>
    <ErrorMessage when="minLength">
      {"Довжина повинна бути більша за <%= params %>"}
    </ErrorMessage>
    <ErrorMessage when="min">
      {"Мінімальним значенням є <%= params %>"}
    </ErrorMessage>
    <ErrorMessage when="max">
      {"Максимальним значенням є <%= params %>"}
    </ErrorMessage>

    <ErrorMessage when="passwordMismatch">Не вірно введено пароль</ErrorMessage>
    <ErrorMessage when="identityMismatch">
      Такого користувача не існує
    </ErrorMessage>

    <ErrorMessage when="accountPasswordMismatch">
      Невірний email або пароль
    </ErrorMessage>
    <ErrorMessage when="emailOrPasswordMismatch">
      Невірний email або пароль
    </ErrorMessage>

    <ErrorMessage when="user_not_found">Користувача не знайдено</ErrorMessage>
    <ErrorMessage when="user_blocked">
      Користувача заблоковано. Зверніться в службу підтримки
    </ErrorMessage>
    <ErrorMessage when="otp_reached_max_attempts">
      Ви використали всі спроби. Вас заблоковано!
    </ErrorMessage>
    <ErrorMessage when="otp_reached_max_attempts">
      Ви використали всі спроби. Вас заблоковано!
    </ErrorMessage>

    <ErrorMessage when="otp_invalid">
      Не вірно введено код підтверження
    </ErrorMessage>
    <ErrorMessage when="resentOtp">
      Не вдалося відправити код. Повторіть спробу через декілька хвилин
    </ErrorMessage>
    <ErrorMessage when="internal_error">
      Не вдалося відправити код. Повторіть спробу через декілька хвилин
    </ErrorMessage>

    <ErrorMessage when="otp_expired">
      Термін дії коду вичерпано. Спробуйте відправити знову
    </ErrorMessage>
    <ErrorMessage when="token_invalid">
      Термін cecії користувача вичерпано. Радимо повернутися до попереднього
      кроку
    </ErrorMessage>
    <ErrorMessage when="token_expired">
      Термін cecії користувача вичерпано. Радимо повернутися до попереднього
      кроку
    </ErrorMessage>
    <ErrorMessage when="token_invalid_type">
      Термін cecії користувача вичерпано. Радимо повернутися до попереднього
      кроку
    </ErrorMessage>
    <ErrorMessage when="access_denied">
      Термін cecії користувача вичерпано. Радимо повернутися до попереднього
      кроку
    </ErrorMessage>
    <ErrorMessage when="notAllowed">
      Можливість зміни фактору Вам не доступна
    </ErrorMessage>
    <ErrorMessage when="otp_timeout">
      Перевищено кількість спроб авторизації. Спробуйте пізніше
    </ErrorMessage>
    <ErrorMessage when="password_already_taken">
      Такий пароль вже використовувався нещодавно. Спробуйте інший
    </ErrorMessage>
    <ErrorMessage when="reached_max_attempts">
      Ви досягнули максимальної кількості спроб авторизації. Спробуйте пізніше
    </ErrorMessage>
    <ErrorMessage when="password_expired">
      Ваш пароль застарів. Необхідно змінити пароль
    </ErrorMessage>
    <ErrorMessage when="unexpected_error">
      Щось пішло не так. Спробуйте пізніше
    </ErrorMessage>
  </ErrorMessages>
);

export default PredefinedErrorMessages;
