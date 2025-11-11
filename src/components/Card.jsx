export default function Card({ title, children }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 w-full max-w-xl mx-auto border border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-blue-400">{title}</h2>
      {children}
    </div>
  );
}
