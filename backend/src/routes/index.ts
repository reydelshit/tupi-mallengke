import { Router } from 'express';
import { tenantRouter } from '../api/tenants';
import { paymentLogRouter } from '../api/payment';

const router = Router();

router.use('/tenants', tenantRouter);
router.use('/payments', paymentLogRouter);

export default router;
