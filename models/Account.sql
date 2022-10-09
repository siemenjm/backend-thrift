CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    starting_balance DECIMAL (11, 2) NOT NULL,
    current_balance DECIMAL (11, 2),
    account_type VARCHAR(255) NOT NULL,
    ins_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (ins_id) REFERENCES institutions (ins_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);