CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(250),
    last_name VARCHAR(250),
    email VARCHAR(250),
    password VARCHAR(250),
    avatar VARCHAR(250)
);