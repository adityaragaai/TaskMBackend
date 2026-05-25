import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: AuthRequest, res: Response) => {
  const { title, description, teamMembers } = req.body;

  const project = new Project({
    title,
    description,
    createdBy: req.user!._id,
    teamMembers: teamMembers || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: AuthRequest, res: Response) => {
  let projects;
  if (req.user!.role === 'Admin') {
    projects = await Project.find({}).populate('teamMembers', 'name email').populate('createdBy', 'name');
  } else {
    projects = await Project.find({ teamMembers: req.user!._id }).populate('teamMembers', 'name email').populate('createdBy', 'name');
  }
  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req: AuthRequest, res: Response) => {
  const project = await Project.findById(req.params.id).populate('teamMembers', 'name email').populate('createdBy', 'name');

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: AuthRequest, res: Response) => {
  const { title, description, teamMembers } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.teamMembers = teamMembers || project.teamMembers;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: AuthRequest, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};
