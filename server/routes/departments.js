const express = require('express');
const router = express.Router();
const {
  getDepartments, getDepartment, createDepartment,
  updateDepartment, deleteDepartment, addMember, addTask, updateTask,
} = require('../controllers/departmentController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validate, departmentSchema } = require('../validators');

router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartment);
router.post('/', protect, authorize('admin'), validate(departmentSchema), createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);
router.post('/:id/members', protect, authorize('admin', 'member'), addMember);
router.post('/:id/tasks', protect, authorize('admin', 'member'), addTask);
router.put('/:id/tasks/:taskId', protect, authorize('admin', 'member'), updateTask);

module.exports = router;
