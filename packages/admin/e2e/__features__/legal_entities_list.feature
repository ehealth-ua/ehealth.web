Feature: Test Legal entities Search Page in NHS admin panel
  Description: The purpose of this feature is to test Legal entities Search Page 

Background: User is authorized and on DECLARATION_LIST_PAGE
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to the DECLARATION_LIST_PAGE

Scenario: Search for a Legal Entity using ID
  Given I fill in input search field with correct value
  And I submit form
  Then I should see grid with name, edrpou, addresses, status, nhsVerified, insertedAt, details
  And I should be able to order table by edrpou_ASC, edrpou_DESC, status_ASC, status_DESC, nhsVerified_ASC, nhsVerified_DESC, insertedAt_ASC, insertedAt_DESC

Scenario: Search for a Legal Entity using EDRPOU
  Given I fill in input search field with correct value
  And I submit form
  Then I should see grid with name, edrpou, addresses, status, nhsVerified, insertedAt, details
  And I should be able to order table by edrpou_ASC, edrpou_DESC, status_ASC, status_DESC, nhsVerified_ASC, nhsVerified_DESC, insertedAt_ASC, insertedAt_DESC

Scenario: Search for a Legal Entity using nhsVerified
  Given I chose value from drop down list 
  Then I should see grid with name, edrpou, addresses, status, nhsVerified, insertedAt, details
  And I should be able to order table by edrpou_ASC, edrpou_DESC, status_ASC, status_DESC, nhsVerified_ASC, nhsVerified_DESC, insertedAt_ASC, insertedAt_DESC

Scenario: Search for a Legal Entity using SETTLEMENT_NAME
  Given I fill in SETTLEMENT_SEARCH field with correct value
  And I submit form
  Then I should see grid with name, edrpou, addresses, status, nhsVerified, insertedAt, details
  And I should be able to order table by edrpou_ASC, edrpou_DESC, status_ASC, status_DESC, nhsVerified_ASC, nhsVerified_DESC, insertedAt_ASC, insertedAt_DESC
