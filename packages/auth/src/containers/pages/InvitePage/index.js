import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import { withRouter } from "react-router";
import { withGoogleReCaptcha } from "react-google-recaptcha-v3";
import format from "date-fns/format";

import Button, { ButtonsGroup } from "../../../components/Button";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import Points from "../../../components/Points";
import Icon from "../../../components/Icon";
import { FormBlock } from "../../../components/Form";
import DictionaryValue from "../../../components/DictionaryValue";
import InviteSignInForm from "../../forms/InviteSignInForm";
import InviteSignUpForm from "../../forms/InviteSignUpForm";
import { fetchDictionaries } from "../../../redux/dictionaries";
import { getRequestById } from "../../../reducers";

import { onSubmitSignUp, onSubmitSignIn } from "./redux";
import styles from "./styles.module.css";

class InvitePage extends Component {
  constructor(props) {
    super(props);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.state = {
      showDetails: false
    };
  }

  toggleDetails() {
    this.setState({
      showDetails: !this.state.showDetails
    });
  }

  renderDoctorDetails() {
    const {
      request: { doctor }
    } = this.props;
    return (
      <div>
        <div className={styles.details__title}>Освіта</div>
        {doctor.educations && doctor.educations.length
          ? doctor.educations.map((education, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  {education.institution_name}, {education.city}{" "}
                  <DictionaryValue
                    dictionary="COUNTRY"
                    value={education.country}
                  />
                </p>
                <p>
                  <b>Диплом:</b> {education.diploma_number} від{" "}
                  {education.issued_date}
                </p>
                <p>
                  <b>Ступінь:</b>{" "}
                  <DictionaryValue
                    dictionary="EDUCATION_DEGREE"
                    value={education.degree}
                  />
                </p>
                <p>
                  <b>Спеціальність:</b> {education.speciality}
                </p>
              </div>
            ))
          : "-"}
        <div className={styles.details__title}>Наукові ступіні</div>
        {doctor.science_degree && toArray(doctor.science_degree).length
          ? toArray(doctor.science_degree).map((degree, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  <DictionaryValue
                    dictionary="SCIENCE_DEGREE"
                    value={degree.degree}
                  />
                  , {degree.city} {degree.country}
                </p>
                <p>
                  <b>Спеціальність:</b>{" "}
                  <DictionaryValue
                    dictionary="SPECIALITY_TYPE"
                    value={degree.speciality}
                  />
                </p>
                <p>
                  {degree.institution_name}, {degree.city}{" "}
                  <DictionaryValue
                    dictionary="COUNTRY"
                    value={degree.country}
                  />
                </p>
                <p>
                  <b>Диплом:</b> {degree.diploma_number} від{" "}
                  {degree.issued_date}
                </p>
              </div>
            ))
          : "-"}
        <div className={styles.details__title}>Кваліфікації</div>
        {doctor.qualifications && doctor.qualifications.length
          ? doctor.qualifications.map((qualification, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  <DictionaryValue
                    dictionary="QUALIFICATION_TYPE"
                    value={qualification.type}
                  />{" "}
                  в {qualification.institution_name}
                </p>
                <p>
                  <b>Сертифікат:</b> {qualification.certificate_number} від{" "}
                  {qualification.issued_date}
                </p>
                <p>
                  <b>Спеціальність:</b> {qualification.speciality}
                </p>
              </div>
            ))
          : "-"}
        <div className={styles.details__title}>Спеціальності</div>
        {doctor.specialities && doctor.specialities.length
          ? doctor.specialities.map((speciality, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  <DictionaryValue
                    dictionary="SPECIALITY_TYPE"
                    value={speciality.speciality}
                  />{" "}
                  <DictionaryValue
                    dictionary="SPECIALITY_LEVEL"
                    value={speciality.level}
                  />
                </p>
                <p>
                  <b>Сертифікат:</b> {speciality.certificate_number}
                </p>
                <p>
                  <b>Виданий:</b> {speciality.attestation_name}{" "}
                  {speciality.attestation_date}
                </p>
                <p>
                  <b>Тип кваліфікації:</b>{" "}
                  {
                    <DictionaryValue
                      dictionary="SPEC_QUALIFICATION_TYPE"
                      value={speciality.qualification_type}
                    />
                  }
                </p>
                <p>
                  <b>Спеціальність за посадою:</b>{" "}
                  {speciality.speciality_officio ? "Так" : "Ні"}
                </p>
                <p>
                  <b>Дійсний до:</b> {speciality.valid_to_date}
                </p>
              </div>
            ))
          : "-"}
      </div>
    );
  }

