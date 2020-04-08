describe('cypress-get-table', () => {
    it('adds getTable command', () => {
        expect(cy)
            .property('getTable')
            .to.be.a('function')
    })

    context('Get table', () => {
        beforeEach(() => {
            cy.visit('cypress/integration/index.html')
        })

        it('Expected error when getTable is called with no subject', () => {
            cy.on('fail', (err) => {
                expect(err.message).to.contain('it looks like you are trying to call a child command before running a parent command')
            })
            cy.getTable('#table1')
        })

        it('Assert table data has same results as expected', () => {
            const expected = [
                {
                    "Dessert (100g serving)": "Frozen yoghurt",
                    "Calories": "159",
                    "Fat (g)": "6",
                    "Carbs (g)": "24",
                    "Protein (g)": "4"
                }, {
                    "Dessert (100g serving)": "Ice cream sandwich",
                    "Calories": "237",
                    "Fat (g)": "9",
                    "Carbs (g)": "37",
                    "Protein (g)": "4.3"
                }, {
                    "Dessert (100g serving)": "Cupcake",
                    "Calories": "305",
                    "Fat (g)": "3.7",
                    "Carbs (g)": "67",
                    "Protein (g)": "4.3"
                }
            ]
            cy.get('#table1').getTable().should(tableData => {
                expect(tableData).to.deep.equal(expected)
            })
        })

        it('Assert table data has same results as expected ignoring order - needs deep-equal-in-any-order plugin', () => {
            /**
             * Add following lines in support/index.js file            
                import deepEqualInAnyOrder from "deep-equal-in-any-order"
                chai.use(deepEqualInAnyOrder)
            */
            const expected = [
                {
                    "Dessert (100g serving)": "Ice cream sandwich",
                    "Calories": "237",
                    "Fat (g)": "9",
                    "Carbs (g)": "37",
                    "Protein (g)": "4.3"
                }, {
                    "Dessert (100g serving)": "Cupcake",
                    "Calories": "305",
                    "Fat (g)": "3.7",
                    "Carbs (g)": "67",
                    "Protein (g)": "4.3"
                }, {
                    "Dessert (100g serving)": "Frozen yoghurt",
                    "Calories": "159",
                    "Fat (g)": "6",
                    "Carbs (g)": "24",
                    "Protein (g)": "4"
                }
            ]
            cy.get('#table1').getTable().should(tableData => {
                expect(tableData).to.deep.equalInAnyOrder(expected)
            })
        })

        it('Assert table data has specific row with subset of columns', () => {
            const yoghurt = {
                "Dessert (100g serving)": "Frozen yoghurt",
                "Protein (g)": "4"
            }

            cy.get('#table1').getTable({ onlyColumns: Object.keys(yoghurt) }).should(tableData => {
                expect(tableData).to.deep.include(yoghurt)
            })
        })

        it('Assert table data contain 1 row expected', () => {
            const iceCream = {
                "Dessert (100g serving)": "Ice cream sandwich",
                "Calories": "237",
                "Fat (g)": "9",
                "Carbs (g)": "37",
                "Protein (g)": "4.3"
            }

            cy.get('#table1').getTable().should(tableData => {
                expect(tableData).to.deep.contain(iceCream)
            })
        })

        it('Assert table data contain subset of rows expected', () => {
            const subset = [{
                "Dessert (100g serving)": "Ice cream sandwich",
                "Calories": "237",
                "Fat (g)": "9",
                "Carbs (g)": "37",
                "Protein (g)": "4.3"
            }, {
                "Dessert (100g serving)": "Frozen yoghurt",
                "Calories": "159",
                "Fat (g)": "6",
                "Carbs (g)": "24",
                "Protein (g)": "4"
            }]

            cy.get('#table1').getTable().should(tableData => {
                subset.forEach(item => expect(tableData).to.deep.include(item))
            })
        })

        it('Assert retry ability of table showing after 3 seconds', () => {
            const expected = [{
                "List of Programming Languages": "Javascript"
            }, {
                "List of Programming Languages": "Java"
            }, {
                "List of Programming Languages": "Python"
            }]
            cy.get('#show-table').click()
            cy.get('#table3').getTable().should(tableData => {
                expect(tableData).to.deep.equal(expected)
            })
        })

        it('Expected error when subject finds more than 1 result', () => {
            cy.on('fail', (err) => {
                expect(err.message).to.contain('Selector "table" returned more than 1 element.')
            })
            cy.get('table').getTable().should(tableData => {
                console.log('table data', tableData)
            })
        })

        it('Returns empty if table has no data', () => {
            cy.get('#table2').getTable().should(tableData => {
                expect(tableData).to.be.empty
            })
        })
    })
})