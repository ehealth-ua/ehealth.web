import React from "react";
import format from "date-fns/format";
import { compose } from "redux";
import { withRouter } from "react-router";

import Helmet from "react-helmet";

import Line from "../../../components/Line";
import { H3 } from "../../../components/Title";
import DataList from "../../../components/DataList";
import InlineList from "../../../components/InlineList";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

import BackLink from "../BackLink";
import AddressesList from "../AddressesList";
import DictionaryValue from "../DictionaryValue";
import ShowWithScope from "../ShowWithScope";

import styles from "./styles.module.css";

const DATE_FORMAT = "DD/MM/YYYY";

const DeclarationDetail = ({ declaration, onTerminate, router }) => {
  if (!Object.keys(declaration).length) return null;
  const fullName = [
    declaration.person.last_name,
    declaration.person.first_name,
    declaration.person.second_name
  ].join(" ");

  return (
    <div>
      <Helmet
        title={`Декларація ${fullName}`}
        meta={[{ property: "og:title", content: `Декларація ${fullName}` }]}
      />

      <BackLink onClick={() => router.goBack()}>
        Повернутися до списку декларацій
      </BackLink>

      <Line />

      <DataList
        list={[
          {
            name: "Ідентифікатор декларації",
            value: declaration.id
          },
          {
            name: "Ідентифікатор запиту на створення декларації",
            value: declaration.declaration_request_id
          }
        ]}
      />

      <Line width={630} />

      <DataList
        theme="min"
        list={[
          {
            name: "Дата початку",
            value: format(declaration.start_date, DATE_FORMAT)
          },
          {
            name: "Кінцева дата",
            value: format(declaration.end_date, DATE_FORMAT)
          },
          {
            name: "Статус",
            value: (
              <div>
                {declaration.status === "terminated" ||
                declaration.status === "closed" ? (
                  <div>
                    {declaration.status} <br />
                    {`Причина: ${
                      declaration.reason_description
                        ? declaration.reason_description
                        : "відсутня"
                    }`}
                  </div>
                ) : (
                  <div>
                    {declaration.status}

                    <ShowWithScope scope="declaration:terminate">
                      <TerminateForm onTerminate={onTerminate} />
                    </ShowWithScope>
                  </div>
                )}
              </div>
            )
          },
          {
            name: "Область дії",
            value: (
              <DictionaryValue
                dictionary="SPECIALITY_TYPE"
                value={(declaration.scope || "").toUpperCase()}
              />
            )
          }
        ]}
      />

      <Line />

      <DataList
        list={[
          { name: "Ідентифікатор відділення", value: declaration.division.id }
        ]}
      />

      <Line width={630} />

      <DataList
        theme="min"
        list={[
          {
            name: "Тип відділення",
            value: (
              <DictionaryValue
                dictionary="DIVISION_TYPE"
                value={(declaration.division.type || "").toUpperCase()}
              />
            )
          },
          { name: "Назва відділення", value: declaration.division.name },
          {
            name: "Телефони",
            value: (
              <InlineList
                list={(declaration.division.phones || []).map(
                  item => item.number
                )}
              />
            )
          },
          { name: "Email", value: declaration.division.email },
          {
            name: "Адреси",
            value: <AddressesList list={declaration.division.addresses} />
          }
        ]}
      />

      <Line />

      <div className={styles.row}>
        <div>
          <DataList
            list={[
              {
                name: "Ідентифікатор працівника",
                value: declaration.employee.id
              }
            ]}
          />
        </div>
        <ShowWithScope scope="employee:read">
          <div className={styles.right}>
            <BackLink
              iconPosition="right"
              to={`/employees/${declaration.employee.id}`}
            >
              Перейти до працівника
            </BackLink>
          </div>
        </ShowWithScope>
      </div>

      {declaration.employee.party && <Line />}

      <div className={styles.strong}>
        {declaration.employee.party && (
          <DataList
            theme="min"
            list={[
              {
                name: "Повне Ім’я",
                value: `${declaration.employee.party.last_name} ${
                  declaration.employee.party.first_name
                } ${declaration.employee.party.second_name}`
              },
              { name: "ІНН", value: declaration.employee.party.tax_id },
              {
                name: "Позиція",
                value: (
                  <DictionaryValue
                    dictionary="POSITION"
                    value={declaration.employee.position}
                  />
                )
              }
            ]}
          />
        )}
      </div>

      <Line />

      <div className={styles.row}>
        <div>
          <DataList
            list={[
              {
                name: "Ідентифікатор медичного закладу",
                value: declaration.legal_entity.id
              }
            ]}
          />
        </div>
        <ShowWithScope scope="legal_entity:read">
          <div className={styles.right}>
            <BackLink
              iconPosition="right"
              to={`/clinics/${declaration.legal_entity.id}`}
            >
              Перейти до медичного закладу
            </BackLink>
          </div>
        </ShowWithScope>
      </div>

      <Line />

      <DataList
        list={[
          { name: "Повне Ім’я", value: declaration.legal_entity.name },
          { name: "ЕДРПОУ", value: declaration.legal_entity.edrpou },
          {
            name: "Адреса регістрації",
            value: (
              <div className={styles.address}>
                {declaration.legal_entity.addresses && (
                  <div>
                    <p>
                      {declaration.legal_entity.addresses[0].zip},{" "}
                      {declaration.legal_entity.addresses[0].area} область,{" "}
                      місто {declaration.legal_entity.addresses[0].settlement},
                    </p>
                    <p>
                      {declaration.legal_entity.addresses[0].street}
                      ,&nbsp;
                      {declaration.legal_entity.addresses[0].building}
                    </p>
                  </div>
                )}
                <small>Фактична адреса співпадає з адресою реєстрації</small>
              </div>
            )
          }
        ]}
      />

      <Line />

      {declaration.person.id && (
        <DataList
          list={[
            { name: "Ідентифікатор людини", value: declaration.person.id }
          ]}
        />
      )}

      <DataList
        theme="min"
        list={[
          {
            name: "Повне Ім’я",
            value: fullName
          },
          { name: "ІНН", value: declaration.person.tax_id },
          {
            name: "Телефони",
            value: (
              <InlineList
                list={(declaration.person.phones || []).map(
                  item => item.number
                )}
              />
            )
          }
        ]}
      />

      <Line width={630} />

      <DataList
        theme="min"
        list={[
          {
            name: "Дата народження",
            value: format(declaration.person.birth_date, "DD/MM/YYYY")
          },
          {
            name: "Народжений в",
            value: [
              declaration.person.birth_country,
              declaration.person.birth_settlement
            ]
              .filter(i => i)
              .join(" ,")
          }
        ]}
      />

      {declaration.person.documents && (
        <div>
          <Line />
          <H3>Документи:</H3>

          <DataList
            theme="min"
            list={declaration.person.documents.map(item => ({
              name: (
                <DictionaryValue dictionary="DOCUMENT_TYPE" value={item.type} />
              ),
              value: item.number
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default compose(withRouter)(DeclarationDetail);

class TerminateForm extends React.Component {
  state = {
    input: ""
  };
  render() {
    return (
      <div className={styles.row}>
        <div>
          <Input onChange={e => this.setState({ input: e.target.value })} />
        </div>
        <div>
          <Button
            onClick={() => this.props.onTerminate(this.state.input)}
            theme="border"
            color="red"
            size="small"
          >
            Деактивувати
          </Button>
        </div>
      </div>
    );
  }
}
