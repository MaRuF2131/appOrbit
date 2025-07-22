import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-3">Oops! Page not found.</p>

      <img
        src="https://i.imgur.com/qIufhof.png" // You can use any image or gif URL
        alt="404 Not Found"
        className="w-52 max-w-full mb-3"
      />

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        ⬅ Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
