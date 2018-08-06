Feature: Sign in to the system using an email and password

Scenario: Sign in
  Given I am on the OAUTH_PAGE
  When I fill in email field with OAUTH_EMAIL
  And I fill in password field with OAUTH_PASSWORD
  And I press submit
  Then I should see the "accept" page
