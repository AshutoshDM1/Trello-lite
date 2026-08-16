import { Router } from 'express';
import userRouter from './user.route.js';
import boardRouter from './board.route.js';
import taskRouter from './task.route.js';

const router = Router();

router.use('/users', userRouter);
router.use('/boards', boardRouter);
router.use('/tasks', taskRouter);

export default router;
