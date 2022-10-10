-- Jared transactions (user_id = 1) -----
INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    debited_account_id,
    user_id
) VALUES (
    '2022-10-01',
    'paycheck',
    1562.76,
    'income',
    'work',
    'net paycheck',
    1,
    1
);

INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    credited_account_id,
    user_id
) VALUES (
    '2022-10-02',
    'gas',
    63.80,
    'expense',
    'transportation',
    'fuel',
    3,
    1
);

INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    credited_account_id,
    user_id
) VALUES (
    '2022-10-03',
    'netflix',
    15.59,
    'expense',
    'play and fun',
    'netflix',
    3,
    1
);

INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    credited_account_id,
    user_id
) VALUES (
    '2022-10-04',
    'meijer',
    301.22,
    'expense',
    'food',
    'groceries',
    3,
    1
);

-- Rachel transactions (user_id = 2) -----
INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    credited_account_id,
    user_id
) VALUES (
    '2022-10-05',
    'tropical smoothie',
    14.72,
    'expense',
    'food',
    'fast food',
    6,
    2
);

-- Isaac transactions (user_id = 3) -----
INSERT INTO transactions (
    date,
    description,
    amount,
    trans_type,
    category,
    sub_category,
    credited_account_id,
    user_id
) VALUES (
    '2022-10-05',
    'cherry tomato',
    0.05,
    'expense',
    'food',
    'groceries',
    7,
    3
);