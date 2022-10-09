CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    starting_balance INT NOT NULL,
    current_balance INT,
    account_type VARCHAR(255) NOT NULL,
    ins_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (ins_id) REFERENCES institutions (ins_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);