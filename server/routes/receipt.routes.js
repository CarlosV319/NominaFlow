import express from 'express';
import { createReceipt, getReceipts } from '../controllers/receiptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getReceipts)
    .post(createReceipt); // Snapshot generation logic

router.get('/:id/pdf', (req, res) => {
    // Placeholder para generación de PDF
    res.status(501).json({ message: 'Generación de PDF pendiente de implementación' });
});

export default router;
