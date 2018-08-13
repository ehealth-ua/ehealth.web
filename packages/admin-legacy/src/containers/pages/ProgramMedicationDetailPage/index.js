import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import { withRouter } from "react-router";

import Helmet from "react-helmet";

import Line from "../../../components/Line";
import DataList from "../../../components/DataList";
import Checkbox from "../../../components/Checkbox";
import Button from "../../../components/Button";

import BackLink from "../../blocks/BackLink";
import ColoredText from "../../../components/ColoredText";
import ShowMore from "../../blocks/ShowMore";
import DictionaryValue from "../../blocks/DictionaryValue";
import ShowWithScope from "../../blocks/ShowWithScope";

import { getProgramMedication } from "../../../reducers";

import { fetchProgramMedication } from "./redux";
import styles from "./styles.module.css";

class ProgramMedicationDetailPage extends React.Component {
  render() {
    const { program_medication = {} } = this.props;

    return (
      <div id="program-medication-detail-page">
        <Helmet
          title={program_medication.name}
          meta={[{ property: "og:title", content: program_medication.name }]}
        />

        <BackLink
          onClick={() => this.props.router.push("/program-medications")}
        >
          Повернутись до списку учасників программ
        </BackLink>

        <Line />
        <div className={styles.row}>
          <div>
            <DataList
              list={[{ name: "ID Учасника", value: program_medication.id }]}
            />
          </div>
        </div>
        <Line />
        <div className={styles.row}>
          <DataList
            list={[
              {
                name: "Торгівельне найменування",
                value: (
                  <div>
                    <div>
                      <div>{program_medication.medication.name}</div>
                      <div>
                        <ColoredText color="gray">
                          {`ID ${program_medication.medication.id}`}
                        </ColoredText>
                      </div>
                      <br />
                      <DictionaryValue
                        dictionary="MEDICATION_FORM"
                        value={program_medication.medication.form}
                      />
                      <br />
                      <p>
                        {`
                        ${
                          program_medication.medication.ingredients[0].dosage
                            .denumerator_value
                        } `}
                        {`містить
                          ${
                            program_medication.medication.ingredients[0].dosage
                              .numerator_value
                          }
                          ${
                            program_medication.medication.ingredients[0].dosage
                              .numerator_unit
                          }`}
                      </p>
                      <p>
                        {program_medication.medication.ingredients[0]
                          .is_primary && "Діюча речовина"}
                      </p>
                      <br />
                      {program_medication.medication.ingredients.length > 1 && (
                        <ShowMore name="Показати інші складові" show_block>
                          {program_medication.medication.ingredients.map(
                            (i, key) => {
                              if (key === 0) return null;
                              return (
                                <div key={key}>
                                  <p>{i.dosage.denumerator_unit}</p>
                                  <p>
                                    {`${i.dosage.denumerator_value} `}
                                    {`містить ${i.dosage.numerator_value} ${
                                      i.dosage.numerator_unit
                                    }`}
                                  </p>
                                  <p>
                                    {program_medication.medication.ingredients[
                                      key
                                    ].is_primary && "Діюча речовина"}
                                  </p>
                                  <br />
                                </div>
                              );
                            }
                          )}
                        </ShowMore>
                      )}
                    </div>
                    <ShowWithScope scope="medication:read">
                      <div className={styles.right}>
                        <BackLink
                          iconPosition="right"
                          to={`/medications/${
                            program_medication.medication.id
                          }`}
                        >
                          Перейти до торгової назви
                        </BackLink>
                      </div>
                    </ShowWithScope>
                  </div>
                )
              }
            ]}
          />
        </div>
        <Line />
        <div className={styles.row}>
          <div>
            <DataList
              list={[
                {
                  name: "Медична програма",
                  value: (
                    <div>
                      {program_medication.medical_program.name}
                      <br />
                      <ColoredText color="gray">
                        {`ID ${program_medication.medical_program.id}`}
                      </ColoredText>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
        <Line />
        <div className={styles.row}>
          <div>
            <DataList
              list={[
                {
                  name: "Сума відшкодування",
                  value: (
                    <div>
                      {program_medication.reimbursement.type === "fixed" &&
                        "Фіксована"}
                      {program_medication.reimbursement.type === "dinamic" &&
                        "Динамічна"}
                      <br />
                      {`${
                        program_medication.reimbursement.reimbursement_amount
                      } грн.`}
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
        <Line />
        <div className={styles.row}>
          <div>
            <Checkbox checked={program_medication.is_active} />
            Активна
          </div>
        </div>
        <br />
        <div className={styles.row}>
          <div>
            <Checkbox checked={program_medication.medication_request_allowed} />
            Дозвіл на створення рецептів
          </div>
        </div>
        <br />
        <div className="row">
          <ShowWithScope scope="program_medication:write">
            <div>
              <Button
                to={`/program-medications/${program_medication.id}/update`}
              >
                Редагувати
              </Button>
            </div>
          </ShowWithScope>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) =>
      dispatch(fetchProgramMedication(id))
  }),
  connect((state, { params: { id } }) => ({
    program_medication: getProgramMedication(state, id)
  }))
)(ProgramMedicationDetailPage);
