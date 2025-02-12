import supertest from 'supertest'
import initApiRest, { app } from '../../index'
import { Server } from 'http'
import TestAgent from 'supertest/lib/agent'

describe('User Model tests', () => {
  let server: Server
  let api: TestAgent

  // Arrange
  beforeAll(() => {
    api = supertest(app)
    server = initApiRest(8081)
  })

  test('Get users whit sensitive data', async () => {
    // Act
    const response = await api.get('/users')

    // Assert
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toContain('application/json')
  })

  afterAll(() => {
    server.close()
  })
})
