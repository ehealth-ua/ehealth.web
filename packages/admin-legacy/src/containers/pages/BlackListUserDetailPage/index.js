import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { provideHooks } from "redial";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import { DetailMain } from "../../../components/Detail";
import { FormRow, FormColumn } from "../../../components/Form";
import Checkbox from "../../../components/Checkbox";
import DataList from "../../../components/DataList";
import Line from "../../../components/Line";
import { Confirm } from "../../../components/Popup";
import Button from "../../../components/Button";

import ShowWithScope from "../../blocks/ShowWithScope";
import BackLink from "../../blocks/BackLink";

import { fetchBlackListUser } from "./redux";
import { getBlackUser } from "../../../reducers";
import { deactivateBlackListUser } from "../../../redux/black-list-users";

import { BackIcon } from "@ehealth/icons";

class BlackListUserDetailPage extends React.Component {
  state = {
    showDeactivateConfirm: false
  };

  deactivateBlackUser() {
    this.props.deactivateBlackListUser(this.props.params.id).then(() => {
      this.setState({
        showDeactivateConfirm: false
      });
      return this.props.router.push(
        `/black-list-users/${this.props.params.id}`
      );
    });
  }

  render() {
    const {
      router,
      black_list_user: { id, tax_id, is_active, parties } = {}
    } = this.props;
    return (
      <div id="medication-dispense-detail-page">
        <Helmet
          title="Деталі заблокованого користувача"
          meta={[
            {
              property: "og:title",
              content: "Деталі заблокованого користувача"
            }
          ]}
        />

        <BackLink onClick={() => router.push("/black-list-users")}>
          Повернутися назад
        </BackLink>
        <Line />
        <DetailMain>
          <DataList
            list={[
              { name: "ID", value: id },
              { name: "ІНН Користувача", value: tax_id },
              {
                name: "Імена користувачів",
                value: (
                  <ul>
                    {parties.map(
                      (
                        { last_name, first_name, second_name, birth_date },
                        key
                      ) => (
                        <li key={key}>
                          <div
                          >{`${last_name} ${first_name} ${second_name}`}</div>
                          <div>{birth_date}</div>
                          <Line width={200} />
                        </li>
                      )
                    )}
                  </ul>
                )
              },
              {
                name: "Активний",
                value: is_active ? <Checkbox checked={is_active} /> : "-"
              }
            ]}
          />
        </DetailMain>
        <Line />
        {is_active && (
          <ShowWithScope scope="bl_user:deactivate">
            <FormRow>
              <FormColumn>
                <Button
                  to="/black-list-users"
                  theme="border"
                  color="blue"
                  icon={<BackIcon width="20" height="12" />}
                  block
                >
                  Повернутися до списку
                </Button>
              </FormColumn>
              <FormColumn>
                <Button
                  onClick={() => this.setState({ showDeactivateConfirm: true })}
                  theme="fill"
                  color="red"
                  block
                >
                  Деактивувати користувача
                </Button>
              </FormColumn>
            </FormRow>
          </ShowWithScope>
        )}
        <Confirm
          title="Деактивувати користувача?"
          active={this.state.showDeactivateConfirm}
          theme="error"
          cancel="Відмінити"
          confirm="Підтвердити"
          onCancel={() => this.setState({ showDeactivateConfirm: false })}
          onConfirm={() => this.deactivateBlackUser()}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) => dispatch(fetchBlackListUser(id))
  }),
  connect(
    (state, { params: { id } }) => ({
      black_list_user: getBlackUser(state, id)
    }),
    { deactivateBlackListUser }
  )
)(BlackListUserDetailPage);
