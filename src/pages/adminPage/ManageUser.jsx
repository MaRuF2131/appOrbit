import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Search } from 'lucide-react';
import axiosInstance from '../../utils/axios';
import ComponentLoader from '../../components/ComponentLoader'

const fetchUsers = async (search) => {
  const res = await axiosInstance.get(`admin/users?name=${search}`);
  return res.data;
};

const UserTable = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => fetchUsers(search),
  });

  const mutation = useMutation({
    mutationFn: async({ id, role }) =>
      await axiosInstance.patch(`admin/users/${role}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire('Success!', 'Role updated successfully.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Something went wrong!', 'error');
    },
  });

  const handleRoleChange = (id, role) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You want to make this user a ${role}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, role });
      }
    });
  };

  return (
 <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-10 text-lime-600 dark:text-blue-400 tracking-wide">
            🧑‍💼 Manage Users
            </h2>

       <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            {/* Search input with left icon */}
            <div className="relative w-full max-w-xs">
                <input
                type="text"
                placeholder="Search by username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-lime-400 shadow-sm focus:ring-2 focus:ring-lime-500 focus:outline-none text-gray-800 dark:text-white dark:bg-gray-900 transition duration-300"
                />
                <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 dark:text-lime-400 pointer-events-none"
                />
            </div>

       </div>

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300"><ComponentLoader></ComponentLoader></p>
      ) : users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Make Moderator
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Make Admin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {user.role === 'moderator' ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
                        Moderator
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user._id, 'moderator')}
                        className="inline-block px-4 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                      >
                        Make Moderator
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {user.role === 'admin' ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                        Admin
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user._id, 'admin')}
                        className="inline-block px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
