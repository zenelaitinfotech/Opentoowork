import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import { FaTrash } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: string;
  joined: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid response:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

const deleteUser = async (id: string, role: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/admin/users/${role}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        console.error("Failed to delete user");
      }

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.location}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{new Date(u.joined).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                  <button onClick={() => deleteUser(u.id, u.role)}>
  <FaTrash color="red" />
</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;