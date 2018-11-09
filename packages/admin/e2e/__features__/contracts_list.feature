Feature: Test Сontract List Page in NHS admin panel
  Description: The purpose of this feature is to test get Сontract List Page

Background: User is authorized and on CONTRACT_LIST_PAGE
  Given I navigate to the login page
  When I submit username and password
  And And I approve scopes
  Then I should be logged in
  And I navigate to the CONTRACT_LIST_PAGE

Scenario: Contract  LIST page
  Given I am on the CONTRACT_LIST_PAGE
  Then I should see input field for contractorLegalEntityEdrpou, contractNumber, drop-down list for isSuspnded, drop-down list for status, input form for startDate:from/to (both fields are required), input form for endDate:from/to (both fields are required)

Scenario: Search for a Contract using EDRPOU
  Given I fill in input search field with correct contractorLegalEntityEdrpou value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, inserted_at, details, contractorLegalEntityId(hidden), ID, contractorOwnerId(hidden), contractorOwnerName(hidden), assigneeId(hidden)
  And I should be able to order table by CONTRACTOR_LEGAL_ENTITY_EDRPOU_ASC, CONTRACTOR_LEGAL_ENTITY_EDRPOU_DESC, END_DATE_ASC, END_DATE_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC, IS_SUSPENDED_ASC, IS_SUSPENDED_DESC, START_DATE_ASC, START_DATE_DESC, STATUS_ASC, STATUS_DESC

Scenario: Search for a Contract using CONTRACT_NUMBER
  Given I fill in input search field with correct contractNumber value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, inserted_at, details, contractorLegalEntityId(hidden), ID, contractorOwnerId(hidden), contractorOwnerName(hidden), assigneeId(hidden)
  And I should be able to order table by CONTRACTOR_LEGAL_ENTITY_EDRPOU_ASC, CONTRACTOR_LEGAL_ENTITY_EDRPOU_DESC, END_DATE_ASC, END_DATE_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC, IS_SUSPENDED_ASC, IS_SUSPENDED_DESC, START_DATE_ASC, START_DATE_DESC, STATUS_ASC, STATUS_DESC

Scenario: Search for a Contract using ContractFilter
  Given I fill in input search field with correct ContractRequestFilter value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, insertedAt, details, contractorLegalEntityId(hidden), databaseId, contractorOwnerId(hidden), contractorOwnerName(hidden)
  And I should be able to order table by CONTRACTOR_LEGAL_ENTITY_EDRPOU_ASC, CONTRACTOR_LEGAL_ENTITY_EDRPOU_DESC, END_DATE_ASC, END_DATE_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC, IS_SUSPENDED_ASC, IS_SUSPENDED_DESC, START_DATE_ASC, START_DATE_DESC, STATUS_ASC, STATUS_DESC


