import { Router } from 'express';
import userRouter from './user.route.js';
import leadRouter from './lead.route.js';

const router = Router();

router.use('/users', userRouter);
router.use('/leads', leadRouter);

export default router;
