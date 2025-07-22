
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#22c55e', '#fbbf24', '#3b82f6', '#ec4899'];

const demoData = {
  acceptedProducts: 40,
  pendingProducts: 15,
  totalReviews: 120,
  totalUsers: 75,
  totalProducts: 55,
};

const dailyTrendData = [
  { date: 'Jul 1', users: 5, products: 3, pending: 2, reviews: 4, accepted: 1 },
  { date: 'Jul 2', users: 8, products: 4, pending: 3, reviews: 6, accepted: 2 },
  { date: 'Jul 3', users: 6, products: 6, pending: 2, reviews: 8, accepted: 3 },
  { date: 'Jul 4', users: 10, products: 8, pending: 3, reviews: 12, accepted: 5 },
  { date: 'Jul 5', users: 7, products: 5, pending: 2, reviews: 5, accepted: 4 },
  { date: 'Jul 6', users: 12, products: 7, pending: 4, reviews: 9, accepted: 6 },
  { date: 'Jul 7', users: 9, products: 6, pending: 1, reviews: 7, accepted: 5 },
];

const UserStatsContent = () => {
  const data = demoData;

  const pieData = [
    { name: 'Accepted Products', value: data.acceptedProducts },
    { name: 'Pending Products', value: data.pendingProducts },
    { name: 'Total Reviews', value: data.totalReviews },
    { name: 'Total Users', value: data.totalUsers },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white tracking-tight">
        📊 User Dashboard Overview
      </h2>

      <div className="w-full h-[400px] mb-10 rounded-lg bg-white dark:bg-gray-800 shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              isAnimationActive={true}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-[400px] mb-10 rounded-lg bg-white dark:bg-gray-800 shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" name="New Users" />
            <Line type="monotone" dataKey="products" stroke="#22c55e" name="New Products" />
            <Line type="monotone" dataKey="pending" stroke="#fbbf24" name="Pending Products" />
            <Line type="monotone" dataKey="reviews" stroke="#ec4899" name="Reviews" />
            <Line type="monotone" dataKey="accepted" stroke="#10b981" name="Accepted Products" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-green-500">{data.totalProducts}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Total Products</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-blue-500">{data.totalUsers}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Total Users</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-pink-500">{data.totalReviews}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Total Reviews</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-yellow-500">{data.pendingProducts}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Pending Products</p>
        </div>
      </div>
    </section>
  );
};


export default UserStatsContent;
