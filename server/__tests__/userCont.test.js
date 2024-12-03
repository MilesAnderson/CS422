/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 14 Nov 2024

Description:
This file, `userCont.test.js`, contains unit tests for the functions in `userController.js`. It covers the `getAllUsers`, `createUser`, `updateUser`, `deleteUser`, and `authenticateUser` functions. These tests validate the expected behavior under normal and error conditions using mocked database queries and password hashing.
*/

// Import dependencies
import { getAllUsers, createUser, updateUser, deleteUser, authenticateUser } from '../controllers/userController'; // Controller functions under test
import { pool } from '../db.js'; // Mocked database connection
import bcrypt from 'bcrypt'; // Mocked library for password hashing

beforeAll(async () => {
  // Optional setup tasks before the tests
});

afterAll(async () => {
  await pool.end(); // Close the connection pool after all tests
});

// Mock dependencies
jest.mock('../db.js'); // Mock the database module
jest.mock('bcrypt'); // Mock bcrypt for hashing and comparing passwords

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockRows = [{ id: 1, username: 'testUser' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const req = {};
      const res = { json: jest.fn() };

      await getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockRows);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should handle errors and return 500 status', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return the user data', async () => {
      const mockUser = { id: 1, username: 'newUser', email: 'newUser@test.com', password: 'hashedPassword' };
      bcrypt.hash.mockResolvedValue('hashedPassword');
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const req = { body: { username: 'newUser', email: 'newUser@test.com', password: 'password123' } };
      const res = { json: jest.fn() };

      await createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        ['newUser', 'newUser@test.com', 'hashedPassword']
      );
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors and return 500 status', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));
      const req = { body: { username: 'newUser', email: 'newUser@test.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated data', async () => {
      const mockUpdatedUser = { id: 1, username: 'updatedUser', email: 'updatedUser@test.com' };
      pool.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const req = { params: { id: '1' }, body: { name: 'updatedUser', email: 'updatedUser@test.com' } };
      const res = { json: jest.fn() };

      await updateUser(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        ['updatedUser', 'updatedUser@test.com', '1']
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should handle errors and return 500 status', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: '1' }, body: { name: 'updatedUser', email: 'updatedUser@test.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a confirmation message', async () => {
      pool.query.mockResolvedValue();

      const req = { params: { id: '1' } };
      const res = { json: jest.fn() };

      await deleteUser(req, res);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
    });

    it('should handle errors and return 500 status', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user and return a success message', async () => {
      const mockUser = { id: 1, email: 'user@test.com', password: 'hashedPassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(true);

      const req = { body: { email: 'user@test.com', password: 'password123' } };
      const res = { json: jest.fn() };

      await authenticateUser(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication successful', user: mockUser });
    });

    it('should return 400 if authentication fails', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const req = { body: { email: 'user@test.com', password: 'wrongPassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should handle errors and return 500 status', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = { body: { email: 'user@test.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});

