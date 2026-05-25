import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  let query = {};
  if (req.user!.role !== 'Admin') {
    query = { assignedTo: req.user!._id };
  }

  const totalTasks = await Task.countDocuments(query);
  const completedTasks = await Task.countDocuments({ ...query, status: 'Done' });
  const pendingTasks = await Task.countDocuments({ ...query, status: { $ne: 'Done' } });
  
  const now = new Date();
  const overdueTasks = await Task.countDocuments({ ...query, status: { $ne: 'Done' }, dueDate: { $lt: now } });

  const tasksByStatus = await Task.aggregate([
    { $match: query },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    tasksByStatus: tasksByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), { Todo: 0, 'In Progress': 0, Done: 0 }),
  });
};

// @desc    Get overdue tasks
// @route   GET /api/dashboard/overdue
// @access  Private
export const getOverdueTasks = async (req: AuthRequest, res: Response) => {
  let query = {};
  if (req.user!.role !== 'Admin') {
    query = { assignedTo: req.user!._id };
  }

  const now = new Date();
  const overdueTasks = await Task.find({ ...query, status: { $ne: 'Done' }, dueDate: { $lt: now } })
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title');

  res.json(overdueTasks);
};
