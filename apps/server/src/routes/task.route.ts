import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from '../controllers/Task/task.controller.js';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

export default router;
