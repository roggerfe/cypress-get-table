# cypress-get-table

Adds `getTable` command to `cypress` test runner.

## Install

```sh
npm install --save cypress-get-table
```

Then include in your project's `cypress/support/index.js`

```sh
require('cypress-get-table')
```

## Usage

Ater installation, `cy` object will have `getTable` command.
The command can ONLY be called chained after a subject.

Incorrect usage:

```js
cy.getTable('table#table1')
```

Correct usage:

```js
cy.get('table#table1').getTable()
```

### Return of getTable

Suppose you have this table in your webpage:

| City           	| Country   	|
|----------------	|-----------	|
| Rio de Janeiro 	| Brazil    	|
| Los Angeles    	| USA       	|
| Buenos Aires   	| Argentina 	|

`cy.get("table").getTable()` will return the following list of objects:

```json
[{
    "City": "Rio de Janeiro",
    "Country": "Brazil"
}, {
    "City": "Los Angeles",
    "Country": "USA"
}, {
    "City": "Buenos Aires",
    "Country": "Argentina"
}]
```

If table is empty (with only headers), getTable() will return an empty list.

## Examples

### 1. Validate empty table

Given table:
| City           	| Country   	|
|----------------	|-----------	|
|  	                |     	        |

**Code:**

```javascript
cy.get('table').getTable().should(tableData => {
    expect(tableData).to.be.empty
})
```

### 2. Validate if table has the exact data in exact order as expected

**Given table:**

| City           	| Country   	|
|----------------	|-----------	|
| Rio de Janeiro 	| Brazil    	|
| Los Angeles    	| USA       	|

**Code:**

```javascript
const expected = [
    {
        "City": "Rio de Janeiro",
        "Country": "Brazil"
    }, {
        "Country": "USA",
        "City": "Los Angeles"
    }
]
cy.get('table').getTable().should(tableData => {
    expect(tableData).to.deep.equal(expected)
})
```

### 3. Validate if table has the exact data ignoring order

**Given table:**

| City           	| Country   	|
|----------------	|-----------	|
| Rio de Janeiro 	| Brazil    	|
| Los Angeles    	| USA       	|

**Code:**

```javascript
const expected = [
    {
        "Country": "USA",
        "City": "Los Angeles"
    }, {
        "City": "Rio de Janeiro",
        "Country": "Brazil"
    }
]
cy.get('table').getTable().should(tableData => {
    expect(tableData).to.deep.equalInAnyOrder(expected)
})
```

**FYI:** For this case, `deep-equal-in-any-order` chai plugin is needed, so you have to add this code in `support/index.js` file:

```javascript
import deepEqualInAnyOrder from "deep-equal-in-any-order"
chai.use(deepEqualInAnyOrder)
```

## 4. Validate if table has a subset of expected rows

**Given table:**

| City           	| Country   	|
|----------------	|-----------	|
| Rio de Janeiro 	| Brazil    	|
| Los Angeles    	| USA       	|

**Code:**

```javascript
const expected = [
    {
        "Country": "USA",
        "City": "Los Angeles"
    }
]
cy.get('table').getTable().should(tableData => {
    expected.forEach(item => expect(tableData).to.deep.include(item))
})
```

## 5. Validate if table has a subset of expected rows ommiting some columns

**Given table:**

| City           	| State          | Country   	|
|----------------	|----------------| -----------	|
| Rio de Janeiro 	| Rio de Janeiro | Brazil    	|
| Los Angeles    	| California     | USA       	|

**Code:**

```javascript
const losAngeles = {
    "City": "Los Angeles",
    "Country": "USA"
}
cy.get('table').getTable({ onlyColumns: Object.keys(losAngeles) }).should(tableData => {
    expect(tableData).to.deep.include(losAngeles)

})
```

As you can see for this case is necessary to pass key `'onlyColumns'` which is a list of string of all columns needed.

* If you need more examples, go to `cypress/integration/spec.js` and let the tets speak for itself.

## Limitations

* This library only works if your table uses the correct tags, which is `thead/th` For table head and table header, and `tr/td` for table row and table data.

* Does not handle pagination neither infinite scrolling

* Table needs to have a table header

* Does not handle colspan neither rowspan

## Roadmap

- [ ] Implement Continuous Integration with Circle CI
- [ ] Implement a way to handle pagination and infinite scrolling
- [ ] Implement a way to handle tables that are not structures as default html tags, several front end frameworks generate pleasant grids that are a bunch of divs 
- [ ] Improve logs of assertion errors

## Issues

Please do not hesitate to open bugs, issues and enhancements, and feel free to add more features and make this library more useful for others and make a pull request.