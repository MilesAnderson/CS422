// Import dependencies
import { signIn } from '../controllers/signInController';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('signIn', () => {
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
        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials given in request' });
    });

    it('should return 400 if email does not exist', async () => {
        req.body = { username: 'user1', email: 'nonexistent@example.com', password: 'password123' };

        pool.query.mockResolvedValueOnce({ rows: [] });

        await signIn(req, res);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=$1', [req.body.email]);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No user associated with that email' });
    });

    it('should return 400 for wrong username', async () => {
        req.body = { username: 'wrongUser', email: 'user@example.com', password: 'password123' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'correctUser', password: 'hashedPassword' }],
        });

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong username given with email' });
    });

    it('should return 400 for incorrect password', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'wrongPassword' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'user1', password: 'hashedPassword' }],
        });

        bcrypt.compare.mockResolvedValueOnce(false);

        await signIn(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong password given with email' });
    });

    it('should return 200 and user data for valid credentials', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'correctPassword' };

        pool.query.mockResolvedValueOnce({
            rows: [{ email: 'user@example.com', username: 'user1', password: 'hashedPassword', user_id: 123 }],
        });

        bcrypt.compare.mockResolvedValueOnce(true);

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Successfully signed in',
            user_id: 123,
        });
    });

    it('should return 500 for internal server errors', async () => {
        req.body = { username: 'user1', email: 'user@example.com', password: 'password123' };

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ err: 'Internal Server Error' });
    });
});

