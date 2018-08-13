import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import { withRouter } from "react-router";

import Helmet from "react-helmet";

import { H3 } from "../../../components/Title";
import Line from "../../../components/Line";
import DataList from "../../../components/DataList";
import InlineList from "../../../components/InlineList";
import Upper from "../../../components/Upper";
import { Confirm } from "../../../components/Popup";
import Button from "../../../components/Button";

import BlocksList from "../../blocks/BlocksList";
import BackLink from "../../blocks/BackLink";
import ColoredText from "../../../components/ColoredText";
import ShowMore from "../../blocks/ShowMore";
import DictionaryValue from "../../blocks/DictionaryValue";
import ShowWithScope from "../../blocks/ShowWithScope";

import { getClinic } from "../../../reducers";

import { verifyClinic, deactivateClinic } from "../../../redux/clinics";

import { fetchClinic } from "./redux";
import styles from "./styles.module.css";

import { BackIcon, CheckRightIcon, CloseIcon } from "@ehealth/icons";

class ClinicDetailPage extends React.Component {
  state = {
    showVerifyConfirm: false,
    showDeactivateConfirm: false
  };

  verifyClinic() {
    this.props.verifyClinic(this.props.params.id).then(() => {
      this.props.router.goBack();
    });
  }

  deactivateClinic() {
    this.props.deactivateClinic(this.props.params.id).then(() => {
      this.props.router.goBack();
    });
  }

