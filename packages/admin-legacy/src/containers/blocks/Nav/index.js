import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router";
import { FlagsProvider, Flag } from "flag";

import NavItem from "../../../components/NavItem";
import { DocIcon, LogoutIcon } from "@ehealth/icons";
import { Link as ExternalLink } from "@ehealth/components";

import ShowWithScope from "../ShowWithScope";
import ShowMore from "../ShowMore";

import { logOut } from "./redux";
import env from "../../../env";
import flags from "../../../flags";

import styles from "./styles.module.css";

class Nav extends React.Component {
  componentWillReceiveProps(props) {
    if (props.isOpen) {
      document.documentElement.classList.add(styles.navIsOpen);
    } else {
      document.documentElement.classList.remove(styles.navIsOpen);
    }
  }
  render() {
    const { isOpen } = this.props;

    return (
      <FlagsProvider flags={flags}>
        <nav className={classnames(styles.nav, isOpen && styles.open)}>
          <ul>
            <NavItem to="/dashboard" activeClassName={styles.active}>
              <Link id="dashboard-nav" to="/dashboard">
                Статистика
              </Link>
            </NavItem>

            <Flag
              name="features.person"
              fallbackRender={() => (
                <>
                  <ShowWithScope scope="person:read">
                    <NavItem to="/persons" activeClassName={styles.active}>
                      <Link id="persons-nav" to="/persons">
                        Персони
                      </Link>
                    </NavItem>
                  </ShowWithScope>
                  <ShowWithScope scope="person:reset_authentication_method">
                    <NavItem
                      to="reset-authentication-method"
                      activeClassName={styles.active}
                    >
                      <Link
                        id="reset-authentication-method-nav"
                        to="/reset-authentication-method"
                      >
                        Скинути метод
                        <br />
                        авторизації
                      </Link>
                    </NavItem>
                  </ShowWithScope>
                </>
              )}
            />

            <Flag
              name="features.declaration"
              fallbackRender={() => (
                <ShowWithScope scope="declaration:read">
                  <li>
                    <ShowMore nav name="Декларації">
                      <ul>
                        <NavItem
                          to="declarations"
                          activeClassName={styles.active}
                        >
                          <Link id="declarations-nav" to="/declarations">
                            Декларації
                          </Link>
                        </NavItem>
                        <NavItem
                          to="pending-declarations"
                          activeClassName={styles.active}
                        >
                          <Link
                            id="pending-declarations-nav"
                            to="/pending-declarations"
                          >
                            Декларації на
                            <br /> розгляді
                          </Link>
                        </NavItem>
                      </ul>
                    </ShowMore>
                  </li>
                </ShowWithScope>
              )}
            />

            <Flag
              name="features.employees"
              fallbackRender={() => (
                <ShowWithScope scope="employee:read">
                  <li>
                    <ShowMore nav name="Співробітники">
                      <ShowWithScope scope="employee_request:read">
                        <ul>
                          <NavItem
                            to="employees"
                            activeClassName={styles.active}
                          >
                            <Link id="employees-nav" to="/employees">
                              Співробітники
                            </Link>
                          </NavItem>
                          <NavItem
                            to="pending-employees"
                            activeClassName={styles.active}
                          >
                            <Link
                              id="pending-employees-nav"
                              to="/pending-employees"
                            >
                              Співробітники
                              <br />
                              на розгляді
                            </Link>
                          </NavItem>
                        </ul>
                      </ShowWithScope>
                    </ShowMore>
                  </li>
                </ShowWithScope>
              )}
            />
            <NavItem to="reports" activeClassName={styles.active}>
              <Link id="reports-nav" to="/reports">
                Звіти
              </Link>
            </NavItem>
            <ShowWithScope scope={["register:read", "register_entry:read"]}>
              <li>
                <ShowMore nav name="Реєстри">
                  <ul>
                    <ShowWithScope scope="register:read">
                      <NavItem to="registers" activeClassName={styles.active}>
                        <Link id="registers-nav" to="/registers">
                          Реєстри
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="register_entry:read">
                      <NavItem
                        to="registers-entries"
                        activeClassName={styles.active}
                      >
                        <Link
                          id="registers-entries-nav"
                          to="/registers-entries"
                        >
                          Записи реєстру
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                  </ul>
                </ShowMore>
              </li>
            </ShowWithScope>
            <ShowWithScope scope="global_parameters:read">
              <NavItem to="configuration" activeClassName={styles.active}>
                <Link id="configuration-nav" to="/configuration">
                  Конфігурація системи
                </Link>
              </NavItem>
            </ShowWithScope>

            <Flag
              name="features.medications"
              fallbackRender={() => (
                <ShowWithScope
                  scope={["innm:read", "innm_dosage:read", "medication:read"]}
                >
                  <li>
                    <ShowMore nav name="Медикаменти">
                      <ul>
                        <ShowWithScope scope="innm:read">
                          <NavItem to="innms" activeClassName={styles.active}>
                            <Link id="innms-nav" to="/innms">
                              МНН
                            </Link>
                          </NavItem>
                        </ShowWithScope>
                        <ShowWithScope scope="innm_dosage:read">
                          <NavItem
                            to="innm-dosages"
                            activeClassName={styles.active}
                          >
                            <Link id="innm-dosages-nav" to="/innm-dosages">
                              Лікарська форма
                            </Link>
                          </NavItem>
                        </ShowWithScope>
                        <ShowWithScope scope="medication:read">
                          <NavItem
                            to="medications"
                            activeClassName={styles.active}
                          >
                            <Link id="medications-nav" to="/medications">
                              Торгівельне <br /> найменування
                            </Link>
                          </NavItem>
                        </ShowWithScope>
                      </ul>
                    </ShowMore>
                  </li>
                </ShowWithScope>
              )}
            />
            <Flag
              name="features.medicalPrograms"
              fallbackRender={() => (
                <ShowWithScope
                  scope={["medical_program:read", "program_medication:read"]}
                >
                  <li>
                    <ShowMore nav name="Програми">
                      <ul>
                        <ShowWithScope scope="medical_program:read">
                          <NavItem
                            to="medical-programs"
                            activeClassName={styles.active}
                          >
                            <Link
                              id="medical-programs-nav"
                              to="/medical-programs"
                            >
                              Перелік мед. програм
                            </Link>
                          </NavItem>
                        </ShowWithScope>
                        <ShowWithScope scope="program_medication:read">
                          <NavItem
                            to="program-medications"
                            activeClassName={styles.active}
                          >
                            <Link
                              id="program_medications-nav"
                              to="/program-medications"
                            >
                              Учасники програм
                            </Link>
                          </NavItem>
                        </ShowWithScope>
                      </ul>
                    </ShowMore>
                  </li>
                </ShowWithScope>
              )}
            />
            <ShowWithScope
              scope={[
                "medication_request:read",
                "medication_dispense:read",
                "reimbursement_report:download"
              ]}
            >
              <li>
                <ShowMore nav name="Рецепти">
                  <ul>
                    <ShowWithScope scope="medication_request:read">
                      <NavItem
                        to="medication-requests"
                        activeClassName={styles.active}
                      >
                        <Link
                          id="medication-requests-nav"
                          to="/medication-requests"
                        >
                          Рецепти
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="medication_dispense:read">
                      <NavItem
                        to="medication-dispenses"
                        activeClassName={styles.active}
                      >
                        <Link
                          id="medication-dispenses-nav"
                          to="/medication-dispenses"
                        >
                          Відпуски рецептів
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="reimbursement_report:download">
                      <NavItem
                        to="reimbursement-report"
                        activeClassName={styles.active}
                      >
                        <Link
                          id="reimbursement-report-nav"
                          to="/reimbursement-report"
                        >
                          Звіт
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                  </ul>
                </ShowMore>
              </li>
            </ShowWithScope>
            <ShowWithScope scope={["bl_user:read", "party_user:read"]}>
              <li>
                <ShowMore nav name="Користувачі">
                  <ul>
                    <ShowWithScope scope="bl_user:read">
                      <NavItem
                        to="black-list-users"
                        activeClassName={styles.active}
                      >
                        <Link id="black_list_users" to="/black-list-users">
                          Заблоковані <br /> користувачі
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="party_user:read">
                      <NavItem to="party-users" activeClassName={styles.active}>
                        <Link id="party_users" to="/party-users">
                          Облікові записи
                        </Link>
                      </NavItem>
                    </ShowWithScope>
                  </ul>
                </ShowMore>
              </li>
            </ShowWithScope>
            <ShowWithScope scope={["contract:read", "contract_request:read"]}>
              <li>
                <ShowMore nav name="Договори">
                  <ul>
                    <ShowWithScope scope="contract:read">
                      <NavItem to="contracts" activeClassName={styles.active}>
                        <ExternalLink
                          id="contracts-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/contracts/capitation`}
                        >
                          Перелік договорів
                        </ExternalLink>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="contract_request:read">
                      <NavItem
                        to="contract-requests"
                        activeClassName={styles.active}
                      >
                        <ExternalLink
                          id="contract-requests-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/contract-requests/capitation`}
                        >
                          Заяви на укладення
                          <br /> договору
                        </ExternalLink>
                      </NavItem>
                    </ShowWithScope>
                  </ul>
                </ShowMore>
              </li>
            </ShowWithScope>

            <Flag name="computed.personNavSection">
              <ShowWithScope
                scope={["person:read", "person:reset_authentication_method"]}
              >
                <li>
                  <ShowMore nav name="Паціенти">
                    <ul>
                      <ShowWithScope scope="person:read">
                        <NavItem to="persons" activeClassName={styles.active}>
                          <ExternalLink
                            id="persons-nav"
                            href={`${env.REACT_APP_ADMIN_URL}/persons/search`}
                          >
                            Паціенти
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                      <ShowWithScope scope="person:reset_authentication_method">
                        <NavItem
                          to="reset-authentication-method"
                          activeClassName={styles.active}
                        >
                          <ExternalLink
                            id="persons-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/reset-authentication-method`}
                          >
                            Скинути метод <br /> аутентифікації у<br />{" "}
                            паціентів
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                    </ul>
                  </ShowMore>
                </li>
              </ShowWithScope>
            </Flag>

            <ShowWithScope scope="legal_entity:read">
              <NavItem to="clinics" activeClassName={styles.active}>
                <ExternalLink
                  id="clinics-nav"
                  href={`${env.REACT_APP_ADMIN_URL}/legal-entities/search`}
                >
                  Медзаклади
                </ExternalLink>
              </NavItem>
            </ShowWithScope>

            <Flag name="features.medications">
              <ShowWithScope
                scope={["innm:read", "innm_dosage:read", "medication:read"]}
              >
                <li>
                  <ShowMore nav name="Медикаменти">
                    <ul>
                      <ShowWithScope scope="innm:read">
                        <NavItem to="innms" activeClassName={styles.active}>
                          <ExternalLink
                            id="innms-nav"
                            href={`${env.REACT_APP_ADMIN_URL}/innms/search`}
                          >
                            МНН
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                      <ShowWithScope scope="innm_dosage:read">
                        <NavItem
                          to="innm-dosages"
                          activeClassName={styles.active}
                        >
                          <Link
                            id="innm-dosages-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/innm-dosages/search`}
                          >
                            Лікарська форма
                          </Link>
                        </NavItem>
                      </ShowWithScope>
                      <ShowWithScope scope="medication:read">
                        <NavItem
                          to="medications"
                          activeClassName={styles.active}
                        >
                          <Link
                            id="medications-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/medications/search`}
                          >
                            Торгівельне <br /> найменування
                          </Link>
                        </NavItem>
                      </ShowWithScope>
                    </ul>
                  </ShowMore>
                </li>
              </ShowWithScope>
            </Flag>

            <Flag name="features.medicalPrograms">
              <ShowWithScope
                scope={["medical_program:read", "program_medication:read"]}
              >
                <li>
                  <ShowMore nav name="Медичні програми">
                    <ul>
                      <ShowWithScope scope="medical_program:read">
                        <NavItem
                          to="medical-programs"
                          activeClassName={styles.active}
                        >
                          <ExternalLink
                            id="medical-programs-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/medical-programs/search`}
                          >
                            Перелік мед. програм
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                      <ShowWithScope scope="program_medication:read">
                        <NavItem
                          to="program-medications"
                          activeClassName={styles.active}
                        >
                          <ExternalLink
                            id="program_medications-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/program-medications/search`}
                          >
                            Учасники програм
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                    </ul>
                  </ShowMore>
                </li>
              </ShowWithScope>
            </Flag>

            <Flag name="features.declaration">
              <ShowWithScope scope="declaration:read">
                <li>
                  <ShowMore nav name="Декларації">
                    <ul>
                      <NavItem
                        to="declarations"
                        activeClassName={styles.active}
                      >
                        <ExternalLink
                          id="declarations-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/declarations/search`}
                        >
                          Декларації
                        </ExternalLink>
                      </NavItem>
                      <NavItem
                        to="pending-declarations"
                        activeClassName={styles.active}
                      >
                        <ExternalLink
                          id="pending-declarations-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/pending-declarations/search`}
                        >
                          Декларації
                          <br />
                          на розгляді
                        </ExternalLink>
                      </NavItem>
                    </ul>
                  </ShowMore>
                </li>
              </ShowWithScope>
            </Flag>
            <ShowWithScope scope="legal_entity:merge">
              <li>
                <ShowMore
                  nav
                  name={
                    <>
                      Задачі в процесі
                      <br />
                      виконання
                    </>
                  }
                >
                  <ul>
                    <ShowWithScope scope="legal_entity:merge">
                      <NavItem
                        to="legal-entity-merge-jobs"
                        activeClassName={styles.active}
                      >
                        <ExternalLink
                          id="legal-entity-merge-jobs-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/legal-entity-merge-jobs/search/related`}
                        >
                          Підпорядкування
                          <br /> медзакладів
                        </ExternalLink>
                      </NavItem>
                    </ShowWithScope>
                    <ShowWithScope scope="legal_entity:deactivate">
                      <NavItem
                        to="legal-entity-deactivate-jobs"
                        activeClassName={styles.active}
                      >
                        <ExternalLink
                          id="legal-entity-deactivate-jobs-nav"
                          href={`${
                            env.REACT_APP_ADMIN_URL
                          }/legal-entity-deactivate-jobs/search`}
                        >
                          Закриття
                          <br /> медзакладів
                        </ExternalLink>
                      </NavItem>
                    </ShowWithScope>
                    <Flag name="features.reset_authentication_method">
                      <ShowWithScope scope="persons_auth_reset_job:read">
                        <NavItem
                          to="reset-persons-auth-method-jobs"
                          activeClassName={styles.active}
                        >
                          <ExternalLink
                            id="legal-entity-deactivate-jobs-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/reset-persons-auth-method-jobs/search`}
                          >
                            Скинути метод <br /> аутентифікації у<br />{" "}
                            паціентів
                          </ExternalLink>
                        </NavItem>
                      </ShowWithScope>
                    </Flag>
                  </ul>
                </ShowMore>
              </li>
            </ShowWithScope>

            <Flag name="features.patientsMergeRequest">
              <ShowWithScope scope="merge_request:read">
                <NavItem
                  to="patient-merge-requests"
                  activeClassName={styles.active}
                >
                  <ExternalLink
                    id="patient-merge-requests-nav"
                    href={`${
                      env.REACT_APP_ADMIN_URL
                    }/patient-merge-requests/search`}
                  >
                    Об’єднання пацієнтів
                  </ExternalLink>
                </NavItem>
              </ShowWithScope>
            </Flag>

            <Flag name="features.employees">
              <ShowWithScope scope="employee:read">
                <li>
                  <ShowMore nav name="Співробітники">
                    <ShowWithScope scope="employee_request:read">
                      <ul>
                        <NavItem to="employees" activeClassName={styles.active}>
                          <ExternalLink
                            id="employees-nav"
                            href={`${env.REACT_APP_ADMIN_URL}/employees/search`}
                          >
                            Співробітники
                          </ExternalLink>
                        </NavItem>
                        <NavItem
                          to="employee-requests"
                          activeClassName={styles.active}
                        >
                          <ExternalLink
                            id="employee-requests-nav"
                            href={`${
                              env.REACT_APP_ADMIN_URL
                            }/employee-requests/search`}
                          >
                            Співробітники
                            <br />
                            на розгляді
                          </ExternalLink>
                        </NavItem>
                      </ul>
                    </ShowWithScope>
                  </ShowMore>
                </li>
              </ShowWithScope>
            </Flag>

            <NavItem to="dictionaries" activeClassName={styles.active}>
              <ExternalLink
                id="dictionaries-nav"
                href={`${env.REACT_APP_ADMIN_URL}/dictionaries/search`}
              >
                Словники
              </ExternalLink>
            </NavItem>
          </ul>
          <ul className={styles.down}>
            <li>
              <a
                href="http://docs.uaehealthapi.apiary.io/#"
                rel="noopener noreferrer"
                target="_blank"
              >
                <DocIcon />
                Документація
              </a>
            </li>
            <li className={styles.logout} onClick={() => this.props.logOut()}>
              <LogoutIcon width={10} height={10} />
              Вийти
            </li>
          </ul>
        </nav>
      </FlagsProvider>
    );
  }
}

export default connect(
  state => ({
    location: state.routing
  }),
  { logOut }
)(Nav);
