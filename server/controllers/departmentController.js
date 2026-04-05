const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('lead', 'name email')
      .populate('members.user', 'name email')
      .populate('tasks.assignedTo', 'name email');
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
exports.getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('lead', 'name email')
      .populate('members.user', 'name email')
      .populate('tasks.assignedTo', 'name email');
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/departments
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to department
// @route   POST /api/departments/:id/members
exports.addMember = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    department.members.push({ user: req.body.userId, role: req.body.role || 'member' });
    await department.save();
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Add task to department
// @route   POST /api/departments/:id/tasks
exports.addTask = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    department.tasks.push(req.body);
    await department.save();
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task in department
// @route   PUT /api/departments/:id/tasks/:taskId
exports.updateTask = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    const task = department.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    Object.assign(task, req.body);
    await department.save();
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};
