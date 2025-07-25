import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import { FaSpinner } from 'react-icons/fa';

const COLORS = ['#22c55e', '#fbbf24', '#3b82f6', '#ec4899','#fbbfbb'];

const UserStatsContent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/private/statistics'); // ✅ change if your base URL differs
      return  res.data ;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-4xl text-blue-500 animate-spin">
        <FaSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        Failed to load dashboard stats.
      </div>
    );
  }

  
  const pieData = [
    { name: 'Accepted Products', value: data.acceptedProducts ||0 },
    { name: 'Pending Products', value: data.pendingProducts ||0 },
    { name: 'Rejected Products', value: data.totalRejected ||0 },
    { name: 'Total Products', value: data.totalProducts ||0 },
    { name: 'Total Reviews', value: data.totalReviews ||0 },
  ];

  return (
    <section className="max-w-6xl mx-auto md:px-6 px-2 py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white tracking-tight">
        📊 User Dashboard Overview
      </h2>

      {/* Pie Chart */}
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


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-green-500">{data.totalProducts ||0}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Total Products</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-pink-500">{data.totalReviews ||0}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Total Reviews</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-yellow-500">{data.pendingProducts ||0}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Pending Products</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-yellow-500">{data.acceptedProducts ||0}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Accepted Products</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 transform transition">
          <p className="text-3xl font-extrabold text-rose-700">{data.totalRejected ||0}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Rejected Products</p>
        </div>
      </div>
    </section>
  );
};

export default UserStatsContent;
