describe('Main Application', () => {
  beforeEach(() => {
    // Visit the main page before each test
    cy.visit('https://main.d87k27j2eqtjc.amplifyapp.com/')
  })

  it('should load the main page successfully', () => {
    // Check that the page loads
    cy.get('body').should('be.visible')
  })

})

describe('Rental Application Form', () => {
  beforeEach(() => {
    cy.visit('/') // or your app URL
    cy.get('#open-rental-form-btn').click()
    cy.get('.app-page').should('be.visible')
  })

  it('loads the rental form correctly', () => {
    cy.contains('Applicant Information').should('be.visible')
    cy.get('#rentalAppForm').should('exist')
  })

  it('fills and submits the form', () => {
    // Personal info
    cy.get('#fullName').type('Jane Smith')
    cy.get('#phone').type('2395551234')
    cy.get('#email2').type('jane@example.com')
    cy.get('#lang').select('English')
    cy.get('#address').type('456 Sunshine Blvd, Fort Myers, FL 33901')

    // Household info
    cy.get('#householdSize').type('4')
    cy.get('#bedroomsNeed').select('3+')
    cy.get('#county').type('Lee')

    // Income & employment
    cy.get('#monthlyIncome').type('3800')
    cy.get('#employmentStatus').select('Full-time')

    // Housing
    cy.get('#currentRent').type('1200')
    cy.get('#leaseEnd').type('2025-12-31')
    cy.get('#risk').select('No')

    // Consent & signature
    cy.get('#consent').check()
    cy.get('#signature').type('Jane Smith')
    cy.get('#signDate').type('2025-11-03')

    // Submit
    cy.get('#rentalAppForm button[type="submit"]').click()

    // Cypress can confirm alert text
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Application submitted')
    })
  })

  it('allows user to close the form', () => {
    cy.get('#closeApp').click()
    cy.get('body').should('not.have.class', 'app-open')
  })
})

describe('Rental Application Form - Security & Validation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#open-rental-form-btn').click()
    cy.get('#rentalAppForm').should('exist')
  })

  it('prevents script injection in text fields', () => {
    const payload = `<script>alert('xss')</script>`

    // Try injecting in text inputs
    cy.get('#fullName').type(payload)
    cy.get('#address').type(payload)
    cy.get('#county').type(payload)

    // Check that the value is escaped and not executed
    cy.get('#fullName').should('have.value', payload)
    cy.get('#address').should('have.value', payload)
    cy.get('#county').should('have.value', payload)

    // There should be no alert popup triggered
    cy.on('window:alert', () => {
      throw new Error('XSS alert executed!')
    })
  })

  it('rejects invalid emails and phone numbers', () => {
    cy.get('#email2').type('not-an-email')
    cy.get('#phone').type('abc123')

    // Try submitting
    cy.get('#consent').check()
    cy.get('#signature').type('Test')
    cy.get('#signDate').type('2025-11-03')
    cy.get('#rentalAppForm button[type="submit"]').click()

    // Browser's built-in validation should block submit
    cy.get('#rentalAppForm').then(($form) => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
    })
  })

  it('blocks negative or unrealistic numeric values', () => {
    cy.get('#householdSize').type('-5')
    cy.get('#monthlyIncome').type('-99999')
    cy.get('#currentRent').type('99999999')

    cy.get('#rentalAppForm button[type="submit"]').click()

    cy.get('#rentalAppForm').then(($form) => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
    })
  })

})
describe('AffordaHouse Portal – Advanced Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#open-rental-form-btn').click()
    cy.get('#rentalAppForm').should('exist')
  })

  // 🧩 T-11 Responsive Layout
  it('displays correctly on mobile, tablet, and desktop', () => {
    const viewports = [
      [375, 667],   // mobile
      [768, 1024],  // tablet
      [1280, 800]   // desktop
    ]

    viewports.forEach(([width, height]) => {
      cy.viewport(width, height)
      cy.get('.hero-card').should('be.visible')
      cy.get('#open-rental-form-btn').should('be.visible')
    })
  })

  // 🔐 T-15 Double Submit Prevention (updated)
it('prevents double submission of form', () => {
  cy.get('#fullName').type('John Test')
  cy.get('#phone').type('2395557890')
  cy.get('#email2').type('john@test.com')
  cy.get('#lang').select('English')
  cy.get('#address').type('100 Test St')
  cy.get('#householdSize').type('2')
  cy.get('#bedroomsNeed').select('2')
  cy.get('#county').type('Collier')
  cy.get('#monthlyIncome').type('3000')
  cy.get('#employmentStatus').select('Full-time')
  cy.get('#currentRent').type('1000')
  cy.get('#risk').select('No')
  cy.get('#consent').check()
  cy.get('#signature').type('John Test')
  cy.get('#signDate').type('2025-11-03')

  let alertCount = 0
  cy.on('window:alert', (text) => {
    alertCount++
    expect(text).to.contain('Application submitted')
  })

  // Click once
  cy.contains('button', 'Submit Application').click()

  // Wait for button to disable
  cy.get('button[type="submit"]').should('be.disabled')

  // Try clicking again — should not trigger second alert
  cy.wait(500)
  cy.contains('button', 'Submit Application').click({ force: true })

  // Verify only one alert occurred
  cy.wrap(null).then(() => {
    expect(alertCount).to.eq(1)
  })
})

  // 🔒 T-16 Empty Required Fields
  it('blocks submission when required fields are missing', () => {
    cy.contains('button', 'Submit Application').click()
    cy.get('#rentalAppForm').then(($form) => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
    })
  })

  // ⚖️ T-18 Consent Not Checked
  it('requires consent checkbox before submission', () => {
    cy.get('#fullName').type('User No Consent')
    cy.get('#phone').type('1234567890')
    cy.get('#email2').type('user@test.com')
    cy.get('#lang').select('English')
    cy.get('#address').type('123 No Consent St')
    cy.get('#householdSize').type('1')
    cy.get('#bedroomsNeed').select('1')
    cy.get('#county').type('Lee')
    cy.get('#monthlyIncome').type('2500')
    cy.get('#employmentStatus').select('Part-time')
    cy.get('#currentRent').type('800')
    cy.get('#risk').select('No')
    cy.get('#signature').type('User No Consent')
    cy.get('#signDate').type('2025-11-03')

    cy.contains('button', 'Submit Application').click()
    cy.get('#rentalAppForm').then(($form) => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
    })
  })

  // ↩️ T-19 Back Button
  it('closes slide-out form with Back button', () => {
    cy.get('#backFromApp').should('be.visible').click()
    cy.get('body').should('not.have.class', 'app-open')
    cy.get('.app-page').should('be.empty')
  })

  // ⚙️ T-22 Performance Timing
  it('ensures slide animation completes within 1 second', () => {
    cy.clock()
    cy.visit('/')
    cy.get('#open-rental-form-btn').click()
    cy.tick(1000)
    cy.get('.page-wrapper').should('have.class', 'open')
  })
})

