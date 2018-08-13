import React from "react";
import { withRouter } from "react-router";

import { Confirm } from "../../../components/Popup";

class ConfirmFormChanges extends React.Component {
  state = {
    isConfirmed: false,
    showConfirm: false,
    location: null
  };

  componentDidMount() {
    this.removeListener = this.props.router.listenBefore(location => {
      if (
        this.state.isConfirmed ||
        !this.props.isChanged ||
        this.props.submitting
      ) {
        return true;
      }

      this.setState({ showConfirm: true, location: location.pathname });

      return false;
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = null;

  confirmLocation() {
    this.setState({ showConfirm: false, isConfirmed: true }, () => {
      this.props.router.replace(this.state.location);
    });
  }

  render() {
    return (
      <Confirm
        title="У вас є незбережені зміни"
        active={this.state.showConfirm}
        theme="error"
        confirm="Добре"
        cancel="Скасувати"
        id="confirm-leave"
        onCancel={() => this.setState({ showConfirm: false })}
        onConfirm={() => this.confirmLocation()}
      >
        Ви впевнені, що хочете залишити цю сторінку?
      </Confirm>
    );
  }
}

export default withRouter(ConfirmFormChanges);
