DROP TABLE IF EXISTS movie, genre, movie_genre;

CREATE TABLE movie (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(255) NOT NULL,
    release_year INT UNSIGNED NOT NULL,
    duration INT UNSIGNED NOT NULL,
    rating DECIMAL(2, 1) UNSIGNED NOT NULL,
    description TEXT
);

CREATE TABLE genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE movie_genre (
    movie_id BINARY(16) REFERENCES movie(id),
    genre_id INT REFERENCES genre(id),
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name) VALUES 
('drama'), 
('crime'), 
('action'), 
('science fiction'), 
('romance'), 
('adventure'), 
('fantasy'), 
('animation'), 
('war'), 
('history'), 
('thriller');

INSERT INTO movie (id, title, release_year, duration, rating, description) VALUES
(UUID_TO_BIN(UUID()), 'inception', 2010, 148, 8.8, 'a thief who steals secrets through the use of dream technology is given the opportunity to have his criminal history erased in exchange for performing one last job: planting an idea in the mind of a target.'),
(UUID_TO_BIN(UUID()), 'the shawshank redemption', 1994, 142, 9.3, 'an innocent man is sentenced to life in prison and forms a friendship with another inmate while seeking a way to escape.'),
(UUID_TO_BIN(UUID()), 'pulp fiction', 1994, 154, 8.9, 'the film intertwines several crime stories in los angeles, exploring themes such as revenge, redemption, and coincidence.'),
(UUID_TO_BIN(UUID()), 'the godfather', 1972, 175, 9.2, 'the story of the corleone crime family, focusing on patriarch vito corleone and his son michael, who is drawn into the world of organized crime.');

INSERT INTO movie_genre (movie_id, genre_id) VALUES
((SELECT id FROM movie WHERE title = 'inception'), (SELECT id FROM genre WHERE name = 'science fiction')),
((SELECT id FROM movie WHERE title = 'inception'), (SELECT id FROM genre WHERE name = 'action')),
((SELECT id FROM movie WHERE title = 'pulp fiction'), (SELECT id FROM genre WHERE name = 'drama')),
((SELECT id FROM movie WHERE title = 'pulp fiction'), (SELECT id FROM genre WHERE name = 'crime')),
((SELECT id FROM movie WHERE title = 'the godfather'), (SELECT id FROM genre WHERE name = 'drama')),
((SELECT id FROM movie WHERE title = 'the godfather'), (SELECT id FROM genre WHERE name = 'crime'));





