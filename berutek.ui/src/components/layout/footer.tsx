export default function Footer() {
  return (
    <footer className="w-full py-4 bg-zinc-200 dark:bg-zinc-900 text-center text-sm text-gray-600 dark:text-gray-400">
      &copy; {new Date().getFullYear()} BeruTek. All rights reserved.
    </footer>
  );
}