  renderDetails() {
    const {
      request: { doctor, party }
    } = this.props;

    return (
      <div className={styles.details__body}>
        <div className={styles.details__title}>Персональная інформація</div>
        <div className={styles.details__block}>
          <p>
            {party.first_name} {party.second_name} {party.last_name}
          </p>
          <p>{format(party.birth_date, "DD.MM.YYYY")} р.н.</p>
          <p>
            <b>Стать:</b>{" "}
            <DictionaryValue dictionary="GENDER" value={party.gender} />
          </p>
          <p>
            <b>ІПН:</b> {party.tax_id}
          </p>
          <p>
            <b>Email:</b> {party.email}
          </p>
        </div>
        <div className={styles.details__title}>Документи</div>
        {party.documents && party.documents
          ? party.documents.map((doc, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  <b>Тип документу:</b>{" "}
                  <DictionaryValue
                    dictionary="DOCUMENT_TYPE"
                    value={doc.type}
                  />
                </p>
                <p>
                  <b>Номер:</b> {doc.number}
                </p>
              </div>
            ))
          : "-"}
        <div className={styles.details__title}>Контактні номери телефону</div>
        {party.phones && party.phones
          ? party.phones.map((phone, idx) => (
              <div className={styles.details__block} key={idx}>
                <p>
                  <b>Тип телефону:</b>{" "}
                  <DictionaryValue dictionary="PHONE_TYPE" value={phone.type} />
                </p>
                <p>
                  <b>Номер:</b> {phone.number}
                </p>
              </div>
            ))
          : "-"}
        {doctor && this.renderDoctorDetails()}
      </div>
    );
  }

  render() {
    const {
      request: { party = {}, legal_entity = {}, position, user_id, id } = {},
      location,
      googleReCaptchaProps
    } = this.props;

    const invite =
      location.query && location.query.invite
        ? `invite=${location.query.invite}`
        : false;

    return (
      <Main id="sign-up-page">
        {!user_id && (
          <Header>
            <H1>Реєстрація</H1>

            <Points count={2} active={0} />
          </Header>
        )}
        <Article>
          <NarrowContainer>
            <div className={styles.description}>
              Я, {party.first_name} {party.second_name} {party.last_name},{" "}
              {format(party.birth_date, "DD.MM.YYYY")} р.н.
            </div>

            <div className={styles.accept}>
              даю згоду на реєстрацію мене в системі eHealth
              <br />у ролі "
              <DictionaryValue dictionary="POSITION" value={position} />"<br />
              {legal_entity.name}
            </div>
            <div className={styles.details}>
              <div className={styles.details__header}>
                <Button
                  onClick={this.toggleDetails}
                  theme="link"
                  inheritFontSize
                >
                  <span className={styles.details__header__title}>
                    {this.state.showDetails ? "Сховати деталі" : "Детальніше"}
                    <span className={styles.details__header__arrow}>
                      <Icon
                        name={
                          this.state.showDetails ? "caret-up" : "caret-down"
                        }
                      />
                    </span>
                  </span>
                </Button>
              </div>
              {this.state.showDetails && this.renderDetails()}
            </div>
            <FormBlock>
              <div>
                {user_id && (
                  <InviteSignInForm
                    email={party.email}
                    onSubmit={async ({ password }) => {
                      const token = await googleReCaptchaProps.executeRecaptcha(
                        "InviteSignIn"
                      );
                      return this.props.onSubmitSignIn(
                        id,
                        party.email,
                        password,
                        token
                      );
                    }}
                  />
                )}

                {!user_id && (
                  <InviteSignUpForm
                    email={party.email}
                    onSubmit={async ({ password }) => {
                      const token = await googleReCaptchaProps.executeRecaptcha(
                        "InviteSignUp"
                      );
                      return this.props.onSubmitSignUp(
                        id,
                        party.email,
                        password,
                        token
                      );
                    }}
                  />
                )}
              </div>
            </FormBlock>
            <ButtonsGroup>
              <Button theme="link" to={`/update-password${location.search}`}>
                Змінити пароль
              </Button>
              <Button theme="link" to="/reset">
                Забули пароль?
              </Button>
              <Button theme="link" to={`/update-factor?${invite}`}>
                Змінити додатковий фактор авторизації
              </Button>
            </ButtonsGroup>
          </NarrowContainer>
        </Article>
      </Main>
    );
  }
}

export default compose(
  withRouter,
  withGoogleReCaptcha,
  provideHooks({
    fetch: ({ dispatch }) => dispatch(fetchDictionaries())
  }),
  connect(
    state => ({
      request: getRequestById(state, state.pages.Invitelayout.request)
    }),
    { onSubmitSignUp, onSubmitSignIn }
  )
)(InvitePage);

const toArray = v => (Array.isArray(v) ? v : [v]);
