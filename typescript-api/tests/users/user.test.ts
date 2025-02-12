import supertest from 'supertest'
import initApiRest, { app } from '../../index'
import { Server } from 'http'
import TestAgent from 'supertest/lib/agent'
import { MysqlConfig } from '../../src/users/models/mysql/mysql.config'

describe('User Model tests', () => {
  let server: Server
  let api: TestAgent
  
  beforeAll(()=>{
    api = supertest(app)
    server = initApiRest(8081)
  })

  test('Get users whit sensitive data', async () => {
    // Arrange

    // Act
    await api.get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Assert
  })

  afterAll(()=>{
    server.close()
  })
})
