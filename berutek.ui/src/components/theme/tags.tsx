export default function Tags() {
  const tags = [
    "Web Development",
    "Graphic Design",
    "Content Creation",
    "Digital Marketing",
    "SEO Optimization",
    "Mobile App Development",
    "UI/UX Design",
    "Data Analysis",
    "Video Editing",
    "Copywriting"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-sm rounded-full text-zinc-800 dark:text-zinc-200"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}