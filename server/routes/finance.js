const express = require('express');
const router = express.Router();
const {
  getFinances, getFinance, createFinance, updateFinance, deleteFinance,
} = require('../controllers/financeController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validate, financeSchema } = require('../validators');

router.get('/', protect, getFinances);
router.get('/:id', protect, getFinance);
router.post('/', protect, authorize('admin'), validate(financeSchema), createFinance);
router.put('/:id', protect, authorize('admin'), updateFinance);
router.delete('/:id', protect, authorize('admin'), deleteFinance);

module.exports = router;
