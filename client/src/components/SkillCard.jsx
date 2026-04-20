export default function SkillCard({ skill, onDelete, onEdit }) {
  const badgeClass = `proficiency-badge badge-${skill.proficiency.toLowerCase()}`

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <span className="skill-name">{skill.name}</span>
        <span className={badgeClass}>{skill.proficiency}</span>
      </div>
      <div>
        <span className="category-tag">{skill.category}</span>
      </div>
      {skill.description && (
        <p className="skill-description">{skill.description}</p>
      )}
      <div className="skill-card-footer">
        <button className="btn-edit" onClick={() => onEdit(skill)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(skill.id)}>Delete</button>
      </div>
    </div>
  )
}
