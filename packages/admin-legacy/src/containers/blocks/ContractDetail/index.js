import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router";

import Helmet from "react-helmet";
import classnames from "classnames";
import printIframe from "print-iframe";

import { PdfIcon } from "@ehealth/icons";
import Line from "../../../components/Line";
import DataList from "../../../components/DataList";
import InlineList from "../../../components/InlineList";
import WorkingHours from "../../../components/WorkingHours";
import { H1 } from "../../../components/Title";

import BackLink from "../BackLink";
import AddressesList from "../AddressesList";
import DictionaryValue from "../DictionaryValue";
import ShowWithScope from "../ShowWithScope";

import { CONTRACT_STATUS } from "../../../helpers/enums";
import { backUrl } from "../../../helpers/url";

import styles from "./styles.module.css";

const PrintLink = ({
  printIframe,
  printoutContent,
  id,
  getPrintoutContent
}) => {
  if (printoutContent) {
    return (
      <div className={styles.link}>
        <span onClick={() => printIframe(printoutContent)}>
          Дивитись друковану форму
        </span>
      </div>
    );
  }
  return (
    <div className={styles.link}>
      <span onClick={() => getPrintoutContent(id)}>
        Дивитись друковану форму
      </span>
    </div>
  );
};

class ContractDetail extends React.Component {
  componentWillMount() {
    const {
      contract: { id, status },
      getPrintoutContent,
      type
    } = this.props;
    if (
      type === "contract" ||
      (type === "contractRequest" && status === "PENDING_NHS_SIGN")
    ) {
      getPrintoutContent(id);
    }
  }
  render() {
    if (!this.props.contract) return null;
    const { contract = {}, getPrintoutContent, router, type } = this.props;
    const fullName = obj =>
      [obj.last_name, obj.first_name, obj.second_name].join(" ");

    const getDivisionName = id => {
      if (contract.contractor_divisions.length) {
        const { name } = contract.contractor_divisions.find(i => id === i.id);
        return name;
      }
    };
    const contractorDivisions =
      contract.contractor_divisions &&
      contract.contractor_divisions.filter(Boolean);

    const backLocationPath = backUrl(router);

    return (
      <div>
        <Helmet
          title={"Деталі договору"}
          meta={[{ property: "og:title", content: "Деталі договору" }]}
        />

        <BackLink onClick={() => router.push(backLocationPath)}>
          {type === "contractRequest"
            ? "Назад до списку заяв"
            : "Назад до списку договорів"}
        </BackLink>

        <Line />
        {type === "contractRequest" ? (
          contract.status === "SIGNED" ||
          contract.status === "NHS_SIGNED" ||
          contract.status === "PENDING_NHS_SIGN" ? (
            contract.status === "NHS_SIGNED" || contract.status === "SIGNED" ? (
              <PrintLink
                printIframe={printIframe}
                printoutContent={contract.printout_content}
              />
            ) : (
              <PrintLink
                printIframe={printIframe}
                getPrintoutContent={getPrintoutContent}
                id={contract.id}
                printoutContent={contract.printout_content}
              />
            )
          ) : null
        ) : (
          <PrintLink
            printoutContent={contract.printout_content}
            printIframe={printIframe}
          />
        )}
        <DataList
          list={[
            {
              name: <b>Дія договору</b>,
              value: contract.is_suspended && <b>Призупинено</b>
            },
            {
              name:
                type === "contractRequest"
                  ? "Статус запиту"
                  : "Статус договору",
              value: contract.status && CONTRACT_STATUS[contract.status].title
            },
            {
              name: "Номер договору",
              value: contract.contract_number
            },
            {
              name:
                type === "contractRequest"
                  ? "ID заяви на укладення договору"
                  : "ID договору",
              value: contract.id
            }
          ]}
        />

        <Line />
        <div
          className={classnames({
            [styles.grey]:
              contract.status === "TERMINATED" ||
              contract.status === "APPROVED" ||
              contract.status === "DECLINE"
          })}
        >
          {contract.contractor_legal_entity && (
            <div>
              <H1>I. Медзаклад</H1>

              <DataList
                list={[
                  {
                    name: "ID медзакладу",
                    value: (
                      <div className={styles.row}>
                        <div>{contract.contractor_legal_entity.id}</div>
                        <ShowWithScope scope="legal_entity:read">
                          <div className={styles.right}>
                            <BackLink
                              iconPosition="right"
                              to={`/clinics/${
                                contract.contractor_legal_entity.id
                              }`}
                            >
                              Перейти до медичного закладу
                            </BackLink>
                          </div>
                        </ShowWithScope>
                      </div>
                    )
                  },
                  {
                    name: "Назва",
                    value: contract.contractor_legal_entity.name
                  },
                  {
                    name: "Адреса",
                    value: (
                      <AddressesList
                        list={contract.contractor_legal_entity.addresses}
                      />
                    )
                  },
                  {
                    name: "ЄДРПОУ",
                    value: contract.contractor_legal_entity.edrpou
                  }
                ]}
              />
              <Line />
            </div>
          )}
          {contract.contractor_payment_details && (
            <div>
              <H1>Реквізити надавача</H1>

              <DataList
                list={[
                  {
                    name: "Розрахунковий рахунок",
                    value: contract.contractor_payment_details.payer_account
                  },
                  {
                    name: "Назва банку",
                    value: contract.contractor_payment_details.bank_name
                  },
                  {
                    name: "МФО",
                    value: contract.contractor_payment_details.MFO
                  }
                ]}
              />
              <Line />
            </div>
          )}
          {contract.contractor_owner && (
            <div>
              <DataList
                list={[
                  {
                    name: "ID підписанта",
                    value: (
                      <div className={styles.row}>
                        <div>{contract.contractor_owner.id}</div>
                        <ShowWithScope scope="employee:read">
                          <div className={styles.right}>
                            <BackLink
                              iconPosition="right"
                              to={`/employees/${contract.contractor_owner.id}`}
                            >
                              Перейти до працівника
                            </BackLink>
                          </div>
                        </ShowWithScope>
                      </div>
                    )
                  },
                  {
                    name: "Повне і'мя",
                    value: fullName(contract.contractor_owner.party)
                  },
                  {
                    name: "Що діє на підставі",
                    value: contract.contractor_base
                  }
                ]}
              />
              <Line />
            </div>
          )}
          <DataList
            list={[
              {
                name: "Термін дії договору",
                value: `З ${contract.start_date} по ${contract.end_date}`
              },
              {
                name: "Кількість осіб, що обслуговуються медзакладом",
                value: `${contract.contractor_rmsp_amount} (станом на 01.01.18)`
              }
            ]}
          />
          {contractorDivisions && contractorDivisions.length ? (
            <div>
              <Line />
              <H1>II. Додаток 2</H1>
              <div>
                {contractorDivisions.map((i, key) => (
                  <div key={key}>
                    {key !== 0 && <Line />}
                    <div className={styles.forwardLink}>
                      <BackLink
                        to={`/contract-requests/${
                          contract.id
                        }/division-employees/${i.id}`}
                        iconPosition={"right"}
                      >
                        Показати співробітників
                      </BackLink>
                    </div>
                    <H1>Відділення</H1>
                    <DataList
                      list={[
                        {
                          name: "ID відділення",
                          value: i.id
                        },
                        {
                          name: "Назва",
                          value: i.name
                        },
                        {
                          name: "Адреса",
                          value: <AddressesList list={i.addresses} />
                        },
                        {
                          name: "Гірський регіон",
                          value: i.mountain_group ? "Так" : "Ні"
                        },
                        {
                          name: "Телефон",
                          value: (
                            <InlineList
                              list={i.phones.map(item => item.number)}
                            />
                          )
                        },
                        {
                          name: "Email",
                          value: i.email
                        },
                        {
                          name: "Графік роботи",
                          value: i.working_hours && (
                            <WorkingHours workingHours={i.working_hours} />
                          )
                        }
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {contract.external_contractors &&
          contract.external_contractors.length ? (
            <div>
              <Line />
              <H1>Підрядники</H1>
              <div>
                {contract.external_contractors.map((i, key) => {
                  return (
                    <div key={key}>
                      {key !== 0 && <Line />}
                      <DataList
                        list={[
                          {
                            name: "Номер договору",
                            value: `№${i.contract.number} від ${
                              i.contract.issued_at
                            } по ${i.contract.expires_at}`
                          },
                          {
                            name: "Заклад",
                            value: i.legal_entity.id && (
                              <div className={styles.row}>
                                <div>
                                  <div>
                                    {i.legal_entity.name && (
                                      <div>{i.legal_entity.name}</div>
                                    )}
                                    <div>ID {i.legal_entity.id}</div>
                                  </div>
                                </div>
                                <ShowWithScope scope="legal_entity:read">
                                  <div className={styles.right}>
                                    <BackLink
                                      iconPosition="right"
                                      to={`/clinics/${i.legal_entity.id}`}
                                    >
                                      Перейти до медичного закладу
                                    </BackLink>
                                  </div>
                                </ShowWithScope>
                              </div>
                            )
                          }
                        ]}
                      />
                      <br />
                      <DataList
                        list={[
                          {
                            name: "Відділення",
                            value: (
                              <div>
                                <div>
                                  {i.divisions.map((item, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className={styles.divisionList}
                                      >
                                        <div>{getDivisionName(item.id)}</div>
                                        <div>ID {item.id}</div>
                                        <div>
                                          Послуга, що надається:{" "}
                                          <DictionaryValue
                                            dictionary="MEDICAL_SERVICE"
                                            value={item.medical_service}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )
                          }
                        ]}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {contract.urgent && contract.urgent.length ? (
            <div>
              <Line />
              <H1>Документи</H1>
              {contract.urgent.map((item, i) => (
                <div className={styles.docLinkWrapper} key={i}>
                  <PdfIcon width="14" />
                  <a className={styles.docLink} href={item.url} target="_blank">
                    <DictionaryValue
                      dictionary="CONTRACT_DOCUMENT"
                      value={item.type}
                    />
                  </a>
                </div>
              ))}
              <Line />
            </div>
          ) : null}
          {contract.status !== "NEW" &&
            contract.nhs_signer && (
              <div>
                <DataList
                  list={[
                    {
                      name: "Замовник",
                      value: contract.nhs_legal_entity.name
                    },
                    {
                      name: "Підписант зі сторони замовника",
                      value: (
                        <div className={styles.row}>
                          <div>
                            <div>{fullName(contract.nhs_signer.party)}</div>
                            <div>ID {contract.nhs_signer.id}</div>
                          </div>
                          <ShowWithScope scope="employee:read">
                            <div className={styles.right}>
                              <BackLink
                                iconPosition="right"
                                to={`/employees/${contract.nhs_signer.id}`}
                              >
                                Перейти до працівника
                              </BackLink>
                            </div>
                          </ShowWithScope>
                        </div>
                      )
                    },
                    {
                      name: "Що діє на підставі",
                      value: contract.nhs_signer_base
                    },
                    {
                      name: "Ціна договору",
                      value: `${contract.nhs_contract_price.toLocaleString(
                        "uk-UA"
                      )} грн`
                    },
                    {
                      name: "Спосіб оплати",
                      value: (
                        <DictionaryValue
                          dictionary="CONTRACT_PAYMENT_METHOD"
                          value={contract.nhs_payment_method}
                        />
                      )
                    },
                    {
                      name: "Місто укладення договору",
                      value: contract.issue_city
                    }
                  ]}
                />
                <Line />
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default compose(withRouter)(ContractDetail);
