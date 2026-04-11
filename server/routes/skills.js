const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/skills.json');

function readSkills() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read skills data:', err.message);
    return [];
  }
}

function writeSkills(skills) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(skills, null, 2));
  } catch (err) {
    console.error('Failed to write skills data:', err.message);
    throw new Error('Could not save skills data');
  }
}

router.get('/', (req, res) => {
  res.json(readSkills());
});

router.get('/:id', (req, res) => {
  const skills = readSkills();
  const skill = skills.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});

router.post('/', (req, res) => {
  const { name, category, proficiency, description } = req.body;
  if (!name || !category || !proficiency) {
    return res.status(400).json({ error: 'name, category, and proficiency are required' });
  }
  const skills = readSkills();
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
    writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.status(201).json(newSkill);
});

router.put('/:id', (req, res) => {
  const skills = readSkills();
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
    writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json(skills[index]);
});

router.delete('/:id', (req, res) => {
  const skills = readSkills();
  const index = skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });
  const deleted = skills.splice(index, 1)[0];
  try {
    writeSkills(skills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json(deleted);
});

module.exports = router;
