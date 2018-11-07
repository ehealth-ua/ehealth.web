Feature: Test Contract Request Details Page in NHS admin panel
  Description: The purpose of this feature is to test get Contract Request Details page
 
Background: User is authorized and on CONTRACT_REQUEST_DETAILS_PAGE
  Given I navigate to the login page
  When I submit username and password
  And And I approve scopes
  Then I should be logged in
  And I navigate to the CONTRACT_REQUEST_DETAILS_PAGE

Scenario: Get CONTRACT_REQUEST Details
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE
  Then I should see header with id, contract_number, status and previousRequestId(link)
  And I see tabs GENERAL_INFO, LEGAL_ENTITY, DIVISIONS, EMPLOYEES, EXTERNAL_CONTRACTORS, DOCUMENTS
  And if status is NEW 
  Then I shouldn't see any button
  And I should see in header select to choose assignee
  And if status is IN_PROGRESS
  Then I should see buttons APPROVE and DECLINE and in header select to choose assignee
  And if status is PENDING_NHS_SIGN  
  Then I should see PrintoutForm and button SIGN
  And if status is NHS_SIGNED or SIGNED
  Then I should see PrintoutForm 

Scenario: Get previousRequest Details
   Given I am on the CONTRACT_REQUEST_DETAILS_PAGE
   And previousRequest is filled 
   And I click on it 
   Then I am on the CONTRACT_REQUEST_DETAILS_PAGE with by previousRequestId

Scenario: Get CONTRACT_REQUEST Details (GENERAL_INFO)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and GENERAL_INFO tab
  Then I should see startDate, endDate, contractorRmspAmount, nhsSignerId, nhsSignerName, nhsSignerBase, nhsContractPrice, nhsPaymentMethod, issueCity

Scenario: Get CONTRACT_REQUEST Details (LEGAL_ENTITY)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and GENERAL_INFO tab
  Then I should see block with contractorLegalEntityId, contractorLegalEntityName, contractorLegalEntityEdrpou, contractorLegalEntityAddresses, contractorPaymentDetails
  And block with bankName, MFO, payerAccount 
  And block with contractorOwnerId, contractorOwnerFirstName, contractorOwnerLastName, contractorOwnerSecondName, contractorOwnerBase

Scenario: Get CONTRACT_REQUEST Details (DIVISIONS)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and DIVISIONS tab
  Then I should see grid with id, name, addresses, mountainRegion, phoneNumber, email 

Scenario: Get CONTRACT_REQUEST Details (EMPLOYEES)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and EMPLOYEES tab
  Then I should see grid with id, firstName, lastName, secondName, speciality, staffUnit, declarationLimit

Scenario: Get CONTRACT_REQUEST Details (EXTERNAL_CONTRACTORS)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and EXTERNAL_CONTRACTORS tab
  Then I should see grid with ExternalContractorLegalEntity, ExternalContractorDivsion (division and medicalService), ExternalContractorContractNumber, ExternalContractorContractIssuedAt, ExternalContractorContractExpiresAt

Scenario: Get CONTRACT_REQUEST Details (DOCUMENTS)
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and DOCUMENTS tab
  Then I should see attached DOCUMENTS preview

Scenario: Assign CONTRACT_REQUEST
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and status is NEW or IN_PROCESS
  Then I should see button ASSIGN
  And I select employee
  Then I should see status=IN_PROCESS and assignerName

Scenario: Decline CONTRACT_REQUEST
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and status is IN_PROCESS
  And I press button Decline
  Then I should see read only fields ContractRequestId, status, contractorLegalEntity.edrpou, contractorLegalEntity.name, contractorLegalEntityId, input text statusReason field and buttons BACK and FORWARD
  And I fill input field
  And I press button FORWARD
  Then I should see read only field ContractRequestId, status, contractorLegalEntity.edrpou, contractorLegalEntity.name, contractorLegalEntityId, statusReason and buttons BACK and SIGN
  And I press Sign
  Then I see windows with input fields ASCK, file and password and buttons FORWARD
  And I fill in all fields  and press button FORWARD
  Then I return to same tab and status=DECLINED 


Scenario: Update CONTRACT_REQUEST
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and status is IN_PROCESS
  And I press button APPROVE
  Then I should see read only fields ContractRequestId, status, contractorLegalEntity.edrpou, contractorLegalEntity.name, contractorLegalEntityId and input fields nhsSignerBase(string), nhsContractPrice(input number),  nhsPaymentMethod(enum), issueCity and buttons BACK and FORWARD
  And nhsSignerName as filter employee by EmployeeFilter
  And I fill input fields
  And I press button FORWARD
  Then I should see read only fields ContractRequestId, status, contractorLegalEntity.edrpou, contractorLegalEntity.name, contractorLegalEntityId and input fields nhsSignerBase(string), nhsContractPrice(input number),  nhsPaymentMethod(enum), issueCity and buttons BACK and SIGN

Scenario: Approve CONTRACT_REQUEST
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE approveStep2 page and status is IN_PROCESS
  Then I should see read only fields ContractRequestId, status, contractorLegalEntity.edrpou, contractorLegalEntity.name, contractorLegalEntityId, nhsSignerBase, nhsContractPrice,  nhsPaymentMethod, issueCity and buttons BACK and SIGN
  And I press button SIGN
  Then I see windows with input fields ASCK, file and password and buttons FORWARD
  And I fill in all fields  and press button FORWARD
  Then I return to same tab CONTRACT_REQUEST_DETAILS_PAGE and status=APPROVED 

Scenario: Sign CONTRACT_REQUEST
  Given I am on the CONTRACT_REQUEST_DETAILS_PAGE page and status is PENDING_NHS_SIGN
  And I press button SIGN
  Then I should see printoutForm and button BACK, SIGN and PRINT
  And I press button SIGN
  Then I see windows  with 2 steps
  And I am on the first step with input fields ASCK, file and password and buttons FORWARD
  And I fill in all fields  and press button FORWARD
  Then I am on the second step with input fields ASCK, file and password and buttons FORWARD
  Then I return to same tab CONTRACT_REQUEST_DETAILS_PAGE and status=NHS_SIGNED 



