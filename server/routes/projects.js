const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
  addMember, addAchievement,
} = require('../controllers/projectController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validate, projectSchema } = require('../validators');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('admin', 'member'), validate(projectSchema), createProject);
router.put('/:id', protect, authorize('admin', 'member'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);
router.post('/:id/members', protect, authorize('admin', 'member'), addMember);
router.post('/:id/achievements', protect, authorize('admin', 'member'), addAchievement);

module.exports = router;
