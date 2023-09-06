import express from "express";
import {Login, Logout, Register, getUsers} from '../controllers/Users.js';
import { verifyToken } from "../middleware/VerifyToken.js";
import { RefreshToken } from "../controllers/RefreshToken.js";
import { getPositions } from "../controllers/Positios.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);

router.get('/token', RefreshToken);
router.get('/positions', verifyToken, getPositions);

export default router;