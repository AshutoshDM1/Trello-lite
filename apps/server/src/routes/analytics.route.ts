import { Router } from 'express';
import { getOverviewAnalytics } from '../controllers/Analytics/analytics.controller.js';

const router = Router();

router.get('/overview', getOverviewAnalytics);

export default router;
