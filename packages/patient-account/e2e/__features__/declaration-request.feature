Feature: Declaration request
  Create Declaration Request via Cabinet HP
  Background: Authorize user
    Given I am logged in as patient in PATIENT_ACCOUNT

  Scenario: I am trying to make declaration request
    Given I should see the home page
    When I press on searchLink
    Then I should see the search page
    When I choose from specialities FAMILY_DOCTOR option
    And I press on details in first row from list
    And I should see the employee page
    When I press on request
    Then I should see the request page
    When I press on approve
    Then I should see the home page
    And I should see the declarationRequest page