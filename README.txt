Si quieres usar de la clase2 y la clase 3
    En el package.json -> "type" -> Usa "module"

Si quieres usar de la clase4 en adelante
    En el package.json -> "type" -> Usa "commonjs"

#################################################################################
### HOME ########################################################################
#################################################################################

### GET home page
GET http://localhost:8080/

### GET ping-pong
GET http://localhost:8080/ping

##################################################################################
### USERS ########################################################################
##################################################################################

### GET users whit sensitive data
GET http://localhost:8080/users/sensitive

### GET users without sensitive data
GET http://localhost:8080/users

### GET all user data
GET http://localhost:8080/users/bc536717-e3ad-11ef-927b-0242ac140002

### POST register user
POST http://localhost:8080/register
Content-Type: application/json

{
    "password": "0987",
    "email": "test@test.com",
    "rol": "admin"
}

### POST login user
POST http://localhost:8080/login
Content-Type: application/json

{
    "password": "0987",
    "email": "test@test.com"
}

### PUT user
PUT http://localhost:8080/users/abf810cb-f38d-11ef-a2f8-0242ac120002
Content-Type: application/json

{
    "name": "Rebeca",
    "password": "765",
    "email": "rebeca@test.com",
    "rol": "client"
}

### PATCH user
PATCH http://localhost:8080/users/abf810cb-f38d-11ef-a2f8-0242ac120002
Content-Type: application/json

{
    "rol": "admin"
}

### DELETE user
DELETE http://localhost:8080/users/abf810cb-f38d-11ef-a2f8-0242ac120002

### GET users CSV
GET http://localhost:8080/users/csv?headers=["id","email","rol"]&limit=5&name=aaa

### GET users PDF
GET http://localhost:8080/users/pdf?headers=["id","email","rol"]&limit=5&name=aaa
