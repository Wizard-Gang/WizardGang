import type { ReactNode } from "react";

/* The list pattern the home page uses for every section: a caption that is the
   control, and a panel that stays closed until someone asks for it. */
export function DisclosureRow({
  group,
  index,
  eyebrow,
  title,
  tagline,
  tags,
  children
}: {
  group: string;
  index: string;
  eyebrow?: string;
  title: string;
  tagline?: string;
  tags?: readonly string[];
  children: ReactNode;
}) {
  return (
    <details className="work-row" name={group}>
      <summary className="work-summary">
        <span className="work-number">{index}</span>
        <span className="work-identity">
          <span className="work-name">{title}</span>
          {eyebrow ? <span className="work-eyebrow">{eyebrow}</span> : null}
        </span>
        {tagline ? <span className="work-tagline">{tagline}</span> : null}
        {tags?.length ? (
          <span className="work-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
        ) : null}
        <span className="work-disclose" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </summary>
      <div className="work-panel">{children}</div>
    </details>
  );
}
