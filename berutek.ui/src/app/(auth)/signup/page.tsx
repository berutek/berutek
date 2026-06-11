"use client";

import { useAuth } from "@/src/hooks/api/useAuth";
import { useRef, useState } from "react";

export default function Register() {

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const repeatPassword = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.current && email.current && name.current && repeatPassword.current) {
      if (password.current.value !== repeatPassword.current.value) {
        setPasswordError("Passwords do not match");
        return;
      }
      setPasswordError(null);
      await register({
        email: email.current?.value || "",
        password: password.current.value,
        name: name.current?.value || "",
      });
    }
  };

  return <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Create your account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md">
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Full Name
          </label>
          <input
          ref={name}
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Email
          </label>
          <input
          ref={email}
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
          ref={password}
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Repeat Password
          </label>
          <input
          ref={repeatPassword}
            id="repeat-password"
            type="password"
            placeholder="Enter your password again"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
          />
        </div>
        <div className="mb-6">
          <a className="text-blue-500 hover:text-blue-700" href="/no-account">
            Continue without registering
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
        >
          Register
        </button>
        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        {loading && <p>Loading...</p>}
        <a href="/login" className="text-blue-500 hover:text-blue-700">
          Already have an account? Log in
        </a>
      </form>
  </>;
}