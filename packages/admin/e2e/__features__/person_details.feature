Feature: Test Person Details Page in NHS admin panel
  Description: The purpose of this feature is to test get Person details page
 
Background: User is authorized and on PERSON_DETAILS_PAGE
  Given I navigate to the login page
  And I approve scopes
  When I submit username and password
  Then I should be logged in
  And I navigate to the PERSON_DETAILS_PAGE 

Scenario: Get Person Details
  Given I am on the PERSON_DETAILS_PAGE
  Then I should see header with id and status
  And tabs personal_info, authentication_method, declarations, emergency_contact, confidant_person 

Scenario: Get Person Details (PERSONAL_INFO)
  Given I am on the PERSONAL_INFO tab
  Then I should see firstName, secondName, lastName, birthDate, birthCountry, birthSettlement, taxId, noTaxId, unzr, phones 

Scenario: Get Person Details (AUTHENTICATION_METHOD)
  Given I am on the AUTHENTICATION_METHOD tab
  Then I should see authenticationMethod.type 
  And authenticationMethod.phoneNumber
  And button resetPersonAuthenticationMethod

Scenario: Reset AUTHENTICATION METHOD
  Given I am on the AUTHENTICATION_METHOD tab
  When I press resetPersonAuthenticationMethod button
  Then I should see APPOVAL pop-up window 
  And I press YES
  Then I shouls see AUTHENTICATION_METHOD tab 
  And authenticationMethod.type ='N/A'

Scenario: Get Person Details (DECLARATIONS)
  Given I am on the DECLARATIONS tab
  Then I should see Declarations filtered by PersonId
  And input field with DeclarationFilter 
  And grid DECLARATION_LIST with columns declarationNumber, legalEntityName, legalEntityEdrpou, startDate, status, divisionName, divisionAddress, details, patientName (hidden), declarationId (hidden)
  And I should be able to sort by status_ASC or status_DESC or startDate_ASC or startDate_DESC

Scenario: Search declarations by status (DECALRATIONS)
  Given I am on the DECALRATIONS tab
  When I order by STATUS
  Then I should see DECLARATION_LIST ordered by STATUS

Scenario: Search declarations by ID (DECALRATIONS)
  Given I am on the DECALRATIONS tab
  When I fill DECLARATION_SEARCH field with correct existing ID
  Then I should see DECLARATION_LIST filtered by ID

Scenario: Search declarations by DECLARATION_NUMBER (DECALRATIONS)
  Given I am on the DECALRATIONS tab
  When I fill DECLARATION_SEARCH field with correct existing DECLARATION_NUMBER
  Then I should see DECLARATION_LIST filtered by DECLARATION_NUMBER

Scenario: Get Person Details (EMERGENCY_CONTACT)
  Given I am on EMERGENCY_CONTACT tab
  Then I should see firstName, secondName, lastName, phones

Scenario: Get Person Details (CONFIDANT_PERSON)
  Given I am on CONFIDANT_PERSON tab
  Then I see table which is divided on logical blocks
  block | primary_confidant_person | secondary_confidant_person |
  blocks are next:
  primary_confidant_person: firstName, secondName, lastName, birth_date, birth_country, birth_settlement, tax_id, unzr, email, phones
  secondary_confidant_person: firstName, secondName, lastName, birth_date, birth_country, birth_settlement, tax_id, unzr, email, phones