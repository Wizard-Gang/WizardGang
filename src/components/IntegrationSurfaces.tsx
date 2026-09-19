import type { IntegrationCategory } from "../data/integrations";

function DetailList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div>
      <strong>{label}</strong>
      <ul className="tags" aria-label={label}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export function IntegrationCatalog({ categories }: { categories: readonly IntegrationCategory[] }) {
  return (
    <>
      {categories.map((category) => (
        <section className="case-section" id={category.id} aria-labelledby={`integration-${category.id}-heading`} key={category.id}>
          <div className="case-label">{category.name}</div>
          <div>
            <h2 id={`integration-${category.id}-heading`}>{category.name}</h2>
            <p>{category.summary}</p>
            <div className="integration-grid" role="list">
              {category.capabilities.map((capability) => (
                <article className="proof-group" role="listitem" key={capability.id}>
                  <h3>{capability.name}</h3>
                  <p>{capability.description}</p>
                  {capability.systemTypes?.length ? <DetailList label="System types" items={capability.systemTypes} /> : null}
                  {capability.interfaces?.length ? <DetailList label="Interfaces & protocols" items={capability.interfaces} /> : null}
                  {capability.technologies?.length ? <DetailList label="Supporting technologies" items={capability.technologies} /> : null}
                </article>
              ))}
            </div>
            <div className="text-links" aria-label={`${category.name} evidence`}>
              {category.evidence.map((evidence) => (
                <a className="text-link" href={evidence.href} key={evidence.id}>
                  {evidence.label} <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
