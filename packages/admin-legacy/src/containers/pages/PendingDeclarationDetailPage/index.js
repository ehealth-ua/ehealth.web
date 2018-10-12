import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Line from "../../../components/Line";
import Button, { ButtonsGroup } from "../../../components/Button";
import { Confirm } from "../../../components/Popup";

import DeclarationDetail from "../../blocks/DeclarationDetail";
import DeclarationScans from "../../blocks/DeclarationScans";

import ShowWithScope from "../../blocks/ShowWithScope";

import { getDeclaration } from "../../../reducers";
import { hasScope, getScope } from "../../../helpers/scope";

import {
  approveDeclaration,
  rejectDeclaration,
  getDeclarationImage
} from "../../../redux/declarations";

import { fetchDeclaration } from "./redux";

class PendingDeclarationDetailPage extends React.Component {
  state = {
    showApproveConfirm: false,
    showRejectConfirm: false
  };

  approve() {
    const {
      router,
      params: { id },
      approveDeclaration
    } = this.props;
    this.setState({ showApproveConfirm: false });
    approveDeclaration(id).then(() => {
      router.push(`/declarations/${id}`);
    });
  }

  reject() {
    const {
      router,
      params: { id },
      rejectDeclaration
    } = this.props;
    this.setState({ showRejectConfirm: false });
    rejectDeclaration(id).then(() => {
      router.push(`/declarations/${id}`);
    });
  }

  render() {
    const { declaration = {} } = this.props;

    return (
      <div id="declaration-detail-page">
        <DeclarationDetail declaration={declaration} />

        <Line />

        <DeclarationScans declaration={declaration} />

        <ButtonsGroup>
          <ShowWithScope scope="declaration:reject">
            <div>
              <Button
                theme="border"
                onClick={() => this.setState({ showApproveConfirm: true })}
                color="green"
              >
                Прийняти
              </Button>
              <Confirm
                title="Прийняти декларацію?"
                active={this.state.showApproveConfirm}
                theme="success"
                cancel="Скасувати"
                confirm="Так"
                onCancel={() => this.setState({ showApproveConfirm: false })}
                onConfirm={() => this.approve()}
              />
            </div>
          </ShowWithScope>
          <ShowWithScope scope="declaration:approve">
            <div>
              <Button
                theme="border"
                onClick={() => this.setState({ showRejectConfirm: true })}
                color="red"
              >
                Відхилити
              </Button>
              <Confirm
                title="Відхилити декларацію?"
                active={this.state.showRejectConfirm}
                theme="error"
                cancel="Скасувати"
                confirm="Так"
                onCancel={() => this.setState({ showRejectConfirm: false })}
                onConfirm={() => this.reject()}
              />
            </div>
          </ShowWithScope>
        </ButtonsGroup>
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
    { approveDeclaration, rejectDeclaration }
  )
)(PendingDeclarationDetailPage);
