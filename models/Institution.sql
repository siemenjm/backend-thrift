CREATE TABLE institutions (
    ins_id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    logo VARCHAR(250),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);