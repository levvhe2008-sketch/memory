import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-extrabold mb-4">Memory AI</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Создавайте красивые виртуальные альбомы с вашими любимыми воспоминаниями.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Перейти к Dashboard
      </Link>
    </div>
  );
}
