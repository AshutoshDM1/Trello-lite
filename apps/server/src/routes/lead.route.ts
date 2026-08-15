import { Router } from 'express';
import {
  publicCreateLead,
  getAllLeads,
  createLead,
  updateLead,
  deleteLead,
  getLeadNotes,
  addLeadNote,
} from '../controllers/Lead/lead.controller.js';

const router = Router();

// Public endpoint for lead submission form (no auth)
router.post('/public', publicCreateLead);

// Authenticated endpoints for dashboard
router.get('/', getAllLeads);
router.post('/', createLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

// Lead notes & activity history endpoints
router.get('/:id/notes', getLeadNotes);
router.post('/:id/notes', addLeadNote);

export default router;
