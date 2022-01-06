/// <reference types="cypress" />

interface CypressGetTableOptions {
  onlyColumns?: Array<string>;
}

declare namespace Cypress {
  interface Chainable {
    getTable(
      options?: CypressGetTableOptions
    ): Chainable<Array<Record<string, string>>>;
  }
}
