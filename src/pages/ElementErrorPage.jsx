// src/pages/ErrorPage.jsx
import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Page Access Denied</h1>
      <p className="text-lg text-gray-700 mb-2">Oops! You cannot visit this page directly.</p>
      <p className="text-sm text-gray-500 mb-6">
        {error?.statusText || error?.message || "Unknown error occurred."}
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        ⬅ Go Home
      </button>
    </div>
  );
}