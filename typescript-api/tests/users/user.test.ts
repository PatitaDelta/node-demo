import supertest from 'supertest'
import { app } from '../../index'

describe('User Model tests', () => {
  const api = supertest(app)
  test('Get users whit sensitive data', async () => {
    // Arrange

    // Act
    await api.get('/users')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .catch(console.error)

    // Assert
  })
})
