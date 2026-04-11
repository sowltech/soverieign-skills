import { useState, useEffect } from 'react'
import SkillForm from './components/SkillForm'
import SkillList from './components/SkillList'

const API = '/api/skills'

export default function App() {
  const [skills, setSkills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    try {
      setLoading(true)
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch skills')
      const data = await res.json()
      setSkills(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(skillData) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData)
      })
      if (!res.ok) throw new Error('Failed to add skill')
      const newSkill = await res.json()
      setSkills(prev => [...prev, newSkill])
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdate(skillData) {
    try {
      const res = await fetch(`${API}/${editingSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData)
      })
      if (!res.ok) throw new Error('Failed to update skill')
      const updated = await res.json()
      setSkills(prev => prev.map(s => s.id === updated.id ? updated : s))
      setEditingSkill(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete skill')
      setSkills(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(skill) {
    setEditingSkill(skill)
    setShowForm(false)
  }

  function handleCancelEdit() {
    setEditingSkill(null)
  }

  function handleCancelAdd() {
    setShowForm(false)
  }

  const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const stats = proficiencies.map(p => ({
    label: p,
    count: skills.filter(s => s.proficiency === p).length
  }))

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>⚡ Sovereign Skills</h1>
          <p className="subtitle">Track &amp; manage your workflow skills</p>
        </div>
      </header>

      <main className="app-main">
        <div className="stats-bar">
          <div className="stat-item total">
            <span className="stat-number">{skills.length}</span>
            <span className="stat-label">Total Skills</span>
          </div>
          {stats.map(s => (
            <div key={s.label} className={`stat-item ${s.label.toLowerCase()}`}>
              <span className="stat-number">{s.count}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {error && <div className="error-banner">Error: {error}</div>}

        <div className="actions-bar">
          {!showForm && !editingSkill && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Add New Skill
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-section">
            <h2>Add New Skill</h2>
            <SkillForm onSubmit={handleAdd} onCancel={handleCancelAdd} />
          </div>
        )}

        {editingSkill && (
          <div className="form-section">
            <h2>Edit Skill</h2>
            <SkillForm
              initialData={editingSkill}
              onSubmit={handleUpdate}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {loading ? (
          <div className="loading">Loading skills...</div>
        ) : (
          <SkillList skills={skills} onDelete={handleDelete} onEdit={handleEdit} />
        )}
      </main>
    </div>
  )
}
