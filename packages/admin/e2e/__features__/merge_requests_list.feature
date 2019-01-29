Feature: Test Merge Requests List Page in NHS admin panel
Description: The purpose of this feature is to test getting of user's merge requests list
 
Background: User is authorized and on MERGE_REQUEST_LIST_PAGE
  Given I navigate to the login page
  And I approve scopes
  When I submit username and password
  Then I should be logged in
  And I navigate to the MERGE_REQUEST_LIST_PAGE 

Scenario: User get MERGE_REQUEST_LIST
  Given I am on the MERGE_REQUEST_LIST page
  Then I should see button GET_NEW_REQUEST 
  And I should see filter by STATUS
  And  I should see table with possibiliy to order by STATUS_ASC or STATUS_DESC or INSERTED_ASC or INSERTED_DESC
    | merge_request_id   | status | inserted_at| details
    | ca5dada3-593b-4c43-92dc-4631612d77fc   | POSTPONED | 2019-01-24 09:39:33.899308 | go to details


Scenario: Get new Merge Request 
  Given I am on the MERGE_REQUEST_LIST page
  And I don't have merge request in status NEW
  And I have merge requests in status POSTPONE less than postponed_requests_limit
  Then I should see enabled button GET_NEW_REQUEST
  And I press button 
  Then I should be returned to MERGE_REQUEST_LIST page 
  And I should see table with merge requests
  And first row is
  | merge_request_id   | status | inserted_at| details
    | ca5dada3-593b-4c43-92dc-4631612d77fc   | NEW | 2019-01-24 09:39:33.899308 | go to details  

Scenario: Get new Merge Request when one is already exists 
  Given I am on the MERGE_REQUEST_LIST page
  And I have merge request in status NEW
  Then I should see disabled button GET_NEW_REQUEST
  And I should see table with merge requests
  And first row is
  | merge_request_id   | status | inserted_at| details
    | ca5dada3-593b-4c43-92dc-4631612d77fc   | NEW | 2019-01-24 09:39:33.899308 | go to details  

Scenario: Get new Merge Request when reached limit in postponed requests 
  Given I am on the MERGE_REQUEST_LIST page
  And I don't have merge request in status NEW
  And I have merge requests in status POSTPONE more or equal than postponed_requests_limit
  Then I should see enabled button GET_NEW_REQUEST
  And I press button 
  Then I should be returned to MERGE_REQUEST_LIST page 
  And I should see error 'You reached postponed merge requests and can't assign new one'
