import { Router } from 'express';
import { getBoards, getBoardById } from '../controllers/Board/board.controller.js';

const router = Router();

router.get('/', getBoards);
router.get('/:id', getBoardById);

export default router;
