describe('React Home Page', () =>{
    it('Loaded', ()=>{
        // test reactjs default website
        cy.visit('http://localhost:3000/')

        cy.get('button.Counter_button__Zr9et')
        .contains('+')
        .click()
    })
})