export default function NoAccountHirePage() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Continue without an account</h1>
            <p className="mb-6 text-gray-700 dark:text-gray-300">You can continue to explore our services without creating an account. However, please note that some features may be limited.</p>
            <div className="flex gap-5 mb-6">
                <a href="/main/dashboard" className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 hover:text-gray-200 transition duration-300 dark:border-gray-400 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-200">
                    Continue as Guest
                </a>
                <a href="/main/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                    Book a meeting
                </a>
            </div>
            <a href="/contact" className="px-4 py-2 underline underline-offset-4 hover:text-gray-700 transition duration-300 dark:text-gray-200  dark:hover:text-gray-400">
                Continue signing up
            </a>
        </>
    );
}
