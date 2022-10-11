CREATE TABLE transactions (
    trans_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) DEFAULT '',
    amount DECIMAL (11, 2) DEFAULT 0,
    trans_type VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    sub_category VARCHAR(255),
    credited_account_id INT,
    debited_account_id INT,
    user_id INT NOT NULL,
    FOREIGN KEY (credited_account_id) REFERENCES accounts (account_id),
    FOREIGN KEY (debited_account_id) REFERENCES accounts (account_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);