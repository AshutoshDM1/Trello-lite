import { Router } from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/Board/board.controller.js';

const router = Router();

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoardById);
router.patch('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
