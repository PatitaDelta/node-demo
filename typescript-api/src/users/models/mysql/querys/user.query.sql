DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL
);

INSERT INTO user (id, name, email, password, rol) VALUES
(UUID_TO_BIN(UUID()), 'Carlos', 'carlos@test.es', '1234', 'developer'), 
(UUID_TO_BIN(UUID()), 'Ruben', 'ruben@test.es', '4321', 'client'), 
(UUID_TO_BIN(UUID()), 'Admin', 'admin@test.es', 'admin', 'admin');