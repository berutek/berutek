'use client'

import { useState } from 'react'
import { Modal } from '@components/ui/Modal'
import { Project, ProjectDetailsModal } from './ProjectDetailsModal'

export function ProjectCard({ project }: { project: Project }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col gap-3 group p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
            <img src={`/${project.icon}`} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex items-center gap-4 mt-auto pt-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {project.title}
                </h3>
                {project.status === "live" && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                        Visit ↗
                    </a>)}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {project.description}
            </p>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline cursor-pointer"
            >
                View details →
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ProjectDetailsModal project={project} onClose={() => setIsOpen(false)} />
            </Modal>
        </div>
    )
}
