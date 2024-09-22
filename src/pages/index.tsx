import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export interface User {
  id: number;
  username?: string;
  email?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]); // Define state variable 'users' as an array of User objects
  const [showConfirm, setShowConfirm] = useState(false); // Define state variable 'showConfirm' as a boolean
  const [showUpdate, setShowUpdate] = useState(false); // Define state variable 'showUpdate' as a boolean
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null); // Define state variable 'userIdToDelete' as a number or null
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null); // Define state variable 'userToUpdate' as a User object or null

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/usersGet'); // Send a GET request to the '/api/usersGet' endpoint
        const { data } = await response.json(); // Parse the response JSON and extract the 'data' property

        if (Array.isArray(data)) {
          setUsers(
            data.map((user: User) => ({
              ...user,
              createdAt: user.createdAt ? new Date(user.createdAt) : null,
              updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
            }))
          ); // If the 'data' is an array, update the 'users' state with the mapped array of User objects
        } else {
          console.error('Data received is not an array:', data); // Log an error message if the 'data' is not an array
        }
      } catch (error) {
        console.error('Error fetching users:', error); // Log an error message if there is an error fetching users
      }
    };

    fetchUsers(); // Call the fetchUsers function when the component mounts
  }, []);

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (userIdToDelete === null) return; // If 'userIdToDelete' is null, return

    try {
      await fetch(`/api/users/${userIdToDelete}`, {
        method: 'DELETE', // Send a DELETE request to the '/api/users/{userIdToDelete}' endpoint
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setUsers(users.filter((user) => user.id !== userIdToDelete)); // Update the 'users' state by filtering out the user with 'userIdToDelete'
      setShowConfirm(false); // Set 'showConfirm' state to false
    } catch (error) {
      console.error('Error deleting user:', error); // Log an error message if there is an error deleting the user
    }
  };

  // Handle user update
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!userToUpdate) return; // If 'userToUpdate' is null, return

    try {
      const response = await fetch(`/api/users/${userToUpdate.id}`, {
        method: 'PUT', // Send a PUT request to the '/api/users/{userToUpdate.id}' endpoint
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userToUpdate.username,
          email: userToUpdate.email,
        }), // Send the updated username and email in the request body
      });

      const updatedUser = await response.json(); // Parse the response JSON and assign it to 'updatedUser'

      // Update the local state with the updated user
      setUsers(
        users.map((user) =>
          user.id === updatedUser.data.id ? updatedUser.data : user
        )
      );
      setShowUpdate(false); // Set 'showUpdate' state to false
    } catch (error) {
      console.error('Error updating user:', error); // Log an error message if there is an error updating the user
    }
  };

  const confirmDeleteUser = (id: number) => {
    setUserIdToDelete(id); // Set 'userIdToDelete' state to the provided id
    setShowConfirm(true); // Set 'showConfirm' state to true
  };

  const openUpdateModal = (user: User) => {
    setUserToUpdate(user); // Set 'userToUpdate' state to the provided user
    setShowUpdate(true); // Set 'showUpdate' state to true
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <title>User List Dasboard</title>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-lg createUser">
            <Link href="/createusers">Create User</Link>
          </button>
        </div>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Username
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Create Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Update Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.createdAt?.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.updatedAt?.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => openUpdateModal(user)}
                      className="bg-blue-500 text-white rounded-lg px-2 py-1 hover:bg-blue-600 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(user.id)}
                      className="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-black rounded-lg px-4 py-2 mr-2"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white rounded-lg px-4 py-2"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pembaruan Pengguna */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Update User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  value={userToUpdate?.username || ''}
                  onChange={(e) =>
                    setUserToUpdate({
                      ...userToUpdate!,
                      username: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={userToUpdate?.email || ''}
                  onChange={(e) =>
                    setUserToUpdate({ ...userToUpdate!, email: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUpdate(false)}
                  className="bg-gray-300 text-black rounded-lg px-4 py-2 mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
