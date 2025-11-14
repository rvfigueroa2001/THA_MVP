describe("Security — SQL Injection", () => {
  beforeEach(() => {
    cy.visit("https://main.d87k27j2eqtjc.amplifyapp.com/");
    cy.get("#open-rental-form-btn").click();
  });

  it("blocks SQL injection attempt in monthlyIncome", () => {
    const payload = "' OR 1=1 --";

    cy.get("#monthlyIncome").type(payload);

    // Try continuing
    cy.get("#toStep2").click();

    // Should NOT go to step 2 because input is invalid
    cy.get('.step[data-step="1"]').should("be.visible");
    cy.get('.step[data-step="2"]').should("be.hidden");
  });
});
