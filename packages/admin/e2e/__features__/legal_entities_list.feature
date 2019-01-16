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
  Then I should see table:
  | id  			  | name 	 | edrpou   | type 		  | addresses         | status | nhsReview | nhsVerified | insertedAt | action  |
  | 53XXX1d-XXXX-4fa3 | Lymych M | 31023234 | Description | Kyiv, Bazhana 12b | ACTIVE | true  	   | false 		 | 12.11.2018 | details |
  | 11XXX2X-XXXX-XXXX | Boris  M | 31323234 | Description | Kyiv, Bazhana 12b | ACTIVE | false 	   | true 		 | 12.11.2018 |	details |
  And I should be able to order table by EDRPOU_ASC, EDRPOU_DESC, STATUS_ASC, STATUS_DESC, NHS_REVIEWED_ASC, NHS_REVIEWED_DESC, NHS_VERIFIED_ASC, NHS_VERIFIED_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC

Scenario: Search for a Legal Entity using EDRPOU
  Given I fill in input search field with correct value
  And I submit form
  Then I should see grid with name, edrpou, addresses, status, nhsReview, nhsVerified, insertedAt, details
  And I should be able to order table by EDRPOU_ASC, EDRPOU_DESC, STATUS_ASC, STATUS_DESC, NHS_REVIEWED_ASC, NHS_REVIEWED_DESC, NHS_VERIFIED_ASC, NHS_VERIFIED_DESC, INSERTED_AT_ASC, INSERTED_AT_DESC


Scenario: Search for a Legal Entity using nhsVerified
  Given I chose value from drop down list 
  Then I should see table:
  | id  			  | name 	 | edrpou   | type 		  | addresses         | status | nhsReview | nhsVerified | insertedAt | action  |
  | 53XXX1d-XXXX-4fa3 | Lymych M | 31023234 | Description | Kyiv, Bazhana 12b | ACTIVE | true  	   | false 		 | 12.11.2018 | details |
  | 11XXX2X-XXXX-XXXX | Boris  M | 31323234 | Description | Kyiv, Bazhana 12b | ACTIVE | false 	   | true 		 | 12.11.2018 |	details |
  And I should be able to order table by edrpou_ASC, edrpou_DESC, status_ASC, status_DESC, nhsReviewed_ASC, nhsReviewed_DESC, nhsVerified_ASC, nhsVerified_DESC, insertedAt_ASC, insertedAt_DESC

