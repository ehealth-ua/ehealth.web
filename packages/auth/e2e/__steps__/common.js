Given("I am on the {env}", async url => {
  await page.goto(url);
});

When("I fill in {selector} field with {env}", async (selector, value) => {
  await expect(page).toFill(selector, value);
});

When("I press {selector}", async selector => {
  await expect(page).toClick(selector);
});

Then("I should see the {string} page", async name => {
  await page.waitForNavigation();
  expect(page.url()).toMatch(name);
});
