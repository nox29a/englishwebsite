import Breadcrumbs from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  anchors?: { href: string; label: string }[];
}

export default function PageHeader({ title, description, anchors }: PageHeaderProps) {
  return (
    <header className="mb-12 space-y-6">
      <Breadcrumbs />
      <div className="relative overflow-hidden rounded-3xl bg-white/5 p-8 borders border-4s shadow-lg shadow-indigo-500/10 backdrop-blur">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_55%)]"
          aria-hidden="true"
        />
        <div className="absolute -right-24 -top-24 h-48 w-48 -translate-y-4 rounded-full bg-indigo-400/30 blur-3xl" aria-hidden="true" />
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-100/80">
              AxonAI
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-white md:text-5xl">{title}</h1>
              {description && (
                <p className="max-w-3xl text-base leading-relaxed text-indigo-100/90 md:text-lg">
                  {description}
                </p>
              )}
            </div>
          </div>
          {anchors && anchors.length > 0 && (
            <nav aria-label="Sekcje strony" className="flex flex-wrap gap-3 md:justify-end">
              {anchors.map((anchor) => (
                <a
                  key={anchor.href}
                  href={anchor.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-300" aria-hidden="true" />
                  {anchor.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
