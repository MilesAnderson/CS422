/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 14 Nov 2024

Description:
This file, `userRoutes.test.js`, contains unit tests for the routes defined in `userRoutes.js`. It tests functionality for retrieving, creating, updating, deleting, and authenticating users using a mocked database and hashing library.
*/

import request from 'supertest'; // Library for testing HTTP endpoints
import express from 'express'; // Web framework for creating an application
import userRoutes from '../routes/userRoutes'; // Routes being tested
import { pool } from '../db.js'; // Mocked database connection
import bcrypt from 'bcrypt'; // Mocked library for password hashing and comparison

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use('/api', userRoutes); // Use the routes defined in `userRoutes.js`

// Mock database and bcrypt modules
jest.mock('../db.js');
jest.mock('bcrypt');

beforeAll(() => {
  // Setup operations before the tests
});

afterAll(async () => {
  await pool.end(); // Close the database connection after all tests
});

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockRows = [{ id: 1, username: 'testUser' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 1, username: 'newUser', email: 'newUser@test.com', password: 'hashedPassword' };
      bcrypt.hash.mockResolvedValue('hashedPassword');
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const response = await request(app).post('/api/users').send({
        username: 'newUser',
        email: 'newUser@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        ['newUser', 'newUser@test.com', 'hashedPassword']
      );
    });

    it('should return 500 on hashing error', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      const response = await request(app).post('/api/users').send({
        username: 'newUser',
        email: 'newUser@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const mockUpdatedUser = { id: 1, username: 'updatedUser', email: 'updatedUser@test.com' };
      pool.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const response = await request(app).put('/api/users/1').send({
        name: 'updatedUser',
        email: 'updatedUser@test.com',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedUser);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        ['updatedUser', 'updatedUser@test.com', '1']
      );
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/api/users/1').send({
        name: 'updatedUser',
        email: 'updatedUser@test.com',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      pool.query.mockResolvedValue();

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted' });
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', ['1']);
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /api/users/authenticate', () => {
    it('should authenticate a user', async () => {
      const mockUser = { id: 1, email: 'user@test.com', password: 'hashedPassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app).post('/api/users/authenticate').send({
        email: 'user@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Authentication successful', user: mockUser });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should return 400 if authentication fails', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).post('/api/users/authenticate').send({
        email: 'user@test.com',
        password: 'wrongPassword',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/users/authenticate').send({
        email: 'user@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});