  render() {
    const { clinic } = this.props;
    if (!clinic) return null;
    const { accreditation, licenses } = clinic.medical_service_provider;

    return (
      <div id="clinic-detail-page">
        <Helmet
          title={clinic.name}
          meta={[{ property: "og:title", content: clinic.name }]}
        />

        <BackLink onClick={() => this.props.router.goBack()}>
          Повернутися
        </BackLink>

        <Line />

        <div className={styles.row}>
          <div>
            <DataList
              list={[
                { name: "Ідентифікатор медичного закладу", value: clinic.id }
              ]}
            />
          </div>
          <ShowWithScope scope="employee:read">
            <div className={styles.right}>
              <BackLink
                iconPosition="right"
                to={`/employees?legal_entity_id=${clinic.id}`}
              >
                Перейти до списку співробітників медичного закладу
              </BackLink>
            </div>
          </ShowWithScope>
        </div>

        <Line />

        <div className={styles.bold}>
          <DataList
            list={[
              { name: "Повне Ім’я", value: clinic.name },
              { name: "ЕДРПОУ", value: clinic.edrpou },
              {
                name: "Адреса регістрації",
                value: (
                  <div className={styles.address}>
                    <p>
                      {clinic.addresses[0].zip}, {clinic.addresses[0].area}{" "}
                      область, місто {clinic.addresses[0].settlement},
                    </p>
                    <p>
                      {clinic.addresses[0].street},{" "}
                      {clinic.addresses[0].building}
                    </p>
                    <small>
                      Фактична адреса співпадає з адресою реєстрації
                    </small>
                  </div>
                )
              },
              {
                name: "КВЕДи",
                value: (
                  <div>
                    {clinic.kveds.map((name, key) => (
                      <p key={key}>
                        <DictionaryValue
                          dictionary="KVEDS"
                          value={name}
                          key={key}
                        />
                      </p>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>

        <Line width={630} />

        <DataList
          theme="min"
          list={[
            { name: "Скорочена назва", value: clinic.short_name },
            { name: "Публічна назва", value: clinic.public_name }
          ]}
        />

        <Line width={630} />

        <DataList
          theme="min"
          list={[
            {
              name: "Тип властності",
              value: (
                <DictionaryValue
                  dictionary="OWNER_PROPERTY_TYPE"
                  value={clinic.owner_property_type}
                />
              )
            },
            { name: "Тип", value: clinic.type }
          ]}
        />

        <Line width={630} />

        <DataList
          theme="min"
          list={[
            {
              name: "Телефони",
              value: (
                <InlineList list={clinic.phones.map(item => item.number)} />
              )
            },
            { name: "Email", value: clinic.email }
          ]}
        />

        <Line width={630} />

        <DataList
          theme="min"
          list={[
            {
              name: "Ліцензії та акредитації",
              value: (
                <ShowMore name="Показати документи">
                  {accreditation && (
                    <div>
                      <H3>Акредитація</H3>
                      <DataList
                        theme="min"
                        list={[
                          {
                            name: "Номер замовлення",
                            value: <Upper>{accreditation.order_no}</Upper>
                          },
                          {
                            name: "Категорія",
                            value: (
                              <DictionaryValue
                                dictionary="ACCREDITATION_CATEGORY"
                                value={accreditation.category}
                              />
                            )
                          },
                          {
                            name: "Термін придатності",
                            value: accreditation.expiry_date
                          },
                          {
                            name: "Випущено",
                            value: accreditation.issued_date
                          },
                          {
                            name: "Дата замовлення",
                            value: accreditation.order_date
                          }
                        ]}
                      />
                      <Line />
                    </div>
                  )}

                  <H3>Ліцензії</H3>

                  <BlocksList>
                    {licenses.map((item, i) => (
                      <li key={i}>
                        <Upper>{item.license_number}</Upper>
                        <p>
                          <ColoredText color="gray">
                            {item.what_licensed}
                          </ColoredText>
                        </p>
                        <div>
                          Виданий: {item.issued_date}, закінчується:{" "}
                          {item.expiry_date}
                        </div>
                        <ColoredText color="gray">{item.issued_by}</ColoredText>
                      </li>
                    ))}
                  </BlocksList>
                </ShowMore>
              )
            }
          ]}
        />

        <Line width={630} />

        <div className={styles.buttons}>
          <div className={styles.buttons__row}>
            <div className={styles.buttons__column}>
              <Button
                onClick={() => this.props.router.goBack()}
                theme="border"
                color="blue"
                icon={<BackIcon width="20" height="12" />}
                block
              >
                Повернутися
              </Button>
            </div>
            {!clinic.nhs_verified &&
              clinic.status !== "CLOSED" && (
                <ShowWithScope scope="legal_entity:nhs_verify">
                  <div className={styles.buttons__column}>
                    <Button
                      onClick={() => this.setState({ showVerifyConfirm: true })}
                      theme="fill"
                      color="green"
                      icon={<CheckRightIcon width="14" />}
                      block
                    >
                      Підтвердити медичний заклад
                    </Button>
                  </div>
                </ShowWithScope>
              )}
          </div>
          {clinic.status === "ACTIVE" && (
            <ShowWithScope scope="legal_entity:deactivate">
              <div className={styles.buttons__row}>
                <div className={styles.buttons__column}>
                  <Button
                    onClick={() =>
                      this.setState({ showDeactivateConfirm: true })
                    }
                    theme="border"
                    color="red"
                    icon={<CloseIcon width="12" height="12" />}
                    block
                  >
                    Скасувати підтвердження
                  </Button>
                </div>
              </div>
            </ShowWithScope>
          )}
        </div>
        <Confirm
          title={`Підтвердити медичний заклад "${clinic.name}"?`}
          active={this.state.showVerifyConfirm}
          theme="success"
          cancel="Скасувати"
          confirm="Так"
          onCancel={() => this.setState({ showVerifyConfirm: false })}
          onConfirm={() => this.verifyClinic()}
        />

        <Confirm
          title={`Деактивувати медичний заклад "${clinic.name}"?`}
          active={this.state.showDeactivateConfirm}
          theme="error"
          cancel="Скасувати"
          confirm="Так"
          onCancel={() => this.setState({ showDeactivateConfirm: false })}
          onConfirm={() => this.deactivateClinic()}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) =>
      Promise.all([dispatch(fetchClinic(id))])
  }),
  connect(
    (state, { params: { id } }) => ({
      clinic: getClinic(state, id)
    }),
    { verifyClinic, deactivateClinic }
  )
)(ClinicDetailPage);
