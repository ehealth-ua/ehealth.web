import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import { ListFilter, ListTable } from "../../../components/List";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Select from "../../../components/Select";

import {
  getDictionaries,
  getDictionariesNames,
  getDictionariesLabels
} from "../../../reducers";

import { fetchDictionaries } from "../../../redux/dictionaries";

class DictionariesPage extends React.Component {
  state = {
    name: null,
    label: []
  };

  render() {
    const { dictionaries = {}, names = [], labels = [] } = this.props;

    return (
      <div id="dictionaries-page">
        <Helmet
          title="Словники"
          meta={[{ property: "og:title", content: "Словники" }]}
        />

        <H1>Словники</H1>

        <div>
          <ListFilter>
            <div>
              <Select
                placeholder="Фільтрувати за назвою"
                options={[{ name: null, title: "Усі" }, ...names]}
                onChange={name => this.setState({ name })}
              />
            </div>
            <div>
              <Select
                placeholder="Фільтрувати за тегом"
                options={labels.map(name => ({ name, title: name }))}
                multiple
                onChange={label => this.setState({ label })}
              />
            </div>
          </ListFilter>

          <p>Виберіть словник для редагування</p>

          <ListTable id="templates-table">
            <Table
              columns={[
                { key: "name", title: "Назва словника" },
                { key: "edit", title: "Редагувати" }
              ]}
              data={Object.keys(dictionaries)
                .filter(
                  name =>
                    (this.state.name ? name === this.state.name : true) &&
                    (this.state.label.length
                      ? dictionaries[name].labels.some(
                          label => ~this.state.label.indexOf(label)
                        )
                      : true)
                )
                .map(dictionaryName => ({
                  name: <div>{dictionaryName}</div>,
                  edit: (
                    <Button
                      id={`edit-template-button-${dictionaryName}`}
                      theme="link"
                      to={`/dictionaries/${dictionaryName}`}
                    >
                      Переглянути словник
                    </Button>
                  )
                }))}
            />
          </ListTable>
        </div>
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch }) => dispatch(fetchDictionaries())
  }),
  connect(
    state => ({
      dictionaries: getDictionaries(state),
      names: getDictionariesNames(state),
      labels: getDictionariesLabels(state)
    }),
    { fetchDictionaries }
  )
)(DictionariesPage);
