const Finance = require('../models/Finance');

// @desc    Get all finance records
// @route   GET /api/finance
exports.getFinances = async (req, res, next) => {
  try {
    const { type, category, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const records = await Finance.find(filter)
      .populate('event', 'title')
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    // Calculate summary
    const allRecords = await Finance.find();
    const totalIncome = allRecords
      .filter((r) => r.type === 'income' && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = allRecords
      .filter((r) => r.type === 'expense' && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalSponsorship = allRecords
      .filter((r) => r.type === 'sponsorship' && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = allRecords
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
      summary: {
        totalIncome,
        totalExpense,
        totalSponsorship,
        pendingAmount,
        balance: totalIncome + totalSponsorship - totalExpense,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single finance record
// @route   GET /api/finance/:id
exports.getFinance = async (req, res, next) => {
  try {
    const record = await Finance.findById(req.params.id)
      .populate('event', 'title')
      .populate('createdBy', 'name');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create finance record
// @route   POST /api/finance
exports.createFinance = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const record = await Finance.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update finance record
// @route   PUT /api/finance/:id
exports.updateFinance = async (req, res, next) => {
  try {
    const record = await Finance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete finance record
// @route   DELETE /api/finance/:id
exports.deleteFinance = async (req, res, next) => {
  try {
    const record = await Finance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    next(error);
  }
};
