describe('AffordaHouse – Rental quick screening form', () => {
  beforeEach(() => {
    cy.visit('/') // or your correct base route
    cy.get('#open-rental-form-btn').click()

    // slide open + form injected
    cy.get('.page-wrapper').should('have.class', 'open')
    cy.get('.app-page #rentalAppForm').should('exist')
  })

  // STEP VISIBILITY HELPERS
  const step1 = '.step[data-step="1"]'
  const step2 = '.step[data-step="2"]'

  it('shows step 1 by default', () => {
    cy.get(step1).should('be.visible').and('not.have.attr', 'hidden')
    cy.get(step2).should('have.attr', 'hidden')
  })

  it("validates monthly income before going to step 2", () => {
  cy.get("#open-rental-form-btn").click()

  const step1 = '.step[data-step="1"]'
  const step2 = '.step[data-step="2"]'

  cy.get(step1).should("be.visible")
  cy.get(step2).should("not.be.visible")

  cy.get("#monthlyIncome").type("3000")
  cy.get("#toStep2").click()

  // Much more reliable assertions
  cy.get(step1).should("not.be.visible")
  cy.get(step2).should("be.visible")
})


  it('back button returns from step 2 to step 1', () => {
    cy.get('#monthlyIncome').type('2500')
    cy.get('#toStep2').click()

    cy.get('#backToStep1').click()
    cy.get(step1).should('not.have.attr', 'hidden')
    cy.get(step2).should('have.attr', 'hidden')
  })

  it('requires household size before submit', () => {
    cy.get('#monthlyIncome').type('3000')
    cy.get('#toStep2').click()

    cy.get('#submitAppBtn').click()
    cy.get('#rentalAppForm').then($form => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
    })
  })

  it('submits to API and redirects to results.html', () => {
    cy.intercept(
      'POST',
      'https://lmmx3xcao2.execute-api.us-east-2.amazonaws.com/match',
      {
        statusCode: 200,
        body: {
          user_ami_percent: 60,
          matching_properties: [],
        },
      }
    ).as('amiCheck')

    cy.get('#monthlyIncome').type('3000')
    cy.get('#toStep2').click()
    cy.get('#householdSize').type('3')

    cy.get('#submitAppBtn').click()
    cy.wait('@amiCheck')

    cy.url().should('include', 'results.html')
  })

  it('triggers JSON draft download', () => {
    cy.get('#monthlyIncome').type('3000')
    cy.get('#toStep2').click()
    cy.get('#householdSize').type('3')

    cy.get('#downloadDraft').click()
    // we just assert the button is clickable without errors
  })

  it('closes the slide with Cancel / Close and Back button', () => {
    // Cancel on step 1
    cy.contains('button', 'Cancel').click()
    cy.get('.page-wrapper').should('not.have.class', 'open')
    cy.get('body').should('not.have.class', 'app-open')

    // open again and use header Back
    cy.get('#open-rental-form-btn').click()
    cy.get('#backFromApp').click()
    cy.get('.page-wrapper').should('not.have.class', 'open')
  })
})
