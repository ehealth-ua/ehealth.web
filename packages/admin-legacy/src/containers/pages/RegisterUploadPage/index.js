import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

import RegisterUploadForm from "../../forms/RegisterUploadForm";
import BackLink from "../../blocks/BackLink";
import { Alert } from "../../../components/Popup";

import { uploadRegister } from "../../../redux/registers";
import { getDictionaryValues } from "../../../reducers";

class RegisterUploadPage extends React.Component {
  state = {
    uploaded: false
  };
  render() {
    const { uploadRegister = () => {}, registerTypes, router } = this.props;

    return (
      <div id="register-upload-page">
        <Helmet
          title="Сторінка завантаження файлу"
          meta={[
            { property: "og:title", content: "Сторінка завантаження файлу" }
          ]}
        />
        <BackLink onClick={() => router.push("/registers")}>
          Завантажити файл
        </BackLink>

        <RegisterUploadForm
          data={{ registerTypes }}
          onSubmit={v =>
            uploadRegister(v).then(
              e =>
                !e.error &&
                this.setState({
                  uploaded: true
                })
            )
          }
        />
        <Alert
          ok="Повернутись до списку реєстрів"
          active={this.state.uploaded}
          title="Файл успішно завантаженно"
          onClose={() => router.push("/registers")}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      registerTypes: getDictionaryValues(state, "REGISTER_TYPE")
    }),
    { uploadRegister }
  )
)(RegisterUploadPage);
