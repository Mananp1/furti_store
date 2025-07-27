// src/routes/NotFoundPage.tsx
import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">404 Page Not Found</h1>
        <p className="text-gray-500">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center h-10 px-8 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
