import React from "react";
import format from "date-fns/format";

import Pagination from "../../../components/Pagination";

import { ListTable } from "../../../components/List";
import DataList from "../../../components/DataList";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { Popup } from "../../../components/Popup";
import Line from "../../../components/Line";

const capitationData = [
  {
    attr: "0-5",
    age: "Від 0 до 5 років",
    mountainGroup: null,
    notMountainGroup: null
  },
  {
    attr: "6-17",
    age: "Від 6 до 17 років",
    mountainGroup: null,
    notMountainGroup: null
  },
  {
    attr: "18-39",
    age: "Від 18 до 39 років",
    mountainGroup: null,
    notMountainGroup: null
  },
  {
    attr: "40-65",
    age: "Від 40 до 64 років",
    mountainGroup: null,
    notMountainGroup: null
  },
  {
    attr: "65+",
    age: "65 років",
    mountainGroup: null,
    notMountainGroup: null
  }
];

export default class ReportsList extends React.Component {
  state = {
    isOpenedPopup: false,
    capitationDetail: {}
  };
  render() {
    const { reports, paging } = this.props;
    if (!reports) return null;
    const {
      capitationDetail: { report = [], contracts = [] },
      isOpenedPopup
    } = this.state;
    contracts.map(contract =>
      contract.details.map(item => {
        if (item.mountain_group) {
          Object.entries(item.attributes).map(([key, value]) => {
            capitationData.map((i, k) => {
              if (key === i.attr) {
                capitationData[k].mountainGroup = value;
              }
              return null;
            });
            return null;
          });
        } else {
          Object.entries(item.attributes).map(([key, value]) => {
            capitationData.map((i, k) => {
              if (key === i.attr) {
                capitationData[k].notMountainGroup = value;
              }
              return null;
            });
            return null;
          });
        }
        return null;
      })
    );
    return (
      <div>
        <ListTable id="reports-table">
          <Table
            columns={[
              { key: "edrpou", title: "ЄДРПОУ" },
              { key: "id", title: "ID звіту" },
              { key: "date", title: "Дата рахунку" },
              { key: "action", title: "Дія" }
            ]}
            data={reports.map(i => ({
              edrpou: i.edrpou,
              id: i.report_id,
              date: format(i.billing_date, "DD/MM/YYYY"),
              action: (
                <Button
                  id={`show-contract-detail-button-${i.id}`}
                  theme="link"
                  onClick={() =>
                    this.setState({
                      isOpenedPopup: true,
                      capitationDetail: {
                        report: {
                          edrpou: i.edrpou,
                          id: i.report_id,
                          date: format(i.billing_date, "DD/MM/YYYY")
                        },
                        contracts: i.capitation_contracts
                      }
                    })
                  }
                >
                  Детально
                </Button>
              )
            }))}
          />
        </ListTable>
        <Pagination
          currentPage={paging.page_number}
          totalPages={paging.total_pages}
        />
        <Popup
          title={<b>{`Деталі звіту за ${report.date}`}</b>}
          active={isOpenedPopup}
          onClose={() => this.setState({ isOpenedPopup: false })}
        >
          <div style={{ textAlign: "left" }}>
            <Line />
            <DataList
              list={[
                {
                  name: "Номер звіту",
                  value: report.id
                },
                {
                  name: "ЄДРПОУ",
                  value: report.edrpou
                }
              ]}
            />
            {contracts.map((item, key) => {
              return (
                <div key={key}>
                  <Line />
                  <DataList
                    list={[
                      {
                        name: "ID договору",
                        value: item.contract_id
                      },
                      {
                        name: "Номер договору",
                        value: item.contract_number
                      }
                    ]}
                  />
                  <Line />
                  <Table
                    columns={[
                      { key: "age", title: "Вікова група паціентів" },
                      { key: "mountainGroup", title: "Гірська група" },
                      { key: "notMountainGroup", title: "Не гірська група" }
                    ]}
                    data={capitationData.map(
                      ({ age, mountainGroup, notMountainGroup }) => ({
                        age,
                        mountainGroup,
                        notMountainGroup
                      })
                    )}
                  />
                </div>
              );
            })}
          </div>
        </Popup>
      </div>
    );
  }
}
