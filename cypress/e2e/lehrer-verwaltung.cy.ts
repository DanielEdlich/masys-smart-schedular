describe("Teacher", () => {
  it("should login", () => {
    cy.visit("", {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD"),
      },
    });
  });

  it("should create Teacher", () => {
    cy.visit("lehrer-verwaltung", {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD"),
      },
    });

    cy.get('[data-cy="create-button"]').click();
    cy.get("#first_name").type("Test");
    cy.get("#last_name").type("Mustermann");
    cy.get("#email").type("max@musterman@mail.com");
    cy.get("#phone").type("0123456789");

    cy.get('[data-cy="priority"] > button').click();
    cy.get('div[role="presentation"] > :nth-child(2)').click();

    cy.get('[data-cy="blocker"] > div > button[role="combobox"]').click();
    cy.get('div[role="presentation"] > :nth-child(2)').click();
    cy.get("#blocker-min-0").clear();
    cy.get("#blocker-min-0").type("5");
    cy.get("#blocker-max-0").clear();
    cy.get("#blocker-max-0").type("10");

    cy.contains("Blocker hinzufügen").click();
    cy.get('[data-cy="blocker"] > div > button[role="combobox"]').eq(1).click();
    cy.get('div[role="presentation"] > :nth-child(4)').click();
    cy.get("#blocker-max-1").clear();
    cy.get("#blocker-max-1").type("2");

    cy.get("button#submit-form-button").click();
  });
  it("should edit Teacher", () => {
    cy.visit("lehrer-verwaltung", {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD"),
      },
    });

    const teacher = cy.contains("Test Mustermann").parent();
    teacher.find('[data-cy="edit-dialog-button"]').click();

    cy.get('[data-cy="blocker-delete-0"]').click();

    cy.get("button#submit-form-button").click();
  });
  it("should delete Teacher", () => {
    cy.visit("lehrer-verwaltung", {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD"),
      },
    });

    const teacher = cy.contains("Test Mustermann").parent();
    teacher.find('[data-cy="delete-dialog-button"]').click();
    cy.get('[data-cy="confirm-delete-button"]').click();
  });
});
