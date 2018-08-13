import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import ShowBy from "../../blocks/ShowBy";
import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import SelectFilterField from "../../forms/SelectFilterField";
import ReportsList from "../../blocks/ReportsList";

import { H1, H2 } from "../../../components/Title";
import { ListShowBy } from "../../../components/List";

import {
  getCapitationReports,
  getCapitationReportsList
} from "../../../reducers";
import { fetchCapitationReports, fetchCapitationReportsList } from "./redux";
import uuidValidate from "../../../helpers/validators/uuid-validate";

class ReportsListPage extends React.Component {
  searchFields = () => {
    const selectArray = [];
    this.props.capitation_reports_list.map(item => {
      return selectArray.push({ title: item.billing_date, name: item.id });
    });
    return [
      {
        component: SearchFilterField,
        filters: [
          {
            name: "edrpou",
            title: "За ЄДРПОУ"
          },
          {
            name: "report_id",
            title: "За ID звіту",
            validate: uuidValidate
          }
        ]
      },
      {
        component: SearchFilterField,
        detailed: true,
        hasSelect: false,
        labelText: "За ЄДРПОУ",
        placeholder: "Введіть ЄДРПОУ",
        filters: [
          {
            name: "edrpou"
          }
        ]
      },
      {
        component: SearchFilterField,
        detailed: true,
        hasSelect: false,
        labelText: "За ID звіту",
        placeholder: "Введіть ID",
        filters: [
          {
            name: "report_id",
            validate: uuidValidate
          }
        ]
      },
      {
        component: SelectFilterField,
        labelText: "За датою",
        placeholder: "2018-07-01",
        name: "report_id",
        options: selectArray,
        detailed: true
      }
    ];
  };
  render() {
    const { capitation_reports = [], paging = {}, location } = this.props;

    return (
      <div id="clinics-list-page">
        <Helmet
          title="Звіти"
          meta={[{ property: "og:title", content: "Звіти" }]}
        />

        <H1>Звіти</H1>

        <div>
          <H2>Пошук звітів</H2>
          <SearchForm fields={this.searchFields()} location={location} />
        </div>

        <ListShowBy>
          <ShowBy location={location} />
        </ListShowBy>

        <ReportsList
          reports={capitation_reports}
          paging={paging}
          location={location}
        />
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      Promise.all([
        dispatch(fetchCapitationReports({ page_size: 5, ...query })),
        dispatch(fetchCapitationReportsList({}))
      ])
  }),
  connect(state => ({
    ...state.pages.ReportsListPage,
    capitation_reports: getCapitationReports(
      state,
      state.pages.ReportsListPage.capitation_reports
    ),
    capitation_reports_list: getCapitationReportsList(
      state,
      state.pages.ReportsListPage.capitation_reports_list
    )
  }))
)(ReportsListPage);
