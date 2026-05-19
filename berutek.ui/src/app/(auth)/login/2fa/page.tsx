export default function TwoFAPage() {
  return <>
      <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">Enter the code from your authenticator app to continue.</p>
      <input
        type="text"
        placeholder="123456"
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
        Verify
      </button>
  </>;
}