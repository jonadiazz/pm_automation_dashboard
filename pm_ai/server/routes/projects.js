const express = require('express');
const router = express.Router();

// In-memory project store
let projects = [
  {
    id: 1,
    name: 'PM Dashboard MVP',
    description: 'Building the initial version of PM automation dashboard',
    status: 'active',
    createdAt: new Date().toISOString(),
    userId: 1
  }
];

// Get all projects for user
router.get('/', (req, res) => {
  // In real app, filter by authenticated user
  res.json(projects);
});

// Get single project
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create new project
router.post('/', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    description: description || '',
    status: 'active',
    createdAt: new Date().toISOString(),
    userId: 1 // In real app, get from authenticated user
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
router.put('/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, status } = req.body;
  const project = projects[projectIndex];

  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  project.updatedAt = new Date().toISOString();

  projects[projectIndex] = project;
  res.json(project);
});

// Delete project
router.delete('/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully' });
});

module.exports = router;