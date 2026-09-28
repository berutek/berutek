import {
  CubeIcon,
  ChartBarIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const sections = [
  {
    href: "/admin/inventory",
    icon: CubeIcon,
    title: "Inventory",
    description: "Track and manage stock levels across all products.",
  },
  {
    href: "/admin/reporting",
    icon: ChartBarIcon,
    title: "Reporting",
    description: "Review performance metrics and generate reports.",
  },
  {
    href: "/admin/messages",
    icon: EnvelopeIcon,
    title: "Messages",
    description: "Read and respond to messages from clients and leads.",
  },
  {
    href: "/admin/settings",
    icon: Cog6ToothIcon,
    title: "Settings",
    description: "Configure account, integrations, and preferences.",
  },
];

export default function AdminPage() {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
        Admin
      </p>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ href, icon: Icon, title, description }) => (
          <a
            key={href}
            href={href}
            className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <Icon className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
            <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
