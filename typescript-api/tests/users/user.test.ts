import supertest from 'supertest'
import initApiRest, { app } from '../../index'
import { Server } from 'http'
import TestAgent from 'supertest/lib/agent'
import { NoSensitiveInfoUser, Token, User } from '../../src/users/models/user'

describe('USERS ENDPOINTS', () => {
  let server: Server
  let api: TestAgent

  // Arrange
  beforeAll(() => {
    api = supertest(app)
    server = initApiRest(8081)
  })

  // ******************************
  // * GET ALL SENSITIVE **********
  // ******************************
  describe('ALL', () => {
    test('GET / -> All users', async () => {
      // Act
      const response = await api.get('/users')
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body).toMatchObject<User[]>(response.body)
    })

    test('GET /sensitive -> All users with sensitive data', async () => {
      // Act
      const response = await api.get('/users/sensitive')
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body).toMatchObject<NoSensitiveInfoUser[]>(response.body)
    })
  })

  // ******************************
  // * USER CRUD ******************
  // ******************************
  describe('CRUD', () => {
    let userToTesting: User

    test('POST / -> Register user', async () => {
      // Act
      const response = await api.post('/register')
      .set('Accept', 'application/json')
      .send({
        "email": "test@testing.es",
        "password": "1234",
        "rol": "client"
      })
      
  
      // Assert
      expect(response.statusCode).toBe(201)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body).toMatchObject<User>(response.body)
      userToTesting = response.body
    })

    test('POST / -> Login user', async () => {
      // Act
      const response = await api.post('/login')
      .set('Accept', 'application/json')
      .send({
        "email": "test@testing.es",
        "password": "1234",
      })
      
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body).toMatchObject<Token>(response.body)
    })

    test('GET /:id -> Data of the user', async () => {
      // Act
      const response = await api.get(`/users/${userToTesting.id}`)
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body).toMatchObject<User>(response.body)
    })
  
    test('PUT /:id -> Edit all user', async () => {
      userToTesting = {
        ...userToTesting,
        "name": "testPut",
        "email": "test@put.es",
        "password": "0987",
        "rol": "developer"
      }

      // Act
      const response = await api.put(`/users/${userToTesting.id}`)
      .set('Accept', 'application/json')
      .send(userToTesting)
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body.data).toStrictEqual(userToTesting)
    })
  
    test('PATCH /:id -> Edit partial user', async () => {
      userToTesting = {
        ...userToTesting,
        "rol": "admin"
      }

      // Act
      const response = await api.patch(`/users/${userToTesting.id}`)
      .set('Accept', 'application/json')
      .send({
        "rol": "admin"
      })
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body.data).toStrictEqual(userToTesting)
    })
  
    test('DELETE /:id -> Delete user', async () => {
      // Act
      const response = await api.delete(`/users/${userToTesting.id}`)
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/json')
      expect(response.body.data).toStrictEqual(userToTesting)
    })
  })

  // ******************************
  // * GET FILES ******************
  // ******************************
  describe('FILES', () => {
    test('GET /csv -> CSV of users data', async () => {
      // Act
      const response = await api.get('/users/csv')
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('text/csv')
    })
  
    test('GET /pdf -> PDF of users data', async () => {
      // Act
      const response = await api.get('/users/pdf')
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.header['content-type']).toContain('application/pdf')
    })
  })

  afterAll(() => {
    server.close()
  })
})
