Feature: Test Declaration Details Page in NHS admin panel
  Description: The purpose of this feature is to test get Declaration details page

 
Background: User is authorized and on DECLARATION_DETAILS_PAGE by person
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to the PERSON_DETAILS_PAGE
  And I navigate to DECLARATIONS tab
  And I press `details` field

Background: User is authorized and on DECLARATION_DETAILS_PAGE by declaration status
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to the DECLARATION_LIST_PAGE
  And I navigate to PENDING_VERIFICATION_DECLARATIONS tab
  And I press `details` field

Background: User is authorized and on DECLARATION_DETAILS_PAGE by declaration number
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to the DECLARATION_LIST_PAGE
  And I input DECLARATION_NUMBER
  And I submit form
  And I press `details` field

Scenario: Get Person Details
  Given I am on the DECLARATION_DETAILS_PAGE
  Then I should see header with id, declarationNumber and status
  And I see tabs GENERAL_INFO, LEGAL_ENTITY, DIVISION, EMPLOYEE, PATIENT, DOCUMENTS
  And if status='ACTIVE' 
  Then I should see button TERMINATE on GENERAL_INFO tab
   And if status is PENDING_VERIFICATION
  Then I should see button APPROVE and button REJECT in headers
  And if status is TERMINATED or status is REJECTED
  Then I shouldn't see any button

Scenario: Get Declaration Details (GENERAL_INFO)
  Given I am on the GENERAL_INFO tab
  Then I should see startDate, endDate, status, statusReason, type

Scenario: Get Declaration Details (LEGAL_ENTITY)
  Given I am on the LEGAL_ENTITY tab
  Then I should see id, name, edrpou, addresses

Scenario: Get Declaration Details (DIVISION)
  Given I am on the DIVISION tab
  Then I should see id, name, type, addresses, mountainGroup, phones, email

Scenario: Get Declaration Details (EMPLOYEE)
  Given I am on the EMPLOYEE tab
  Then I should see id, firstName, lastName, secondName, speciality, position

Scenario: Get Declaration Details (PATIENT)
  Given I am on the EMPLOYEE tab
  Then I should see id, firstName, secondName, lastName, birthDate, birthCountry, birthSettlement, taxId, noTaxId, unzr, phones 

Scenario: Get Declaration Details (DOCUMENTS)
  Given I am on the DOCUMENTS tab
  Then I should see documents preview if any was attached

Scenario: Terminate Declaration
  Given I am on the GENERAL_INFO tab
   And Declaration status is ACTIVE
  Then I should see button TERMINATE declaration
  And I press it
  Then I see popup with input field and button BACK and FORWARD
  And I fill input field with text
  And I press FORWARD
  Then I return to same tab
  And I see Declaration status=TERMINATED

Scenario: APPROVE Declaration
  Given I am on the any tab 
  And Declaration status=PENDING_VERIFICATION
  Then I should see button APPROVE declaration
  And I press it
  Then I see popup with text notifications and buttons BACK and FORWARD
  And I press FORWARD
  Then I return to same tab
  And I see Declaration status=ACTIVE

Scenario: REJECT Declaration
  Given I am on the any tab 
  And Declaration status=PENDING_VERIFICATION
  Then I should see button REJECT declaration
  And I press it
  Then I see popup with text notifications and buttons BACK and FORWARD
  And I press FORWARD
  Then I return to same tab
  And I see Declaration status=REJECTED
