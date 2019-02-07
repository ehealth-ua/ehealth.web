Feature: Test Merge Requests List Details in NHS admin panel
Description: The purpose of this feature is to test getting of user's merge requests details page
 
Background: User is authorized and on MERGE_REQUEST_LIST_DETAILS PAGE
  Given I navigate to the login page
  And I approve scopes
  When I submit username and password
  Then I should be logged in
  And I navigate to the MERGE_REQUEST_DETAILS_PAGE 

Scenario: Get merge request details
  Given I am on the MERGE_REQUEST_DETAILS page
  Then I should see button POSTPONE, MERGE, SPLIT, TRASH 
  And If status is NEW then all buttons (POSTPONE, MERGE, SPLIT, TRASH) are active
  And If status is POSTPONE then buttons MERGE, SPLIT, TRASH are active and button POSTPONE is disabled
  And I should see id, status of merge request and comment
  And I should see table which is divided on logical blocks
  block | person | master_person |
  blocks are next:
  personal_information: firstName, lastName, secondName, birthDate, birthCountry, birthSettlement, gender, email, preferredWayCommunication
  identity_information: unzr, taxId, noTaxId
  phones: authenticationMethods, phones
  documents
  addresses
  emergencyContact: firstName, lastName, secondName, phones
  confidantPersons: relation_type, first_name, last_name, second_name, birth_date, birth_country, birth_settlement, gender, tax_id, preferred_way_communication, email, documents_person, documents_relationship, phones
  go to declarations

Scenario: Update NEW merge request to POSTPONE
  Given I am on the MERGE_REQUEST_LIST page
  And merge request in status NEW
  And I press button POSTPONE
  Then I should see pop-up with possibility to input comment
  And button BACK and FORWARD
  And I press button FORWARD
  Then I should be returned to MERGE_REQUEST_LIST
  And first row of the table must consist id of reviewed merge request in status POSTPONE

Scenario: Update NEW merge request to MERGE
  Given I am on the MERGE_REQUEST_LIST page
  And merge request in status NEW
  And I press button MERGE, SPLIT or TRASH
  Then I should see pop-up with possibility to input comment
  And button BACK and FORWARD
  And I press button FORWARD
  Then I should be returned to MERGE_REQUEST_LIST
  And I shouldn't see in a table reviewed merge request

Scenario: Update NEW merge request to SPLIT
  Given I am on the MERGE_REQUEST_LIST page
  And merge request in status NEW
  And I press button POSTPONE, MERGE, SPLIT or TRASH
  Then I should see pop-up with possibility to input comment
  And button BACK and FORWARD
  And I press button FORWARD
  Then I should be returned to MERGE_REQUEST_LIST
  And I shouldn't see in a table reviewed merge request

Scenario: Update NEW merge request to TRASH
  Given I am on the MERGE_REQUEST_LIST page
  And merge request in status NEW
  And I press button POSTPONE, MERGE, SPLIT or TRASH
  Then I should see pop-up with possibility to input comment
  And button BACK and FORWARD
  And I press button FORWARD
  Then I should be returned to MERGE_REQUEST_LIST
  And I shouldn't see in a table reviewed merge request

Scenario: Update POSPOTONED merge request  
  Given I am on the MERGE_REQUEST_LIST page
  And merge request in status POSPOTNE
  Then button postopone is disabled
  And I press button MERGE, SPLIT or TRASH
  Then I should see pop-up with possibility to input comment
  And button BACK and FORWARD
  And I press button FORWARD
  Then I should be returned to MERGE_REQUEST_LIST
  And I shouldn't see in a table reviewed merge request
