/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `signIn.test.js`, contains unit tests for the `signIn` function in the `signInController.js` file. It validates behavior for missing credentials, incorrect email, wrong username, invalid password, and successful authentication using mocked database queries and bcrypt comparisons.
*/

// Import dependencies
import { signIn } from '../controllers/signInController'; // Function under test
import { pool } from '../db.js'; // Mocked database pool
import bcrypt from 'bcrypt'; // Mocked bcrypt library for password comparison

// Mock database and bcrypt modules
jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(), // Mock the query method of the database pool
    },
}));
jest.mock('bcrypt', () => ({
    compare: jest.fn(), // Mock the compare method of bcrypt
}));

describe('signIn', () => {
    let req, res;

    // Setup mock request and response objects before each test
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case: Missing credentials
    it('should return 400 if credentials are missing', async () => {
        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials given in request' });
    });

    // Test case: Email does not exist
    it('should return 400 if email does not exist', async () => {
        req.body = { username: 'user1', email: 'nonexistent@example.com', password: 'password123' };

        // Mock no user found in the database
        pool.query.mockResolvedValueOnce({ rows: [] });

        await signIn(req, res);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=$1', [req.body.email]);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No user associated with that email' });
    });

    // Test case: Wrong username
    it('should return 400 for wrong username', async () => {
        req.body = { username: 'wrongUser', email: 'user@example.com', password: 'password123' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'correctUser', password: 'hashedPassword' }],
        });

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong username given with email' });
    });

    // Test case: Incorrect password
    it('should return 400 for incorrect password', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'wrongPassword' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'user1', password: 'hashedPassword' }],
        });

        bcrypt.compare.mockResolvedValueOnce(false); // Mock password mismatch

        await signIn(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong password given with email' });
    });

    // Test case: Valid credentials
    it('should return 200 and user data for valid credentials', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'correctPassword' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'user1', password: 'hashedPassword', user_id: 123 }],
        });

        bcrypt.compare.mockResolvedValueOnce(true); // Mock successful password match

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Successfully signed in',
            user_id: 123,
        });
    });

    // Test case: Internal server error
    it('should return 500 for internal server errors', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        // Mock database error
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ err: 'Internal Server Error' });
    });
});

