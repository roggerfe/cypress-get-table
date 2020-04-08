/// <reference types="cypress" />

const getTable = (subject, options = {}) => {
    if (subject.get().length > 1) throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)

    const tableElement = subject.get()[0]
    let headers = [...tableElement.querySelectorAll('thead th')].map(e => e.textContent)

    // transform rows into array of array of strings for each td
    const rows = [...tableElement.querySelectorAll('tbody tr')].map(row => {
        return [...row.querySelectorAll('td')].map(e => e.textContent)
    })
    
    // return structured object from headers and rows variables
    return rows.map(row =>
        row.reduce((acc, curr, idx) => {
            if (options.onlyColumns && !options.onlyColumns.includes(headers[idx])) {
                // dont include columns that are not present in onlyColumns
                return { ...acc }
            }
            return { ...acc, [headers[idx]]: curr }
        }, {})
    )
}

Cypress.Commands.add('getTable', { prevSubject: true }, getTable)