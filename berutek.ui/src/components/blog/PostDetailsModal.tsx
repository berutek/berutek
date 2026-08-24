'use client'

import { useEffect, useState } from 'react'
import {
  BoldIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  LinkIcon,
  LinkSlashIcon,
  ListBulletIcon,
  MinusIcon,
  NumberedListIcon,
  StrikethroughIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { BlogPost, CATEGORY_STYLES } from './DetailsModal'
import type { BlogPayload } from '@services/api/blogs'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { Placeholder } from '@tiptap/extensions'

const CATEGORIES = Object.keys(CATEGORY_STYLES) as NonNullable<BlogPost['category']>[]

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-shadow'

// Text left uncolored follows the theme via .post-content; picking a swatch
// stores an inline color that stays fixed in both themes. 500-shades stay
// legible on light and dark backgrounds.
const TEXT_COLORS = [
  { name: 'sky', value: '#0ea5e9' },
  { name: 'violet', value: '#8b5cf6' },
  { name: 'emerald', value: '#10b981' },
  { name: 'amber', value: '#f59e0b' },
  { name: 'red', value: '#ef4444' },
]

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel label={label} required={required} />
      {children}
    </label>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
      {required && <span className="text-zinc-400 dark:text-zinc-500"> *</span>}
    </span>
  )
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      // Prevent the editor from losing its selection when clicking the toolbar
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`p-1.5 rounded-md duration-300 ${
        active
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <span aria-hidden className="w-px h-5 mx-1 bg-zinc-200 dark:bg-zinc-800" />
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            strike: editor.isActive('strike'),
            code: editor.isActive('code'),
            h2: editor.isActive('heading', { level: 2 }),
            h3: editor.isActive('heading', { level: 3 }),
            bulletList: editor.isActive('bulletList'),
            orderedList: editor.isActive('orderedList'),
            blockquote: editor.isActive('blockquote'),
            codeBlock: editor.isActive('codeBlock'),
            link: editor.isActive('link'),
            color: editor.getAttributes('textStyle').color as string | undefined,
          }
        : null,
  })

  if (!editor || !state) return null

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-zinc-200 dark:border-zinc-800">
      <ToolbarButton label="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Inline code" active={state.code} onClick={() => editor.chain().focus().toggleCode().run()}>
        <CodeBracketIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton label="Heading 2" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <H2Icon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <H3Icon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton label="Bullet list" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <ListBulletIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <NumberedListIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Blockquote" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <span className="block w-4 h-4 text-center leading-4 font-serif font-bold">&ldquo;</span>
      </ToolbarButton>
      <ToolbarButton label="Code block" active={state.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <CodeBracketSquareIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <MinusIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton label={state.link ? 'Edit link' : 'Add link'} active={state.link} onClick={setLink}>
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      {state.link && (
        <ToolbarButton label="Remove link" onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
          <LinkSlashIcon className="w-4 h-4" />
        </ToolbarButton>
      )}

      <ToolbarDivider />

      {TEXT_COLORS.map(({ name, value }) => (
        <button
          key={name}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setColor(value).run()}
          aria-label={`Text color ${name}`}
          title={`Text color ${name}`}
          className={`w-5 h-5 m-0.5 rounded-full border duration-300 ${
            state.color === value
              ? 'border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100'
              : 'border-transparent hover:scale-110'
          }`}
          style={{ backgroundColor: value }}
        />
      ))}
      {state.color && (
        <ToolbarButton label="Theme color (remove custom color)" onClick={() => editor.chain().focus().unsetColor().run()}>
          <XMarkIcon className="w-4 h-4" />
        </ToolbarButton>
      )}
    </div>
  )
}

interface Props {
  initial?: BlogPost
  onSubmit: (post: BlogPayload) => void
  onClose?: () => void
  submitting?: boolean
  error?: string | null
}

export function PostFormModal({ initial, onSubmit, onClose, submitting, error }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<BlogPost['category']>(initial?.category)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false },
      }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: 'Write the post…' }),
    ],
    content: initial?.content ?? '',
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // post-content makes the editing view match exactly how DetailsModal renders it
        class: 'post-content min-h-40 px-4 py-3 focus:outline-none',
      },
    },
  })

  const contentEmpty = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isEmpty ?? true,
  })

  const addTags = (raw: string) => {
    const parts = raw
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
    if (parts.length) {
      setTags((prev) => [...prev, ...parts.filter((t) => !prev.includes(t))])
    }
  }

  const handleTagInput = (value: string) => {
    // Everything before the last comma becomes tags; the rest stays editable
    const lastSeparator = value.lastIndexOf(',')
    if (lastSeparator === -1) {
      setTagDraft(value)
      return
    }
    addTags(value.slice(0, lastSeparator))
    setTagDraft(value.slice(lastSeparator + 1))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTags(tagDraft)
      setTagDraft('')
    } else if (e.key === 'Backspace' && tagDraft === '') {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  // Description is required by the API's create schema
  const canSubmit = title.trim() !== '' && description.trim() !== '' && !contentEmpty && !submitting

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    const pendingTags = tagDraft.trim() ? [...tags, ...tagDraft.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)] : tags
    console.log([...new Set(pendingTags)])
    onSubmit({
      title: title.trim(),
      category,
      description: description.trim(),
      content,
      tags: [...new Set(pendingTags)],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            {initial ? 'Edit post' : 'New post'}
          </h2>
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {initial ? 'update the record below' : 'fill in the record below'}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <Field label="Title" required>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className={inputClass}
        />
      </Field>

      <Field label="Category">
        <div className="flex items-center gap-2 h-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(category === cat ? undefined : cat)}
              className={`px-2 py-0.5 rounded-md text-xs font-mono font-medium transition-opacity duration-300 ${CATEGORY_STYLES[cat]} ${
                category === cat ? 'ring-2 ring-zinc-900 dark:ring-zinc-100' : 'opacity-50 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Description" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short summary shown on the timeline…"
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* div instead of Field's <label>: label clicks would fight the toolbar buttons */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel label="Content" required />
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 focus-within:border-transparent transition-shadow">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Tags */}
      <Field label="Tags">
        <div className={`${inputClass} flex flex-wrap items-center gap-1.5 cursor-text`}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 duration-300"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagDraft}
            onChange={(e) => handleTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? 'tag one, tag two, …' : ''}
            className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
          separate with , — backspace removes the last tag
        </span>
      </Field>

      {/* Actions */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center justify-end gap-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 duration-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="text-sm text-zinc-50 dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 px-4 py-2 rounded-full duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create post'}
        </button>
      </div>

    </form>
  )
}
