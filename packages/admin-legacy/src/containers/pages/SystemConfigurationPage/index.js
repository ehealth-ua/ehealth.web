import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import SystemConfigurationForm from "../../forms/SystemConfigurationForm";

import { getConfiguration } from "../../../reducers";

import { updateConfiguration } from "../../../redux/configuration";

import { fetchConfiguration } from "./redux";

class SystemConfigurationPage extends React.Component {
  render() {
    const { configuration = {} } = this.props;
    return (
      <div id="system-configuration-page">
        <Helmet
          title="Конфігурація системи"
          meta={[{ property: "og:title", content: "Конфігурація системи" }]}
        />

        <H1>Конфігурація системи</H1>

        <SystemConfigurationForm
          initialValues={configuration}
          onSubmit={values => this.props.updateConfiguration(values)}
        />
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch }) => dispatch(fetchConfiguration())
  }),
  connect(
    state => ({
      configuration: getConfiguration(state)
    }),
    { updateConfiguration }
  )
)(SystemConfigurationPage);
