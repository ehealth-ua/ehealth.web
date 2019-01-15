Feature: Test Declaration Search Page in NHS admin panel
Description: The purpose of this feature is to test the search for a Declaration page
 
Background: User is authorized and on PERSON_LIST_PAGE
  Given I navigate to the login page
  And I approve scopes
  When I submit username and password
  Then I should be logged in
  And I navigate to the DECLARATION_LIST_PAGE 

Scenario: Search for PENDING_VERIFICATION Declarations
  Given I do not fill DeclarationFilters fields
  Then I should see two tabs
  And I am on the PENDING_VERIFICATION_DECLARATIONS tab
  Then I should see filter by noTaxId
  And grid with Declarations in status PENDING_VERIFICATION

Scenario: Search for Declarations using DECLARATION_NUMBER
  Given I do not fill DeclarationFilters fields
  Then I should see two tabs
  And I am on the SEARCH_BY_DECLARATION_NUMBER tab
  Then I should see filter by DECLARATION_NUMBER
  And empty grid
  And I input existing valid DECLARATION_NUMBER
  Then I see grid with one declaration

Scenario: Search for a Declaration using Declaration Number
  Given I fill in DECLARATION_NUMBER field with correct values 
  And I submit form
  Then I should see table:
    | declarationNumber   | legalEntityName | legalEntityEdrpou | startDate  | status | divisionName    | divisionAddress | details      | noTaxId(hidden) | patientName (hidden)        | declarationId (hidden)
    | XXX-XXXX-34343-XX   | Lymych Medical  | 31023234          | 12.11.2018 | ACTIVE | Borys division  | Kyiv, Bazhana 12b     | details |                 | Zagoruiko Pavlo               | UUID
    | XXX-XXXX-87667-XX   | Boris  Medical  | 31323234          | 12.12.2018 | ACTIVE | Borys division  | Kyiv, Bazhana 12b     | details |                 | Zagoruiko Pavlo               | UUID
  And I should be able to sort by status_ASC or status_DESC or startDate_ASC or startDate_DESC or noTaxId_ASC or noTaxId_DESC

Scenario: Search for PENDING_VERIFICATION Declarations
  Given I fill SERACH_BY_DECLARATION_NUMBER in any field(s) of PersonFilter with correct values 
  And I submit form
  Then I should see grid with columns declarationNumber, legalEntityName, legalEntityEdrpou, startDate, status, divisionName, divisionAddress, details, noTaxId(hidden), patientName (hidden), declarationId (hidden)
  And I should be able to sort by status_ASC or status_DESC or startDate_ASC or startDate_DESC or noTaxId_ASC or noTaxId_DESC
