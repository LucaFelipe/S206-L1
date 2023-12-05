Feature: Testes da PokeAPI

  Background:
    * url 'https://pokeapi.co/api/v2'

  Scenario: Consulta de Pokémon por ID (GET)
    Given path '/pokemon/1'
    When method GET
    Then status 200
    And match response.name == 'bulbasaur'
    And match response.types[0].type.name == 'grass'
    And match response.types[1].type.name == 'poison'

  Scenario: Consulta de Habilidade por Nome (GET)
    Given path '/ability/overgrow'
    When method GET
    Then status 200
    And match response.name == 'overgrow'
    And match response.effect_entries[0].short_effect == 'Powers up Grass-type moves when the Pokémon's HP is low.'

  Scenario: Listagem de Itens (GET)
    Given path '/item'
    When method GET
    Then status 200
    And match response.count == 954
    And match response.results contains { name: 'master-ball', url: 'https://pokeapi.co/api/v2/item/1/' }

  Scenario: Consulta de Pokémon Inexistente por ID (GET)
    Given path '/pokemon/9999'
    When method GET
    Then status 404
    And match response.detail == 'Not found.'

  Scenario: Consulta de Pokémon por Nome (GET)
    Given path '/pokemon/{name}'
    And param name = 'charizard'
    When method GET
    Then status 200
    And match response.name == 'charizard'
    And match response.types[0].type.name == 'fire'
    And match response.types[1].type.name == 'flying'
