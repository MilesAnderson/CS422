import express from 'express';
const router = express.Router();
import { getAllUsers, createUser, updateUser, deleteUser, authenticateUser } from '../controllers/userController.js';

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/authenticate', authenticateUser);

export default router;
