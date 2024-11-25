// Import dependencies
import { signUp } from '../controllers/signUpController';
import { pool } from '../db.js';
import axios from 'axios';

jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

jest.mock('axios', () => ({
    post: jest.fn(),
}));

describe('signUp', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if credentials are missing', async () => {
        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials in request' });
    });

    it('should return 400 if a user with the email already exists', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        pool.query.mockResolvedValueOnce({ rows: [{ email: 'user@example.com' }] });

        await signUp(req, res);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=$1', [req.body.email]);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'A user with that email already exists!' });
    });

    it('should return 200 and create user/portfolio for valid credentials', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        pool.query
            .mockResolvedValueOnce({ rows: [] }) // No existing user
            .mockResolvedValueOnce({ rows: [{ user_id: 123 }] }); // New user after insertion

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

    it('should return 500 for internal server errors', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ err: 'Internal Server Error' });
    });
});

