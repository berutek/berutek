import { XMarkIcon } from '@heroicons/react/24/outline'

export interface BlogPost {
  title: string
  date: string
  description: string
  tags: string[]
  /** HTML-formatted post body, as stored in the database */
  content: string
  category?: 'update' | 'thought' | 'release'
}

export const CATEGORY_STYLES: Record<NonNullable<BlogPost['category']>, string> = {
  update: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  thought: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  release: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface Props {
  post: BlogPost
  onClose?: () => void
}

export function DetailsModal({ post, onClose }: Props) {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            {post.title}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {post.category && (
              <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-mono font-medium ${CATEGORY_STYLES[post.category]}`}>
                {post.category}
              </span>
            )}
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {formatPostDate(post.date)}
            </span>
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

      {/* Content */}
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

    </div>
  )
}
