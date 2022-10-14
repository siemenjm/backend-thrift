-- Jared accounts (user_id = 1) -----
INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Chase Checking',
    0,
    0,
    'checking',
    1,
    1
);

INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Chase Sapphire Reserve',
    0,
    0,
    'credit card',
    1,
    1
);

INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Chase Freedom',
    0,
    0,
    'credit card',
    1,
    1
);

INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Durango Loan',
    -10000,
    -10000,
    'loan',
    3,
    1
);

-- Rachel accounts (user_id = 2) -----
INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Student Loan',
    -10000,
    -10000,
    'loan',
    4,
    2
);

INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'PNC Checking',
    0,
    0,
    'checking',
    4,
    2
);

-- Isaac accounts (user_id = 3) -----
INSERT INTO accounts (
    name,
    starting_balance,
    current_balance,
    account_type,
    ins_id,
    user_id
) VALUES (
    'Mr. Pig the Bank',
    0,
    0,
    'savings',
    6,
    3
);