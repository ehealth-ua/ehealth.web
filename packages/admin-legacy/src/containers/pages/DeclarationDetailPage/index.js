import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import DeclarationDetail from "../../blocks/DeclarationDetail";
import DeclarationScans from "../../blocks/DeclarationScans";
import Line from "../../../components/Line";
import { Confirm } from "../../../components/Popup";

import { getDeclaration } from "../../../reducers";
import { hasScope, getScope } from "../../../helpers/scope";

import {
  getDeclarationImage,
  terminateDeclaration
} from "../../../redux/declarations";

import { fetchDeclaration } from "./redux";

class DeclarationDetailPage extends React.Component {
  constructor() {
    super();
    this.terminateDeclaration = this.terminateDeclaration.bind(this);
    this.onTerminate = this.onTerminate.bind(this);
  }
  state = {
    showTerminateConfirm: false,
    terminateReason: ""
  };
  terminateDeclaration() {
    this.props
      .terminateDeclaration({
        person_id: this.props.declaration.person.id,
        reason_description: this.state.terminateReason
      })
      .then(() => {
        this.setState({
          showTerminateConfirm: false
        });
        return this.props.router.push(`/declarations/${this.props.params.id}`);
      });
  }
  onTerminate(value) {
    this.setState(() => ({
      terminateReason: value,
      showTerminateConfirm: true
    }));
  }

  render() {
    const { declaration = {} } = this.props;
    return (
      <div id="declaration-detail-page">
        <DeclarationDetail
          declaration={declaration}
          onTerminate={this.onTerminate}
        />

        <Line />

        <DeclarationScans declaration={declaration} />

        <Confirm
          title="Деактивувати декларацію?"
          active={this.state.showTerminateConfirm}
          theme="error"
          cancel="Відмінити"
          confirm="Підтвердити"
          onCancel={() => this.setState({ showTerminateConfirm: false })}
          onConfirm={() => this.terminateDeclaration()}
        />
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, getState, params: { id } }) => {
      const canReadDocuments = hasScope(
        "declaration_documents:read",
        getScope()
      );

      return Promise.all([
        dispatch(fetchDeclaration(id)),
        canReadDocuments && dispatch(getDeclarationImage(id))
      ]);
    }
  }),
  connect(
    (state, { params: { id } }) => ({
      declaration: getDeclaration(state, id)
    }),
    { terminateDeclaration }
  )
)(DeclarationDetailPage);
