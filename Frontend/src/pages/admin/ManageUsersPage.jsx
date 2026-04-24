import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const loadUsers = () => {
    axios.get("https://sachin-lms.onrender.com/auth/all").then((res) => setUsers(res.data.users));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`https://sachin-lms.onrender.com/auth/${id}`);
    loadUsers();
  };

  const updateUser = async (e) => {
    e.preventDefault();

    await axios.put(`https://sachin-lms.onrender.com/auth/update/${editUser._id}`, {
      name: editUser.name,
      email: editUser.email,
      password: editUser.password, // new password (optional)
    });

    alert("User Updated Successfully!");
    setEditUser(null);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 md:px-10 py-10 transition">

      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
        Manage Users
      </h1>

      {/* USER LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
        {users.map((u) => (
          <div
            key={u._id}
            className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition flex flex-col justify-between"
          >
            {/* USER INFO */}
            <div className="mb-4">
              <div className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {u.name}
              </div>

              <div className="text-gray-600 dark:text-gray-400 text-sm break-all mt-1">
                {u.email}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditUser({ ...u, password: "" })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(u._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-4">Edit User</h2>

            <form onSubmit={updateUser} className="space-y-4">
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Name"
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />

              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />

              <input
                type="text"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="New Password (optional)"
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
