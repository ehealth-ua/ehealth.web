import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import FormPageWrapper from "../../blocks/FormPageWrapper";
import DictionaryForm from "../../forms/DictionaryForm";

import { getDictionary } from "../../../reducers";
import { hasScope, getScope } from "../../../helpers/scope";

import {
  fetchDictionaries,
  updateDictionary
} from "../../../redux/dictionaries";

class DictionariesPage extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.state = {
      write: false
    };
  }
  componentWillMount() {
    const write = hasScope("dictionary:write", this.props.currentScope);
    this.setState({ write });
  }

  onSave(values) {
    const { updateDictionary } = this.props;

    return updateDictionary(values.name, this.transformFromForm(values));
  }

  transformToForm(dictionary) {
    return {
      ...dictionary,
      values: Object.entries(dictionary.values).map(([key, value]) => ({
        key,
        value
      }))
    };
  }

  transformFromForm(dictionary) {
    return {
      ...dictionary,
      values: dictionary.values.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.key]: cur.value
        }),
        {}
      )
    };
  }

  render() {
    const { dictionary, params } = this.props;

    return (
      <FormPageWrapper
        id="dictionary-edit-page"
        title={`Редагувати ${params.name} словник`}
        back="/dictionaries"
      >
        <Helmet
          title={`Редагувати ${params.name} словник`}
          meta={[
            {
              property: "og:title",
              content: `Редагувати ${params.name} словник`
            }
          ]}
        />
        <DictionaryForm
          initialValues={this.transformToForm(dictionary)}
          onSubmit={this.onSave}
          readOnly={!this.state.write}
        />
      </FormPageWrapper>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, params: { name } }) =>
      dispatch(fetchDictionaries({ name }))
  }),
  connect(
    (state, params) => ({
      dictionary: getDictionary(state, params.params.name),
      currentScope: getScope()
    }),
    {
      updateDictionary
    }
  )
)(DictionariesPage);
