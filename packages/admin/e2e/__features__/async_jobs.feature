Feature: Test MERGED_LEGAL_ENTITIES Job page in NHS admin panel
  Description: The purpose of this feature is to test get Legal Entity details page

 
Background: User is authorized and on JOB_PARAGRAPH and MERGED_LEGAL_ENTITIES PAGE
  Given I navigate to the login page
  When I submit username and password
  And And I approve scopes
  Then I should be logged in
  And I navigate to JOB_PARAGRAPH and MERGED_LEGAL_ENTITIES_JOBS PAGE

Scenario: Get MERGED_LEGAL_ENTITIES_JOBS List
  Given I am on the MERGED_LEGAL_ENTITIES_JOBS page
  Then I should see drop-down filter by STATUS, input filters by mergedFromEdrpou, mergedToEdrpou
  And I see table with columns id, name, status, startTime, executionTime, mergedFromName, mergedFromEdrpou, mergedToName, mergedToEdrpou
  And I should be able to filter by STARTET_AT_ASC, STARTET_AT_DESC
