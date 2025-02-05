DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL
);

INSERT INTO user (id, name, email, password, rol) VALUES
(UUID_TO_BIN(UUID()), 'Carlos', 'carlos@test.es', '4c75fc5bbe0e99b65b3bc028b7163092f9b7d4e9829df83024a618a5ddcf0cc6038d3d3a1974edfe81ee69b79ae065fed0bc2139ba726838cdc97c9e210ee9b2', 'developer'), 
(UUID_TO_BIN(UUID()), 'Ruben', 'ruben@test.es', '6ba8bdc4a4446045e9aa679a947a4c077b4eb8f52fbf6a6e9dbce879795718eb03a0d2a4320fd70b573af8fbb86b25204b6455acc6f1c43594e3cbd5953b0037', 'client'), 
(UUID_TO_BIN(UUID()), 'Admin', 'admin@test.es', 'e8241bf35d1c70676f0f2305ca35658002343948d8b74b85710f2976f3c37e45df2d7ee6f7630d0b189c1ef4ab957700b5a21a550065bdf90c44631956c7dfec', 'admin');