/// <reference types="cypress"/>

describe('Casos de Teste para o site computer-database.gatling.io', () => {
  it('Caso de Teste 1: Adicionar um novo computador com sucesso', () => {
    const computerInfo = criarComputador();

    cy.get('.alert-message').should('contain.text', `Done ! Computer ${computerInfo.name} has been created has been created`);
  });

  it('Caso de Teste 2: Editar um computador existente com sucesso', () => {
    const computerInfo = criarComputador();

    cy.visit('https://computer-database.gatling.io/computers');
    cy.contains('td', computerInfo.name)
      .parent('tr')
      .find('td')
      .last()
      .find('a')
      .click();

    const novoNome = 'Novo Nome do Computador';
    cy.get('#name').clear().type(novoNome);
    cy.get('.btn.primary').click();

    cy.get('.alert-message.warning').should('contain.text', `Done! Computer ${novoNome} has been updated`);
  });

  it('Caso de Teste 3: Excluir um computador existente com sucesso', () => {
    const computerInfo = criarComputador();

    cy.visit('https://computer-database.gatling.io/computers');
    cy.contains('td', computerInfo.name)
      .parent('tr')
      .find('td')
      .first()
      .find('input[type="checkbox"]')
      .check();

    cy.get('#bulk-actions').select('delete');
    cy.get('.btn.danger').click();

    cy.get('.alert-message.warning').should('contain.text', `Done! Computer ${computerInfo.name} has been deleted`);
  });

  it('Caso de Teste 4: Pesquisar um computador existente com sucesso', () => {
    const computerInfo = criarComputador();

    cy.visit('https://computer-database.gatling.io/computers');
    cy.get('#searchbox').type(computerInfo.name);
    cy.get('input[type="submit"]').click();

    cy.contains('td', computerInfo.name).should('exist');
  });

  it('Caso de Teste 5: Tentar adicionar um computador com dados inválidos (Negativo)', () => {
    cy.visit('https://computer-database.gatling.io/computers');
    cy.get('#add').click();

    // Não preenche alguns campos necessários, espera que o teste falhe
    cy.get('.btn.primary').click();

    cy.get('.alert-message.warning').should('contain.text', 'Failed to create computer');
  });

  it('Caso de Teste 6: Tentar editar um computador sem fornecer um nome válido (Negativo)', () => {
    const computerInfo = criarComputador();

    cy.visit('https://computer-database.gatling.io/computers');
    cy.contains('td', computerInfo.name)
      .parent('tr')
      .find('td')
      .last()
      .find('a')
      .click();

    // Limpa o campo de nome, espera que o teste falhe
    cy.get('#name').clear();
    cy.get('.btn.primary').click();

    cy.get('.alert-message.warning').should('contain.text', 'Failed to update computer');
  });
});

import moment from 'moment';

function criarComputador() {
  cy.visit('https://computer-database.gatling.io/computers');
  cy.get('#add').click();

  const computerName = 'Test Computer' + Cypress._.random(1, 100); // Adiciona um número aleatório ao nome para evitar duplicatas
  const dataIntroducao = moment().subtract(Cypress._.random(1, 365), 'days').format('YYYY-MM-DD');

  cy.get('#name').type(computerName);
  cy.get('#introduced').type(dataIntroducao);
  cy.get('#discontinued').type('2023-12-31');
  cy.get('#company').select('RCA');

  cy.get('.btn.primary').click();
  cy.get('.alert-message.warning').should('contain.text', `Done! Computer ${computerName} has been created`);

  return {
    name: computerName,
    introduced: dataIntroducao,
  };
}
