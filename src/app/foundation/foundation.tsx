interface FoundationProbeProps {
  markUrl: string;
}

export function FoundationProbe({ markUrl }: FoundationProbeProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <img className="h-10 w-10" src={markUrl} alt="WizardGang foundation mark" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
          WG-038 migration harness
        </p>
        <h1 className="mt-2 text-3xl font-semibold">React + TypeScript + Vite + Tailwind</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Disposable build proof only. Production rendering remains on the existing generated site.
        </p>
      </section>
    </main>
  );
}
