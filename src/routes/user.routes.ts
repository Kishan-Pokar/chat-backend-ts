import { Router } from 'express';
import { registerUser, loginUser, getAllUsersAndGroups } from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/', getAllUsersAndGroups);

export default router;