CREATE TABLE institutions (
    ins_id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    logo VARCHAR(250),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);