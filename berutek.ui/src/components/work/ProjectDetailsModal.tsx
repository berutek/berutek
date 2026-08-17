import { XMarkIcon } from '@heroicons/react/24/outline'

export interface Project {
  icon: string
  title: string
  description: string
  link: string
  technologies?: string[]
  details?: string
  highlights?: string[]
  history?: string
  status?: 'live' | 'in-progress' | 'archived'
  year?: string
  github?: string
}

const STATUS_STYLES: Record<NonNullable<Project['status']>, string> = {
  live: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  archived: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
}

const HIGHLIGHT_ICONS = ['◈', '⊙', '⬡', '∿', '⟳', '☁']

interface Props {
  project: Project
  onClose?: () => void
}

export function ProjectDetailsModal({ project, onClose }: Props) {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`/${project.icon}`}
            alt={project.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {project.status && (
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-mono font-medium ${STATUS_STYLES[project.status]}`}>
                  {project.status}
                </span>
              )}
              {project.year && (
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                  since {project.year}
                </span>
              )}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* About */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          About
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {project.details ?? project.description}
        </p>
      </div>

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Technologies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Key features
          </p>
          <ul className="space-y-2">
            {project.highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="shrink-0 text-zinc-300 dark:text-zinc-600 select-none mt-px">
                  {HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* History */}
      {project.history && (
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Background
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {project.history}
          </p>
        </div>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Footer links */}
      <div className="flex flex-wrap gap-3">
        {project.status === "live" && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
          Visit project →
        </a>)}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            View source ⬡
          </a>
        )}
      </div>

    </div>
  )
}
