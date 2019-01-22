import React, { Component } from "react";
import { compose } from "redux";
import { withRouter } from "react-router";

import { reduxForm } from "redux-form";
import Button from "../../../components/Button";
import { SearchIcon } from "@ehealth/icons";

import styles from "./styles.module.css";

class SearchForm extends Component {
  state = {
    initialValues: {},
    showDetailedItems: false
  };

  render() {
    const {
      fields,
      location: { query },
      router
    } = this.props;
    const { initialValues, showDetailedItems } = this.state;
    const showDetailedItemsButton = fields.filter(i => i.detailed).length > 1;

    return (
      <SearchFormContainer
        initialValues={initialValues}
        onSubmit={this.updateFilters}
      >
        <div className={styles.inputs}>
          {fields
            .filter(item => !item.detailed)
            .map(({ component: Field, detailed = false, ...props }, index) => (
              <Field
                key={index}
                {...props}
                query={query}
                initFields={this.initFields}
              />
            ))}
        </div>
        {showDetailedItemsButton && (
          <div className={styles.search}>
            <Button
              icon={<SearchIcon width="10px" height="10px" />}
              theme="link"
              onClick={() =>
                this.setState(() => ({
                  showDetailedItems: !showDetailedItems
                }))
              }
              type="button"
            >
              Розширений пошук
            </Button>
          </div>
        )}
        <div className={styles.buttonGroup}>
          <Button theme="fill" type="submit">
            Застосувати пошук
          </Button>
          <div className={styles.button}>
            <Button
              onClick={() => {
                this.setState({ initialValues: {} });
                router.push({
                  ...this.props.location,
                  query: {}
                });
              }}
              theme="border"
              type="button"
            >
              Скинути пошук
            </Button>
          </div>
        </div>
        {showDetailedItems && (
          <div className={styles.fields}>
            {fields
              .filter(item => item.detailed)
              .map(({ component: Field, detailed = true, ...props }, index) => (
                <Field
                  key={index}
                  {...props}
                  query={query}
                  initFields={this.initFields}
                />
              ))}
            <div className={styles.buttonGroup}>
              <Button theme="fill" type="submit">
                Застосувати пошук
              </Button>
              <div className={styles.button}>
                <Button
                  onClick={() => {
                    this.setState({ initialValues: {} });
                    router.push({
                      ...this.props.location,
                      query: {}
                    });
                  }}
                  theme="border"
                  type="button"
                >
                  Скинути пошук
                </Button>
              </div>
            </div>
            <div
              className={styles.overlay}
              onClick={() =>
                this.setState(({ showDetailedItems }) => ({
                  showDetailedItems: !showDetailedItems
                }))
              }
            />
          </div>
        )}
      </SearchFormContainer>
    );
  }

  initFields = nextValues => {
    this.setState(({ initialValues }) => ({
      initialValues: { ...initialValues, ...nextValues }
    }));
  };

  updateFilters = values => {
    const {
      location: { query, ...location },
      router
    } = this.props;

    this.setState({ initialValues: values });

    const nextQuery = Object.entries({ ...query, ...values })
      .filter(([_, value]) => typeof value === "boolean" || Boolean(value))
      .reduce(
        (query, [key, value]) => Object.assign(query, { [key]: value }),
        {}
      );

    router.push({
      ...location,
      query: { ...nextQuery, page: 1 }
    });

    if (this.state.showDetailedItems) {
      this.setState(({ showDetailedItems }) => ({
        showDetailedItems: !showDetailedItems
      }));
    }
  };
}

export default withRouter(SearchForm);

const SearchFormComponent = ({ handleSubmit, children }) => (
  <form className={styles.form} onSubmit={handleSubmit}>
    {children}
  </form>
);

const SearchFormContainer = compose(
  withRouter,
  reduxForm({
    form: "search-form",
    enableReinitialize: true
  })
)(SearchFormComponent);
