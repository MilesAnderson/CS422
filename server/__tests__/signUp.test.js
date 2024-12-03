/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `signUp.test.js`, contains unit tests for the `signUp` function in the `signUpController.js` file. It validates the behavior for missing credentials, existing users, successful sign-up, and internal server errors using mocked database queries and API calls.
*/

// Import dependencies
import { signUp } from '../controllers/signUpController'; // Function under test
import { pool } from '../db.js'; // Mocked database pool
import axios from 'axios'; // Mocked HTTP client for API calls

// Mock database and axios modules
jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(), // Mock the query method of the database pool
    },
}));
jest.mock('axios', () => ({
    post: jest.fn(), // Mock the post method of axios
}));

describe('signUp', () => {
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
        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials in request' });
    });

    // Test case: Email already exists
    it('should return 400 if a user with the email already exists', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        // Mock database response for an existing user
        pool.query.mockResolvedValueOnce({ rows: [{ email: 'user@example.com' }] });

        await signUp(req, res);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=$1', [req.body.email]);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'A user with that email already exists!' });
    });

    // Test case: Successful sign-up
    it('should return 200 and create user/portfolio for valid credentials', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        // Mock database and API responses
        pool.query
            .mockResolvedValueOnce({ rows: [] }) // No existing user
            .mockResolvedValueOnce({ rows: [{ user_id: 123 }] }); // User created
        axios.post.mockResolvedValueOnce({}); // Mock user creation API
        axios.post.mockResolvedValueOnce({}); // Mock portfolio creation API

        await signUp(req, res);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=$1', [req.body.email]);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/users', {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/portfolios', { user_id: 123 });
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

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ err: 'Internal Server Error' });
    });
});

