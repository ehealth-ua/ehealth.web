Given("I am logged in as patient in {env}", { timeout: 20000 }, async env => {
  await page.goto(env);
  await page.waitForNavigation();
  await expect(page).toFill(
    "[data-test='email']",
    "kiurchv+ehealth-dev+cab@gmail.com"
  );
  await expect(page).toFill("[data-test='password']", "Qwerty123456");
  await expect(page).toClick("[data-test='submit']");
  await page.waitForNavigation();
});

Given("I am on the {env}", async url => {
  await page.goto(url);
});

When("I fill in {selector} field with {env}", async (selector, env) => {
  await expect(page).toFill(selector, env);
});

When("I press on {selector}", { timeout: 20000 }, async selector => {
  await page.waitForSelector(selector);
  await expect(page).toClick(selector);
});

When("I press on {selector} in first row from list", async selector => {
  await page.waitForSelector(selector);
  const row = await expect(page).toMatchElement(`tr:first-child`, {
    text: "Сімейний лікар",
    timeout: 2000
  });
  await expect(row).toClick(selector);
});

When(
  "I choose from {selector} {word} option",
  { timeout: 20000 },
  async (selector, word) => {
    await expect(page).toClick(selector);
    await page.waitForSelector(`[data-test="${word}"]`);
    await expect(page).toClick(`[data-test="${word}"]`);
  }
);

Then("I should see the {selector} page", { timeout: 20000 }, async selector => {
  await page.waitForSelector(selector);
  expect(page).toMatchElement(selector);
  await page.waitForSelector(selector);
});
