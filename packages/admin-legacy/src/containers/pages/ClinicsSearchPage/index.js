import React from "react";

import Helmet from "react-helmet";

import { H1, H2 } from "../../../components/Title";
import Button from "../../../components/Button";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import uuidValidate from "../../../helpers/validators/uuid-validate";

import styles from "./styles.module.css";

const ClinicsSearchPage = ({ location }) => (
  <div id="clinics-search-page">
    <Helmet
      title="Пошук медичного закладу для перевірки"
      meta={[
        {
          property: "og:title",
          content: "Пошук медичного закладу для перевірки"
        }
      ]}
    />

    <H1>Підтвердження МЗ</H1>

    <H2>Пошук медичного закладу для перевірки</H2>

    <div className={styles.search}>
      <SearchForm
        fields={[
          {
            component: SearchFilterField,
            labelText: "Знайти медичний заклад",
            filters: [
              { name: "edrpou", title: "За ЄДРПОУ" },
              {
                name: "legal_entity_id",
                title: "За ID юридичної особи",
                validate: uuidValidate
              },
              {
                name: "settlement_id",
                title: "За ID міста",
                validate: uuidValidate
              }
            ]
          }
        ]}
        location={{ ...location, pathname: "/clinics-verification/list" }}
      />
    </div>
    <div>
      <Button to="/clinics" theme="link">
        <span className={styles.link}>Перейти до списку медичних закладiв</span>
      </Button>
    </div>
  </div>
);

export default ClinicsSearchPage;
