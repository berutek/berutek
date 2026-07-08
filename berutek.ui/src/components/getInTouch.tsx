export default function GetInTouch() {
    return <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-10 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          Ready to build something?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto text-sm">
          Whether you have a clear spec or just an idea, I can help you scope it, build it, and ship it.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get in touch
        </a>
      </section>
}