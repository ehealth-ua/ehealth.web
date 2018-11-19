import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import * as Reach from "@reach/router";
import { FlagsProvider, Flag } from "flag";
import { ChevronBottomIcon } from "@ehealth/icons";

import flags from "../flags";

import Ability from "./Ability";
import Link from "./Link";

import { REACT_APP_ADMIN_LEGACY_URL } from "../env";

const Nav = () => (
  <FlagsProvider flags={flags}>
    <NavContainer>
      <NavList>
        <Flag name="features.legacy">
          <NavLinkExternal to="dashboard">Статистика</NavLinkExternal>
          <NavLinkExternal to="persons">Персони</NavLinkExternal>

          <Ability action="read" resource="declaration">
            <NavSection title="Декларації">
              <NavLinkExternal to="declarations">Декларації</NavLinkExternal>
              <NavLinkExternal to="pending-declarations">
                Декларації на розгляді
              </NavLinkExternal>
            </NavSection>
          </Ability>

          <Ability action="read" resource="employee">
            <NavSection title="Співробітники">
              <Ability action="read" resource="employee">
                <NavLinkExternal to="employees">Співробітники</NavLinkExternal>
                <NavLinkExternal to="pending-employees">
                  Співробітники
                  <br />
                  на розгляді
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="read" resource="legal_entity">
            <NavLinkExternal to="clinics-verification">
              Підтвердження медзакладів
            </NavLinkExternal>
          </Ability>

          <NavLinkExternal to="reports">Звіти</NavLinkExternal>

          <NavSection title="Реєстри">
            <Ability action="read" resource="register">
              <NavLinkExternal to="registers">Реєстри</NavLinkExternal>
            </Ability>
            <Ability action="read" resource="register_entry">
              <NavLinkExternal to="registers-entries">
                Записи реєстру
              </NavLinkExternal>
            </Ability>
          </NavSection>

          <NavLinkExternal to="dictionaries">Словники</NavLinkExternal>

          <Ability action="read" resource="global_parameters">
            <NavLinkExternal to="configuration">
              Конфігурація системи
            </NavLinkExternal>
          </Ability>

          <NavSection title="Медикаменти">
            <Ability action="read" resource="innm">
              <NavLinkExternal to="innms">МНН</NavLinkExternal>
            </Ability>
            <Ability action="read" resource="innm_dosage">
              <NavLinkExternal to="innm-dosages">
                Лікарська форма
              </NavLinkExternal>
            </Ability>
            <Ability action="read" resource="medication">
              <NavLinkExternal to="medications">
                Торгівельне найменування
              </NavLinkExternal>
            </Ability>
          </NavSection>

          <NavSection title="Програми">
            <Ability action="read" resource="medical_program">
              <NavLinkExternal to="medical-programs">
                Перелік мед. програм
              </NavLinkExternal>
            </Ability>
            <Ability action="read" resource="program_medication">
              <NavLinkExternal to="program-medications">
                Учасники програм
              </NavLinkExternal>
            </Ability>
          </NavSection>

          <NavSection title="Рецепти">
            <Ability action="read" resource="medication_request">
              <NavLinkExternal to="medication-requests">
                Рецепти
              </NavLinkExternal>
            </Ability>
            <Ability action="read" resource="medication_dispense">
              <NavLinkExternal to="medication-dispenses">
                Відпуски рецептів
              </NavLinkExternal>
            </Ability>
            <Ability action="download" resource="reimbursement_report">
              <NavLinkExternal to="reimbursement-report">Звіт</NavLinkExternal>
            </Ability>
          </NavSection>

          <NavSection title="Користувачі">
            <Ability action="read" resource="bl_user">
              <NavLinkExternal to="black-list-users">
                Заблоковані користувачі
              </NavLinkExternal>
            </Ability>
            <Ability action="read" resource="party_user">
              <NavLinkExternal to="party-users">
                Облікові записи
              </NavLinkExternal>
            </Ability>
          </NavSection>

          <Ability action="reset_authentication_method" resource="person">
            <NavLinkExternal to="reset-authentication-method">
              Скинути метод авторизації
            </NavLinkExternal>
          </Ability>
        </Flag>

        <Ability
          action="read"
          resources={["contract_request", "contract"]}
          loose
        >
          <NavSection title="Договори">
            <Ability action="read" resource="contract_request">
              <NavLink to="/contracts">Перелік договорів</NavLink>
              <NavLink to="/contract-requests">
                Заяви на укладення договору
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>
        <Flag name="features.person">
          <Ability action="read" resource="person">
            <NavSection title="Паціенти">
              <NavLink to="/persons">Пошук паціентів</NavLink>
            </NavSection>
          </Ability>
        </Flag>
        <Ability action="read" resource="legal_entity">
          <NavLink to="/legal-entities">Медзаклади</NavLink>
        </Ability>

        <Ability action="merge" resources={["legal_entity"]} loose>
          <NavSection title="Задачі в процесі виконання">
            <Ability action="merge" resource="legal_entity">
              <NavLink to="/legal-entity-merge-jobs">
                Підпорядкування медзакладів
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>

        <NavLink to="/dictionaries">Словники</NavLink>
      </NavList>
    </NavContainer>
  </FlagsProvider>
);

export default Nav;

const NavLink = ({ to, children }) => (
  <Reach.Match path={`${to}/*`}>
    {({ match }) => (
      <NavItem isCurrent={match}>
        <Link
          to={to}
          color="white"
          fontWeight={match && "bold"}
          display="inline"
          verticalAlign="baseline"
        >
          {children}
        </Link>
      </NavItem>
    )}
  </Reach.Match>
);

const NavLinkExternal = ({ to, href, children }) => {
  const externalProps = href
    ? {
        href,
        rel: "noopener noreferrer",
        target: "_blank"
      }
    : {
        href: `${REACT_APP_ADMIN_LEGACY_URL}/${to}`
      };

  return (
    <NavItem>
      <Link is="a" color="white" {...externalProps}>
        {children}
      </Link>
    </NavItem>
  );
};

const NavSection = ({ title, children }) => (
  <NavItem>
    <details>
      <Link
        is="summary"
        color="white"
        display="inline"
        verticalAlign="baseline"
      >
        {title}
        <ChevronIcon width="7" height="7" />
      </Link>
      <NavList>{children}</NavList>
    </details>
  </NavItem>
);

const NavContainer = styled.nav`
  margin: 80px 0 35px;
`;

const NavList = styled.ul`
  margin: 25px 0 0;
  padding-left: 20px;
`;

const NavItem = styled.li`
  font-weight: ${ifProp("isCurrent", "700", "400")};
  line-height: 16px;
  list-style-image: radial-gradient(
    circle closest-side,
    ${ifProp("isCurrent", "#ff7800", "#fff")},
    ${ifProp("isCurrent", "#ff7800", "#fff")} 90%,
    transparent 100%
  );
  margin-top: 15px;
`;

const ChevronIcon = styled(ChevronBottomIcon)`
  margin-left: 10px;
  details[open] & {
    transform: rotate(180deg);
  }
`;
