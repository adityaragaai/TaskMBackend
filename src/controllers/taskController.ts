import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

  const task = new Task({
    title,
    description,
    status: status || 'Todo',
    priority: priority || 'Medium',
    dueDate,
    assignedTo,
    projectId,
    createdBy: req.user!._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response) => {
  let tasks;
  if (req.user!.role === 'Admin') {
    tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .populate('createdBy', 'name');
  } else {
    tasks = await Task.find({ assignedTo: req.user!._id })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .populate('createdBy', 'name');
  }
  res.json(tasks);
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title');

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // If user is Member, they can only update status
  if (req.user!.role === 'Member') {
    if (task.assignedTo.toString() !== req.user!._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }
    task.status = status || task.status;
  } else {
    // Admin can update everything
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.projectId = projectId || task.projectId;
  }

  const updatedTask = await task.save();
  res.json(updatedTask);
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};
