import SkillCard from './SkillCard'

export default function SkillList({ skills, onDelete, onEdit }) {
  if (skills.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎯</div>
        <h3>No skills yet</h3>
        <p>Add your first skill to start tracking your expertise.</p>
      </div>
    )
  }

  return (
    <div className="skill-grid">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}
