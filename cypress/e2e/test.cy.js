describe('Secret Number Operations', () => {
  beforeEach(() => {
      cy.visit('secretNumber.html');
  });
  
    it('Allows user to play the game', () => {
      // stub math.random() to always return 1 for computer choice
      cy.window().then((win) => {
        cy.stub(win.Math, 'random').returns(1)
      })
  
      cy.get('#number').type('5') // user's choice
      cy.get('#userSubmit').click() // click the submit button
  
      
      cy.get('[data-cy=user]').should('have.text', '5') // check if user choice is displayed correctly
      cy.get('[data-cy=computer]').should('have.text', '') // check if computer choice is displayed correctly
      cy.get('[data-cy=result]').should('have.text', 'The correct answer is lower. Try again!') // check if correct result is displayed
      cy.get('[data-cy=attempts]').should('have.text', '2') // check if attempts left is updated correctly
    })
  
    it('Displays error message for invalid input', () => {
      cy.get('#number').type('11') // invalid number
      cy.get('#userSubmit').click() // click the submit button
  
     
      cy.get('[data-cy=result]').should('have.text', 'Please enter a number between 0 and 10.') // check if error message is displayed
    })
  
    it('Handles out of attempts scenario', () => {
      cy.window().then((win) => {
        const stub = cy.stub(win.Math, 'random')
        stub.onFirstCall().returns(1)
        stub.onSecondCall().returns(1)
        stub.onThirdCall().returns(1)
      })
  
      cy.get('#attempts').then(($attemptsSpan) => {
        const attemptsLeft = parseInt($attemptsSpan.text())
        for (let i = 0; i < attemptsLeft; i++) {
          cy.get('#number').type('3') // type a number 
          cy.get('#userSubmit').click() // click the submit button
          cy.get('#number').clear() // clear the input field
        }
      })
  
      // on the last attempt, submit an incorrect number
      cy.get('#number').type('2')
      cy.get('#userSubmit').click()
      
  
     
      cy.get('[data-cy=result]').should('have.text', 'Out of attempts!') // check if out of attempts message is displayed
    })
  })
  