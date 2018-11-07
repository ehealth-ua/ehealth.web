Feature: Test Сontract Request List Page in NHS admin panel
  Description: The purpose of this feature is to test get Сontract Request List Page

Background: User is authorized and on CONTRACT_REQUST_LIST_PAGE
  Given I navigate to the login page
  When I submit username and password
  And And I approve scopes
  Then I should be logged in
  And I navigate to the CONTRACT_REQUST_LIST_PAGE

Scenario: Contract Request LIST page
  Given I am on the CONTRACT_REQUST_LIST_PAGE
  Then I should see input field for contractorLegalEntityEdrpou, contractNumber, drop-down list for assigneName, drop-down list for status, input form for startDate:from/to (both fields are required), input form for endDate:from/to (both fields are required)

Scenario: Search for a Contract Request using EDRPOU
  Given I fill in input search field with correct contractorLegalEntityEdrpou value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, inserted_at, details, contractorLegalEntityId(hidden), ID, contractorOwnerId(hidden), contractorOwnerName(hidden), assigneeId(hidden)
  And I should be able to order table by status_ASC, status_DESC, startDate_ASC, startDate_DESC, endDate_ASC, endDate_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC

Scenario: Search for a Contract Request using CONTRACT_NUMBER
  Given I fill in input search field with correct contractNumber value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, inserted_at, details, contractorLegalEntityId(hidden), ID, contractorOwnerId(hidden), contractorOwnerName(hidden), assigneeId(hidden)
  And I should be able to order table by status_ASC, status_DESC, startDate_ASC, startDate_DESC, endDate_ASC, endDate_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC

Scenario: Search for a Contract Request using ContractRequestFilter
  Given I fill in input search field with correct ContractRequestFilter value
  And I submit form
  Then I should see grid with contractorLegalEntityEdrpou, contractorLegalEntityName, contractNumber, startDate, endDate, status, assigneeName, inserted_at, details, contractorLegalEntityId(hidden), ID, contractorOwnerId(hidden), contractorOwnerName(hidden), assigneeId(hidden)
  And I should be able to order table by status_ASC, status_DESC, startDate_ASC, startDate_DESC, endDate_ASC, endDate_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC


