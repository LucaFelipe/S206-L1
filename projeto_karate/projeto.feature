Feature: Testes para a Weatherstack API

Background:
  * url 'http://api.weatherstack.com'
  * def apiKey = 'SuaChaveDeAPI'

Scenario: Obter a previsão do tempo para uma cidade válida
  Given path '/current'
  And param access_key = apiKey
  And param query = 'London'
  When method get
  Then status 200
  And match response.success == true
  And match response.location.name == 'London'

Scenario: Tentar obter a previsão do tempo para uma cidade inexistente
  Given path '/current'
  And param access_key = apiKey
  And param query = 'CidadeInexistente'
  When method get
  Then status 404
  And match response.success == false
  And match response.error.code == 615
  And match response.error.type == 'no_matching_city'

Scenario: Obter a previsão do tempo para uma cidade com informações adicionais
  Given path '/current'
  And param access_key = apiKey
  And param query = 'Paris'
  And param units = 'metric'
  When method get
  Then status 200
  And match response.success == true
  And match response.location.name == 'Paris'
  And match response.current.temperature > 0

Scenario: Tentar obter a previsão do tempo sem chave de API
  Given path '/current'
  And param query = 'Berlin'
  When method get
  Then status 401
  And match response.success == false
  And match response.error.code == 101
  And match response.error.type == 'missing_access_key'

Scenario: Obter a previsão do tempo para coordenadas geográficas específicas
  Given path '/current'
  And param access_key = apiKey
  And param query = '48.8566,2.3522'
  When method get
  Then status 200
  And match response.success == true
  And match response.location.name == 'Paris'

Scenario: Tentar obter a previsão do tempo com uma consulta inválida
  Given path '/current'
  And param access_key = apiKey
  And param query = ' '
  When method get
  Then status 400
  And match response.success == false
  And match response.error.code == 603
  And match response.error.type == 'invalid_access_key'
