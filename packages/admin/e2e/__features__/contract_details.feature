Feature: Test Contract Details Page in NHS admin panel
  Description: The purpose of this feature is to test get Contract Request Details page
 
Background: User is authorized and on CONTRACT_REQUEST_DETAILS_PAGE
  Given I navigate to the login page
  When I submit username and password
  And And I approve scopes
  Then I should be logged in
  And I navigate to the CONTRACT_DETAILS_PAGE

Scenario: Get CONTRACT Details
  Given I am on the CONTRACT_DETAILS_PAGE
  Then I should see header with id, contract_number, status, contract_request_id, is_suspended 
  And I see tabs GENERAL_INFO, LEGAL_ENTITY, DIVISIONS, EMPLOYEES, EXTERNAL_CONTRACTORS, DOCUMENTS
  And if status is TERMINATED or VERIFIED
  Then I should see PrintoutForm
  And if status is VERIFIED
  Then I should see button TERMINATE 

Scenario: Get contract_request_id Details
   Given I am on the CONTRACT_DETAILS_PAGE
   And I click on contract_request_id 
   Then I am on the CONTRACT_REQUEST_DETAILS_PAGE with by contract_request_id

Scenario: Get CONTRACT Details (GENERAL_INFO)
  Given I am on the CONTRACT_DETAILS_PAGE page and GENERAL_INFO tab
  Then I should see startDate, endDate, contractorRmspAmount, nhsSignerId, nhsSignerName, nhsSignerBase, nhsContractPrice, nhsPaymentMethod, issueCity

Scenario: Get CONTRACT Details (LEGAL_ENTITY)
  Given I am on the CONTRACT_DETAILS_PAGE page and LEGAL_ENTITY tab
  Then I should see block with contractorLegalEntityId, contractorLegalEntityName, contractorLegalEntityEdrpou, contractorLegalEntityAddresses, contractorPaymentDetails
  And block with bankName, MFO, payerAccount 
  And block with contractorOwnerId, contractorOwnerFirstName, contractorOwnerLastName, contractorOwnerSecondName, contractorOwnerBase

Scenario: Get CONTRACT Details (DIVISIONS)
  Given I am on the CONTRACT_DETAILS_PAGE page and DIVISIONS tab
  Then I should see grid with id, name, addresses, mountainRegion, phoneNumber, email and button `GO_TO_EMPLOYEES`
  And filter by name
  When I press  GO_TO_EMPLOYEES button 
  Then I switch to EMPLOYEES tab filtered by divisionId

Scenario: Get CONTRACT Details (EMPLOYEES)
  Given I am on the CONTRACT_DETAILS_PAGE page and EMPLOYEES tab
  Then I should see filter by divisionName
  And grid with id, firstName, lastName, secondName, speciality, staffUnit, declarationLimit
  And I should be able to order table by DECLARATION_LIMIT_ASC, DECLARATION_LIMIT_DESC, STAFF_UNITS_ASC, STAFF_UNITS_DESC

Scenario: Get CONTRACT Details (EXTERNAL_CONTRACTORS)
  Given I am on the CONTRACT_DETAILS_PAGE page and EXTERNAL_CONTRACTORS tab
  And grid with ExternalContractorLegalEntity, ExternalContractorDivsions (division and medicalService), ExternalContractorContractNumber, ExternalContractorContractIssuedAt, ExternalContractorContractExpiresAt

Scenario: Get CONTRACT Details (DOCUMENTS)
  Given I am on the CONTRACT_DETAILS_PAGE page and DOCUMENTS tab
  Then I should see attached DOCUMENTS links

Scenario: Terminate CONTRACT
  Given I am on the CONTRACT_DETAILS_PAGE page and status is VERIFIED 
  Then I should see button TERMINATE
  And I press button 
  Then I should see pop-up window with input field statusReason and buttons BACK and TERMINATE
  And I fill input and press TERMINATE
  Then I am on the CONTRACT_DETAILS_PAGE and status=TERMINATED
