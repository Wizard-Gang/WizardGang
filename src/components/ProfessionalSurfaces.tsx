import type { ProfessionalRole, ProfessionalSkillGroup } from "../data/professional";
import type { ExternalReference } from "../data/professional-systems";

export function ProfessionalRoleGrid({
  roles,
  className
}: {
  roles: readonly ProfessionalRole[];
  className: "selected-work-grid" | "experience-grid";
}) {
  return (
    <div className={className} role="list">
      {roles.map((role) => (
        <article role="listitem" key={`${role.organization}-${role.role}-${role.dates}`}>
          <span>{role.dates}</span>
          <h3>{role.organization}</h3>
          <strong>{role.role}</strong>
          <p>{role.summary}</p>
        </article>
      ))}
    </div>
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

export function CapabilityList({ items }: { items: readonly string[] }) {
  return <ul className="capability-cloud">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function ExternalOrganizationLink({ item }: { item: ExternalReference }) {
  return item.url ? <a href={item.url}>{item.name}</a> : <>{item.name}</>;
}

export function ReferenceList({ items }: { items: readonly ExternalReference[] }) {
  return (
    <ul className="reference-cloud">
      {items.map((item) => <li key={item.name}><ExternalOrganizationLink item={item} /></li>)}
    </ul>
  );
}
