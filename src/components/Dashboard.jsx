import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Grocery App Dashboard</h1>
      <div className="flex gap-8">
        <button
          className="bg-green-500 text-white px-6 py-4 rounded shadow hover:bg-green-600"
          onClick={() => navigate('/pantry')}
        >
          Pantry List
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-4 rounded shadow hover:bg-blue-600"
          onClick={() => navigate('/shopping')}
        >
          Shopping List
        </button>
      </div>
    </div>
  );
}