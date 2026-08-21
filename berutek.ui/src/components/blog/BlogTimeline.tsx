'use client'

import { useState } from 'react'
import { Modal } from '@components/ui/Modal'
import { BlogPost, DetailsModal, formatPostDate } from './DetailsModal'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useAuth } from '@/src/hooks/api/useAuth';
import { PostFormModal } from './PostDetailsModal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function TimelinePanel({ post, side, onOpen, isEditable, onDelete }: { 
  post: BlogPost; 
  side: 'left' | 'right'; 
  onOpen: () => void; 
  isEditable?: boolean; 
  onDelete: (post: BlogPost) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onDoubleClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      title="Double-click to read the full post"
      className={`group flex flex-col gap-2 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer select-none ${side === 'left' ? 'sm:text-right' : ''
        }`}
    >
      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
        {formatPostDate(post.date)}
      </span>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
        {post.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {post.description}
      </p>
      <div className={`flex flex-wrap gap-1.5 mt-1 ${side === 'left' ? 'sm:justify-end' : ''}`}>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>
      {isEditable ? 
      <div className={`flex gap-2 mt-2 ${side === 'right' ? 'sm:justify-end' : ''}`}>
        <TrashIcon onClick={(e) => onDelete(post)} className="w-5 h-5 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" />
        <PencilSquareIcon className="w-5 h-5 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
      </div> : 
      <span className="text-xs text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        double-click to read →
      </span>}
    </div>
  )
}

export function BlogTimeline({ posts }: { posts: BlogPost[] }) {
  const [openPost, setOpenPost] = useState<BlogPost | null>(null)
  const [openNewPostModal, setOpenNewPostModal] = useState(false)

  const {isAuthenticated, user} = useAuth();
  const isAdmin = isAuthenticated && (user?.groups?.includes("admin") ?? false);

  // Newest first on the timeline
  const [sorted, setSorted] = useState([...posts].sort((a, b) => b.date.localeCompare(a.date)))

  const handleDeletePost = (post: BlogPost) => {
    setSorted((prev) => prev.filter((p) => p !== post))
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-4 sm:left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-zinc-300 via-zinc-200 to-transparent dark:from-zinc-600 dark:via-zinc-800"
      />

      <ol className="flex flex-col gap-10 items-center">
        {(isAuthenticated&&isAdmin) && (
          <li className="relative items-start">
            <button
              onClick={() => setOpenNewPostModal(true)}
              className='w-12 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer select-none text-zinc-300 dark:text-zinc-600 font-bold'
            >
              +
            </button>
        </li>)}
        {sorted.map((post, index) => {
          const side = index % 2 === 0 ? 'right' : 'left'
          return (
            <li key={`${post.date}-${post.title}`} className="relative grid grid-cols-[2rem_1fr] sm:grid-cols-[1fr_2rem_1fr] items-start w-full">
              {/* Node on the line */}
              <span
                aria-hidden
                className="absolute top-6 left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-600"
              />
              {/* Branch connector */}
              <span
                aria-hidden
                className={`absolute top-[1.8rem] h-px w-4 bg-zinc-200 dark:bg-zinc-800 left-4 ${side === 'left'
                    ? 'sm:left-auto sm:right-1/2'
                    : 'sm:left-1/2'
                  }`}
              />

              {/* On mobile every panel hangs right of the line; on sm+ they alternate */}
              <div
                className={`row-start-1 w-full col-start-2 ${side === 'left' ? 'sm:col-start-1' : 'sm:col-start-3'
                  }`}
              >
                <TimelinePanel post={post} side={side} onOpen={() => setOpenPost(post)} isEditable={isAdmin} onDelete={() => handleDeletePost(post)} />
              </div>
            </li>
          )
        })}
      </ol>

      <Modal isOpen={openNewPostModal} onClose={() => setOpenNewPostModal(false)}>
        <PostFormModal
          onSubmit={(p) => {
            setSorted((prev) => [p, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
            setOpenNewPostModal(false)
          }}
          onClose={() => setOpenNewPostModal(false)}
        />
      </Modal>

      <Modal isOpen={openPost !== null} onClose={() => setOpenPost(null)}>
        {openPost && <DetailsModal post={openPost} onClose={() => setOpenPost(null)} />}
      </Modal>
    </div>
  )
}
