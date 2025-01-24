describe("Klassen", () => {
  it('login', () => {
    cy.visit('', {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD")
      }
    });
  });
  
  it('should create Klasse', () => {
    cy.visit('klassen-verwaltung', {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD")
      }
    })
    
    cy.get('[data-cy="create-button"]').click();
    cy.get('[data-cy="klassenname"]').type("Isengard");
    cy.get('[data-cy="year"]').type("1-3");
    
    cy.get('[data-cy="zug"] > button[role="combobox"]').click()
    cy.get('div[role="presentation"] > :nth-child(2)').click();
    
    cy.get('[data-cy="primary-teacher"] > button[role="combobox"]').click()
    cy.get('div[role="presentation"] > :nth-child(2)').click();
    
    cy.get('[data-cy="secondary-teacher"] > button[role="combobox"]').click()
    cy.get('div[role="presentation"] > :nth-child(3)').click();
    
    cy.get('[data-cy="submit-button"]').click();
    
    
  });
  
  it('should edit Klass', () => {
    cy.visit('klassen-verwaltung', {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD")
      }
    })
    
    const klasse = cy.contains("Isengard").parent()
    klasse.find('[data-cy="edit-dialog-button"]').click()
    
    cy.get('[data-cy="year"]').type("4-6");
    cy.get('[data-cy="submit-button"]').click();
  });
  
  it('should delete Klasse', () => {
    cy.visit('klassen-verwaltung', {
      auth: {
        username: Cypress.env("BASIC_AUTH_USERNAME"),
        password: Cypress.env("BASIC_AUTH_PASSWORD")
      }
    })
    const klasse = cy.contains("Isengard").parent();
    klasse.find('[data-cy="delete-dialog-button"]').click();
    cy.get('[data-cy="confirm-delete-button"]').click()
    
  });
})