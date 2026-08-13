import ThemeToggle from "../theme/ThemeToggle";

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-zinc-100 border-t-2 border-solid border-t-zinc-200 dark:bg-zinc-900 text-center text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-3 md:flex-row md:gap-0 items-center justify-between p-5">
      <div className="flex items-center gap-2">
        <img src="/berutek.icon.webp" alt="Berutek logo" className="h-8 w-8" />
        <h2 className="text-lg font-bold ">BeruTek</h2>
      </div>
        <span>&copy; {new Date().getFullYear()} BeruTek. All rights reserved.</span>
      <ThemeToggle />
    </footer>
  );
}