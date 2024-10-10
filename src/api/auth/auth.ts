import express from 'express';
import {loginUser} from '../../controllers/user';
import {registerUser} from '../../controllers/user';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;