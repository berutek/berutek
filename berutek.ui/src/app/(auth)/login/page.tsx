export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Login</h1>
      <form className="w-full max-w-sm bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
        >
          Log In
        </button>
      </form>
    </>
  );
}