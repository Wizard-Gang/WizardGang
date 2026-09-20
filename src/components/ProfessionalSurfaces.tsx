import type { ProfessionalRole, ProfessionalSkillGroup } from "../data/professional";

/* One row per role: dates, who, what, and the one line that says what the work
   was. The previous card grid put five cards into a three-column layout, so the
   last row was two cards and a hole. */
export function RoleTimeline({ roles }: { roles: readonly ProfessionalRole[] }) {
  return (
    <ol className="role-timeline">
      {roles.map((role) => (
        <li key={`${role.organization}-${role.role}-${role.dates}`}>
          <span className="role-dates">{role.dates}</span>
          <span className="role-who">
            <strong>{role.organization}</strong>
            <span>{role.role}</span>
          </span>
          <span className="role-summary">{role.summary}</span>
        </li>
      ))}
    </ol>
  );
}

export function SkillList({ group }: { group: ProfessionalSkillGroup }) {
  return (
    <div>
      <strong>{group.label}</strong>
      <ul className="tags" aria-label={group.label}>
        {group.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
