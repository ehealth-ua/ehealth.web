Feature: Test legal entity async deactivation job list Page in NHS admin panel
  Description: The purpose of this feature is to test legal entity async deactivation job list

Background: User is authorized and on LEGAL_ENTITY_DEACTIVATE_JOBS_PAGE
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to JOBS_PARAGRAPH and LEGAL_ENTITY_DEACTIVATE_JOBS_PAGE

Scenario: Get LEGAL_ENTITY_DEACTIVATE_JOBS list
  Given I am on the LEGAL_ENTITY_DEACTIVATE_JOBS page
  Then I should see input field for legalEntityEdrpou, drop-down list for status
  And I should see table:
  | id                         | legalEntityName | legalEntityEdrpou | startedAt         | executionTime    | status    |
  | XX33XX1121XXX016XXX63XXX   | Lymych Medical  | 31023234          | 15.01.2019, 09:39 | 0 seconds        | ACTIVE    |
  | 5XXX092XXX216XXX01663XXX   | Boris  Medical  | 31323234          | 15.01.2019, 09:42 | 0 seconds        | ACTIVE    |
  And I should be able to filter by STARTET_AT_ASC, STARTET_AT_DESC, EXECUTION_TIME_ASC, EXECUTION_TIME_DESC

Scenario: Search for a Legal Entity Deactivate Job using EDRPOU
  Given I fill in input search field with correct edrpou value
  And I submit form
  Then I should see table:
  | id                         | legalEntityName | legalEntityEdrpou | startedAt         | executionTime    | status    |
  | XX33XX1121XXX016XXX63XXX   | Lymych Medical  | 31023234          | 15.01.2019, 09:39 | 0 seconds        | ACTIVE    |
  | 5XXX092XXX216XXX01663XXX   | Boris  Medical  | 31323234          | 15.01.2019, 09:42 | 0 seconds        | ACTIVE    |
  And I should be able to order table by STARTED_AT_ASC, STARTED_AT_DESC, EXECUTION_TIME_ASC, EXECUTION_TIME_DESC

Scenario: Search for a Legal Entity Deactivate Job using STATUS
  Given I chose value from drop-down list
  And I submit form
  Then I should see table:
  | id                         | legalEntityName | legalEntityEdrpou | startedAt         | executionTime    | status    |
  | XX33XX1121XXX016XXX63XXX   | Lymych Medical  | 31023234          | 15.01.2019, 09:39 | 0 seconds        | ACTIVE    |
  | 5XXX092XXX216XXX01663XXX   | Boris  Medical  | 31323234          | 15.01.2019, 09:42 | 0 seconds        | ACTIVE    |
  And I should be able to order table by STARTED_AT_ASC, STARTED_AT_DESC, EXECUTION_TIME_ASC, EXECUTION_TIME_DESC
