Feature: Test Person Search Page in NHS admin panel
Description: The purpose of this feature is to test the search for a Person page
 
Background: User is authorized and on PERSON_LIST_PAGE
	Given I navigate to the login page
  And I approve scopes
	When I submit username and password
	Then I should be logged in
	And I navigate to the PERSON_LIST_PAGE 

Scenario: Search for a Person using PersonPersonalFilter
  Given I do not fill in PersonPersonalFilter fields
  Then I should see filters and empty grid

Scenario: Search for a Person using PersonPersonalFilter
  Given I fill in PersonPersonalFilter fields with correct values 
  And I submit form
  Then I should see grid with firstName, lastName, birtDate, taxId, nationalId, authentificationMethod, details, insertedAt
  And I should be able to order table by taxId_ASC or taxId_DESC or unzr_ASC or unzr_DESC or birthDate_ASC or birthDate_DESC or insertedAt_ASC or insertedAt_DESC

Scenario: Search for a Person using PersonlFilter
  Given I fill in any field(s) of PersonFilter with correct values 
  And I submit form
  Then I should see grid with firstName, lastName, birtDate, taxId, nationalId, authentificationMethod, details, inserted_at
  And I should be able to order table by taxId_ASC or taxId_DESC or unzr_ASC or unzr_DESC or birthDate_ASC or birthDate_DESC or insertedAt_ASC or insertedAt_DESC

Scenario: Search for a Person by Declaration
  Given I fill in filter input field with DeclarationFilter 
  And I submit form
  Then I should see grid with firstName, lastName, birtDate, taxId, nationalId, authentificationMethod, details, inserted_at
  And I should be able to order table by taxId_ASC or taxId_DESC or unzr_ASC or unzr_DESC or birthDate_ASC or birthDate_DESC or insertedAt_ASC or insertedAt_DESC

