import React from "react";
import styled from "@emotion/styled";
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
            <Trans>Statistic</Trans>
          </NavLinkExternal>

          <Flag
            name="features.person"
            fallbackRender={() => (
              <>
                <Ability action="read" resource="person">
                  <NavLinkExternal to="persons">
                    <Trans>Persons</Trans>
                  </NavLinkExternal>
                </Ability>
                <Ability action="reset_authentication_method" resource="person">
                  <NavLinkExternal to="reset-authentication-method">
                    Скинути метод
                    <br />
                    авторизації
                  </NavLinkExternal>
                </Ability>
              </>
            )}
          />

          <Flag
            name="features.declaration"
            fallbackRender={() => (
              <Ability action="read" resource="declaration">
                <NavSection title={<Trans>Declarations</Trans>}>
                  <NavLinkExternal to="declarations">
                    <Trans>Declarations</Trans>
                  </NavLinkExternal>
                  <NavLinkExternal to="pending-declarations">
                    <Trans>Pending declarations</Trans>
                  </NavLinkExternal>
                </NavSection>
              </Ability>
            )}
          />

          <Ability action="read" resource="employee">
            <NavSection title={<Trans>Employees</Trans>}>
              <Ability action="read" resource="employee">
                <NavLinkExternal to="employees">
                  <Trans>Employees</Trans>
                </NavLinkExternal>
                <NavLinkExternal to="pending-employees">
                  <Trans>Pending employees</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <NavLinkExternal to="reports">
            <Trans>Reports</Trans>
          </NavLinkExternal>

          <Ability
            action="read"
            resources={["register", "register_entry"]}
            loose
          >
            <NavSection title={<Trans>Registers</Trans>}>
              <Ability action="read" resource="register">
                <NavLinkExternal to="registers">
                  <Trans>Registers</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="register_entry">
                <NavLinkExternal to="registers-entries">
                  <Trans>Registers entries</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="read" resource="global_parameters">
            <NavLinkExternal to="configuration">
              <Trans>Configuration</Trans>
            </NavLinkExternal>
          </Ability>

          <Flag
            name="features.medications"
            fallbackRender={() => (
              <Ability
                action="read"
                resources={["innm", "innm_dosage", "medication"]}
                loose
              >
                <NavSection title={<Trans>Medicines</Trans>}>
                  <Ability action="read" resource="innm">
                    <NavLinkExternal to="innms">
                      <Trans>Innm</Trans>
                    </NavLinkExternal>
                  </Ability>
                  <Ability action="read" resource="innm_dosage">
                    <NavLinkExternal to="innm-dosages">
                      <Trans>Innm dosage</Trans>
                    </NavLinkExternal>
                  </Ability>
                  <Ability action="read" resource="medication">
                    <NavLinkExternal to="medications">
                      <Trans>Trade name</Trans>
                    </NavLinkExternal>
                  </Ability>
                </NavSection>
              </Ability>
            )}
          />

          <Flag
            name="features.medicalPrograms"
            fallbackRender={() => (
              <Ability
                action="read"
                resources={["medical_program", "program_medication"]}
                loose
              >
                <NavSection title={<Trans>Medical program</Trans>}>
                  <Ability action="read" resource="medical_program">
                    <NavLinkExternal to="medical-programs">
                      <Trans>List of medical programs</Trans>
                    </NavLinkExternal>
                  </Ability>
                  <Ability action="read" resource="program_medication">
                    <NavLinkExternal to="program-medications">
                      <Trans>Program Participants</Trans>
                    </NavLinkExternal>
                  </Ability>
                </NavSection>
              </Ability>
            )}
          />

          <Ability
            action="read"
            resources={[
              "medication_request",
              "medication_dispense",
              "reimbursement_report"
            ]}
            loose
          >
            <NavSection title={<Trans>Recipes</Trans>}>
              <Ability action="read" resource="medication_request">
                <NavLinkExternal to="medication-requests">
                  <Trans>Recipes</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="medication_dispense">
                <NavLinkExternal to="medication-dispenses">
                  <Trans>Medication dispenses</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="download" resource="reimbursement_report">
                <NavLinkExternal to="reimbursement-report">
                  <Trans>Reimbursement report</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>

          <Ability action="read" resources={["bl_user", "party_user"]} loose>
            <NavSection title={<Trans>Users</Trans>}>
              <Ability action="read" resource="bl_user">
                <NavLinkExternal to="black-list-users">
                  <Trans>Black list users</Trans>
                </NavLinkExternal>
              </Ability>
              <Ability action="read" resource="party_user">
                <NavLinkExternal to="party-users">
                  <Trans>Accounts</Trans>
                </NavLinkExternal>
              </Ability>
            </NavSection>
          </Ability>
        </Flag>

        <Ability
          action="read"
          resources={["contract_request", "contract"]}
          loose
        >
          <NavSection title={<Trans>Contracts</Trans>}>
            <Ability action="read" resource="contract_request">
              <NavLink to="/contracts">
                <Trans>Contracts</Trans>
              </NavLink>
              <NavLink to="/contract-requests">
                <Trans>Contract requests</Trans>
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>
        <Flag name="features.person">
          <Ability action="read" resource="person">
            <NavLink to="/persons">
              <Trans>Persons</Trans>
            </NavLink>
          </Ability>
        </Flag>
        <Ability action="read" resource="legal_entity">
          <NavLink to="/legal-entities">
            <Trans>Legal entities</Trans>
          </NavLink>
        </Ability>
        <Flag name="features.medications">
          <Ability
            action="read"
            resources={["innm", "innm_dosage", "medication"]}
            loose
          >
            <NavSection title={<Trans>Medications</Trans>}>
              <Ability action="read" resource="innm">
                <NavLink to="/innms">
                  <Trans>INNMs</Trans>
                </NavLink>
              </Ability>
              <Ability action="read" resource="innm_dosage">
                <NavLink to="/innm-dosages">
                  <Trans>INNM dosages</Trans>
                </NavLink>
              </Ability>
              <Ability action="read" resource="medication">
                <NavLink to="/medications">
                  <Trans>Trade name</Trans>
                </NavLink>
              </Ability>
            </NavSection>
          </Ability>
        </Flag>
        <Flag name="features.medicalPrograms">
          <Ability
            action="read"
            resources={["medical_program", "program_medication"]}
            loose
          >
            <NavSection title={<Trans>Medical program</Trans>}>
              <Ability action="read" resource="medical_program">
                <NavLink to="/medical-programs">
                  <Trans>List of medical programs</Trans>
                </NavLink>
              </Ability>
              <Ability action="read" resource="program_medication">
                <NavLink to="/program-medications">
                  <Trans>Program medications</Trans>
                </NavLink>
              </Ability>
            </NavSection>
          </Ability>
        </Flag>
        <Flag name="features.declaration">
          <Ability action="read" resource="declaration">
            <NavSection title={<Trans>Declarations</Trans>}>
              <NavLink to="declarations">
                <Trans>Declarations</Trans>
              </NavLink>
              <NavLink to="pending-declarations">
                <Trans>Pending declarations</Trans>
              </NavLink>
            </NavSection>
          </Ability>
        </Flag>
        <Ability action="merge" resources={["legal_entity"]} loose>
          <NavSection title={<Trans>Jobs</Trans>}>
            <Ability action="merge" resource="legal_entity">
              <NavLink to="/legal-entity-merge-jobs">
                <Trans>Legal entity merge jobs</Trans>
              </NavLink>
            </Ability>
            <Ability action="deactivate" resource="legal_entity">
              <NavLink to="/legal-entity-deactivate-jobs">
                <Trans>Legal entity deactivate jobs</Trans>
              </NavLink>
            </Ability>
          </NavSection>
        </Ability>

        <Flag name="features.patientsMergeRequest">
          <Ability action="read" resource="merge_request">
            <NavLink to="/patient-merge-requests">
              <Trans>Patients Merge</Trans>
            </NavLink>
          </Ability>
        </Flag>

        <Flag name="features.employees">
          <Ability action="read" resource="employee">
            <NavSection title={<Trans>Employees</Trans>}>
              <Ability action="read" resource="employee">
                <NavLink to="/employees">
                  <Trans>Employees</Trans>
                </NavLink>
              </Ability>
            </NavSection>
          </Ability>
        </Flag>

        <Flag name="features.dictionaries">
          <NavLink to="/dictionaries">
            <Trans>Dictionaries</Trans>
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
        <Link to={to} color="white" fontWeight={match && "bold"}>
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
        <ChevronBottomIcon
          width="7px"
          height="7px"
          ml={2}
          css={`
          details[open] & {
            transform: rotate(180deg);
        `}
        />
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
