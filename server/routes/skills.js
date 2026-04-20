const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/skills.json');

async function readSkills() {
  try {
    await fs.access(DATA_FILE);
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    console.error('Failed to read skills data:', err.message);
    return [];
  }
}

async function writeSkills(skills) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(skills, null, 2));
  } catch (err) {
    console.error('Failed to write skills data:', err.message);
    throw new Error('Could not save skills data');
  }
}

router.get('/', async (req, res) => {
  res.json(await readSkills());
});

router.get('/:id', async (req, res) => {
  const skills = await readSkills();
  const skill = skills.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});

router.post('/', async (req, res) => {
  const { name, category, proficiency, description } = req.body;
  if (!name || !category || !proficiency) {
    return res.status(400).json({ error: 'name, category, and proficiency are required' });
  }
  const skills = await readSkills();
  const newSkill = {
    id: randomUUID(),
    name,
    category,
    proficiency,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  skills.push(newSkill);
  try {
    await writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.status(201).json(newSkill);
});

router.put('/:id', async (req, res) => {
  const skills = await readSkills();
  const index = skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });
  const { name, category, proficiency, description } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (category !== undefined) updates.category = category;
  if (proficiency !== undefined) updates.proficiency = proficiency;
  if (description !== undefined) updates.description = description;
  skills[index] = { ...skills[index], ...updates };
  try {
    await writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json(skills[index]);
});

router.delete('/:id', async (req, res) => {
  const skills = await readSkills();
  const index = skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });
  const deleted = skills.splice(index, 1)[0];
  try {
    await writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json(deleted);
});

module.exports = router;
