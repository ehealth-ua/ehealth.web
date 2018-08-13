import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import InnmForm from "../../forms/InnmForm";
import { withRouter } from "react-router";
import BackLink from "../../blocks/BackLink";
import Line from "../../../components/Line";
import Button from "../../../components/Button";
import { FormRow, FormColumn } from "../../../components/Form";

import { getInnm } from "../../../reducers";
// import { deactivateInnms } from 'redux/innms';
import { fetchInnm } from "./redux";

import { BackIcon } from "@ehealth/icons";

class InnmDetailPage extends React.Component {
  render() {
    const { innm = {} } = this.props;

    return (
      <div id="innm-detail-page">
        <Helmet
          title="Сторінка делатей МНН"
          meta={[{ property: "og:title", content: "Сторінка делатей МНН" }]}
        />
        <BackLink onClick={() => this.props.router.push("/innms")}>
          Повернутися до списку МНН
        </BackLink>
        <Line />

        <H1>Сторінка делатей МНН</H1>

        <InnmForm initialValues={innm} disabled />

        <FormRow>
          <FormColumn>
            <Button
              onClick={() => this.props.router.push("/medications")}
              theme="border"
              color="blue"
              icon={<BackIcon width="20" height="12" />}
              block
            >
              Повернутися до списку
            </Button>
          </FormColumn>
          <FormColumn />
        </FormRow>
      </div>
    );
  }
}

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) => dispatch(fetchInnm(id))
  }),
  connect((state, { params: { id } }) => ({
    innm: getInnm(state, id)
  }))
)(InnmDetailPage);
