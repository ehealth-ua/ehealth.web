import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import * as Reach from "@reach/router";
import { FlagsProvider, Flag } from "flag";
import { Trans } from "@lingui/macro";
import { ChevronBottomIcon } from "@ehealth/icons";

import flags from "../flags";

import Ability from "./Ability";
import Link from "./Link";

import env from "../env";

const Nav = () => (
  <FlagsProvider flags={flags}>
    <NavContainer>
      <NavList>
        <Flag name="features.legacy">
          <NavLinkExternal to="dashboard">
            <Trans id="nav.statistic">Statistic</Trans>
          </NavLinkExternal>

          <Ability action="read" resource="person">
            <NavLinkExternal to="persons">
              <Trans id="nav.persons">Persons</Trans>
            </NavLinkExternal>
          </Ability>

          <Ability action="read" resource="declaration">
            <NavSection
              title={<Trans id="nav.declarations">Declarations</Trans>}
            >
              <NavLinkExternal to="declarations">
                <Trans id="nav.declarations">Declarations</Trans>
              </NavLinkExternal>
              <NavLinkExternal to="pending-declarations">
                <Trans id="nav.pending_declarations">
                  Pending declarations
                </Trans>
              </NavLinkExternal>
            </NavSection>
          </Ability>

          <Ability action="read" resource="employee">
            <NavSection title={<Trans id="nav.employees">Employees</Trans>}>
              <Ability action="read" resource="employee">
                <NavLinkExternal to="employees">
                  <Trans id="nav.employees">Employees</Trans>
                </NavLinkExternal>
                <NavLinkExternal to="pending-employees">
                  <Trans id="nav.pending_employees">Pending employees</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="read" resource="legal_entity">
            <NavLinkExternal to="clinics-verification">
              <Trans id="nav.clinics_verification">Clinics verification</Trans>
            </NavLinkExternal>
          </Ability>

          <NavLinkExternal to="reports">
            <Trans id="nav.reports">Reports</Trans>
          </NavLinkExternal>

          <Ability
            action="read"
            resources={["register", "register_entry"]}
            loose
          >
            <NavSection title={<Trans id="nav.registers">Registers</Trans>}>
              <Ability action="read" resource="register">
                <NavLinkExternal to="registers">
                  <Trans id="nav.registers">Registers</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="register_entry">
                <NavLinkExternal to="registers-entries">
                  <Trans id="nav.registers_entries">Registers entries</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <NavLinkExternal to="dictionaries">
            <Trans id="nav.dictionaries">Dictionaries</Trans>
          </NavLinkExternal>

          <Ability action="read" resource="global_parameters">
            <NavLinkExternal to="configuration">
              <Trans id="nav.configuration">Configuration</Trans>
            </NavLinkExternal>
          </Ability>

          <Ability
            action="read"
            resources={["innm", "innm_dosage", "medication"]}
            loose
          >
            <NavSection title={<Trans id="nav.medicines">Medicines</Trans>}>
              <Ability action="read" resource="innm">
                <NavLinkExternal to="innms">
                  <Trans id="nav.innm">Innm</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="innm_dosage">
                <NavLinkExternal to="innm-dosages">
                  <Trans id="nav.innm_dosage">Innm dosage</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="medication">
                <NavLinkExternal to="medications">
                  <Trans id="nav.trade_name">Trade name</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability
            action="read"
            resources={["medical_program", "program_medication"]}
            loose
          >
            <NavSection
              title={<Trans id="nav.medical_program">Medical program</Trans>}
            >
              <Ability action="read" resource="medical_program">
                <NavLinkExternal to="medical-programs">
                  <Trans id="nav.list_of_medical_programs">
                    List of medical programs
                  </Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="program_medication">
                <NavLinkExternal to="program-medications">
                  <Trans id="nav.program_participants">
                    Program Participants
                  </Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability
            action="read"
            resources={[
              "medication_request",
              "medication_dispense",
              "reimbursement_report"
            ]}
            loose
          >
            <NavSection title={<Trans id="nav.recipes">Recipes</Trans>}>
              <Ability action="read" resource="medication_request">
                <NavLinkExternal to="medication-requests">
                  <Trans id="nav.recipes">Recipes</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="medication_dispense">
                <NavLinkExternal to="medication-dispenses">
                  <Trans id="nav.medication_dispenses">
                    Medication dispenses
                  </Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="download" resource="reimbursement_report">
                <NavLinkExternal to="reimbursement-report">
                  <Trans id="nav.reimbursement_report">
                    Reimbursement report
                  </Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="read" resources={["bl_user", "party_user"]} loose>
            <NavSection title={<Trans id="nav.users">Users</Trans>}>
              <Ability action="read" resource="bl_user">
                <NavLinkExternal to="black-list-users">
                  <Trans id="nav.black_list_users">Black list users</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="party_user">
                <NavLinkExternal to="party-users">
                  <Trans id="nav.accounts">Accounts</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="reset_authentication_method" resource="person">
            <NavLinkExternal to="reset-authentication-method">
              <Trans id="nav.reset_authentication_method">
                Reset authentication method
              </Trans>
            </NavLinkExternal>
          </Ability>
        </Flag>

        <Ability
          action="read"
          resources={["contract_request", "contract"]}
          loose
        >
          <NavSection title={<Trans id="nav.contracts">Contracts</Trans>}>
            <Ability action="read" resource="contract_request">
              <NavLink to="/contracts">
                <Trans id="nav.contracts">Contracts</Trans>
              </NavLink>
              <NavLink to="/contract-requests">
                <Trans id="nav.contract_requests">Contract requests</Trans>
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>
        <Flag name="features.person">
          <Ability action="read" resource="person">
            <NavLink to="/persons">
              <Trans id="nav.persons">Persons</Trans>
            </NavLink>
          </Ability>
        </Flag>
        <Ability action="read" resource="legal_entity">
          <NavLink to="/legal-entities">
            <Trans id="nav.legal_entities">Legal entities</Trans>
          </NavLink>
        </Ability>

        <Ability action="merge" resources={["legal_entity"]} loose>
          <NavSection title={<Trans id="nav.jobs">Jobs</Trans>}>
            <Ability action="merge" resource="legal_entity">
              <NavLink to="/legal-entity-merge-jobs">
                <Trans id="nav.legal_entity_merge_jobs">
                  Legal entity merge jobs
                </Trans>
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>

        <Flag name="features.dictionaries">
          <NavLink to="/dictionaries">
            <Trans id="nav.dictionaries">Dictionaries</Trans>
          </NavLink>
        </Flag>
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
        href: `${env.REACT_APP_ADMIN_LEGACY_URL}/${to}`
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
