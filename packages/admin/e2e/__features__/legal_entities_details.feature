Feature: Test Legal Entity Details Page in NHS admin panel
  Description: The purpose of this feature is to test get Legal Entity details page
 
Background: User is authorized and on LEGAL_ENTITY_DETAILS_PAGE
  Given I navigate to the login page
  When I submit username and password
  And I approve scopes
  Then I should be logged in
  And I navigate to the LEGAL_ENTITY_DETAILS_PAGE

Scenario: Get LEGAL_ENTITY Details
  Given I am on the LEGAL_ENTITY_DETAILS_PAGE
  Then I should see header with id and status
  And I see tabs GENERAL_INFO, LICENSES_ACCREDITATION, RELATED_LEGAL_ENTITES, OWNER, DIVISIONS
  And if status is ACTIVE and nhsReview is True
  Then I should see button DEACTIVATE

Scenario: DEACTIVATE LEGAL_ENTITY 
  Given I am on the LEGAL_ENTITY_DETAILS_PAGE page and nhsReview is true
  When I press DEACTIVATE button
  Then I should see APPROVAL pop-up window 
  And I press YES
  Then I should see LEGAL_ENTITY_DETAILS_PAGE tab 
  And status=CLOSED

Scenario: NHS_REVIEW LEGAL_ENTITY 
  Given I am on the LEGAL_ENTITY_DETAILS_PAGE page and nhsReview is false
  When I press REVIEW button
  Then I should see APPROVAL pop-up window 
  And I press YES
  Then I should see LEGAL_ENTITY_DETAILS_PAGE tab
  And I should see button DEACTIVATE

Scenario: Get LEGAL_ENTITY Details (GENERAL_INFO)
  Given I am on the GENERAL_INFO tab
  Then I should see type, name, edrpou, phones, email, addresses, kveds, ownerPropertyType, website, receiverFundsCode, legalForm, beneficiary, archivePlace, archiveDate, misVerified

Scenario: Get LEGAL_ENTITY Details (LICENSES_ACCREDITATION)
  Given I am on the LICENSES_ACCREDITATION tab
  Then I should see medicalServiceProvider (licenses:what_licensed, order_no, license_number, issued_date, issued_by, expiry_date, active_from_date and  accreditation:accreditation, order_date, issued_date, expiry_date, category), Comment, nhsVerified
  And if nhsVerified is TRUE
  Then I see UNVERIFY button 
  And if nhsVerified is FALSE
  Then I see VERIFY button

Scenario: Get LEGAL_ENTITY Details (OWNER)
  Given I am on the OWNER tab
  Then I should see id, firstName, lastName, secondName, speciality, position

Scenario: Get LEGAL_ENTITY Details (DIVISION)
  Given I am on the DIVISION tab
  Then I should see input DivisionFilter 
  And grid with fields id, name, addresses, mountainGroup, phones, email

Scenario: Get LEGAL_ENTITY Details (RELATED_LEGAL_ENTITES)
  Given I am on the RELATED_LEGAL_ENTITES tab
  Then I should see filter EDRPOU input field  
  And I should see grid with fields legalEntityName, edrpou, isActive, base, insertedAt
  And I should be able to sort by edrpou_ASC, edrpou_DESC, isActive_ASC, isActive_DESC, insertedAt_DESC, insertedAt_ASC
  And if status=ACTIVE
  Then I should see button ADD_NEW_RELATED_LEGAL_ENTITY

Scenario: ADD_NEW_RELATED_LEGAL_ENTITY 
  Given I am on the RELATED_LEGAL_ENTITES tab 
  And legal_entity status=ACTIVE
  Then I should see button ADD_NEW_RELATED_LEGAL_ENTITY
  And I press it
  Then I see window with EDRPOU filter
  And I fill in with correct values 
  And I submit form
  Then I see preview with LEGAL_ENTITY_DETAILS (id, status, nhsVerified, name, edrpou, owner.firstName, owner.secondName, owner.lastName) and button ADD
  And I press button
  Then I see required input BASE field and button ADD_WITH_DS
  And I fill with text 
  And I press ADD_WITH_DS button
  Then I see SIGN_WITH_DS window
  And I fill and submit form
  And I see the message that request in status PENDING 
  And i'm returned to ASYNC_JOB page

Scenario: NHS_VERIFY LEGAL_ENTITY 
  Given I am on the LICENSES_ACCREDITATION page and nhsReview is true and nhsVerified is false
  Then I should see button VERIFY_LEGAL_ENTITY
  When I press VERIFY_LEGAL_ENTITY button
  Then I should see APPROVAL pop-up window and buttons BACK and VERIFY_LEGAL_ENTITY 
  And I press VERIFY_LEGAL_ENTITY
  Then I should see LICENSES_ACCREDITATION tab 
  And UNVERIFY button

Scenario: COMMENT LEGAL_ENTITY
  Given I am on the LICENSES_ACCREDITATION tab and nhsReview is true
  Then I should see button ADD_COMMENT
  And I press it
  Then I see popup with input field and buttons CLOSE and ADD_COMMENT
  And I fill input field with text
  And I press ADD_COMMENT button
  Then I return to same tab
  And I see typed text under the button ADD_COMMENT
