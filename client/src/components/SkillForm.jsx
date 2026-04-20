import { useState } from 'react'

const CATEGORIES = ['Technical', 'Leadership', 'Communication', 'Creative', 'Analytical', 'Other']
const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export default function SkillForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Technical',
    proficiency: initialData?.proficiency || 'Beginner',
    description: initialData?.description || ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Skill name is required')
      return
    }
    try {
      setSubmitting(true)
      setError(null)
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Skill Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. React, Public Speaking"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="proficiency">Proficiency Level</label>
        <select id="proficiency" name="proficiency" value={form.proficiency} onChange={handleChange}>
          {PROFICIENCIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Briefly describe your experience with this skill..."
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialData ? 'Update Skill' : 'Add Skill'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
