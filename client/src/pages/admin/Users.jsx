import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Ban, CheckCircle2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axiosInstance
      .get("/admin/users")
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRole = async (u) => {
    const role = u.role === "admin" ? "customer" : "admin";
    try {
      await axiosInstance.put(`/admin/users/${u._id}`, { role });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, role } : x)),
      );
      toast.success(
        `${u.name} is now ${role === "admin" ? "an admin" : "a customer"}`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const toggleBlocked = async (u) => {
    const isBlocked = !u.isBlocked;
    try {
      await axiosInstance.put(`/admin/users/${u._id}`, { isBlocked });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, isBlocked } : x)),
      );
      toast.success(isBlocked ? `${u.name} blocked` : `${u.name} unblocked`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-brand-900">
        Users
      </h1>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-b border-brand-100 text-xs uppercase text-brand-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-brand-500"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className={`hover:bg-brand-50/50 ${u.isBlocked ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-brand-900">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-brand-600">{u.email}</td>
                  <td className="px-4 py-3 text-brand-600">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-brand-500">
                    {new Date(u.createdAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="px-4 py-3 text-brand-600">{u.orderCount}</td>
                  <td className="px-4 py-3 capitalize text-brand-600">
                    {u.role}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleRole(u)}
                        title="Toggle admin role"
                        className="rounded p-1.5 text-brand-600 hover:bg-brand-100"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleBlocked(u)}
                        title={u.isBlocked ? "Unblock user" : "Block user"}
                        className={`rounded p-1.5 ${u.isBlocked ? "text-emerald-600 hover:bg-emerald-50" : "text-maroon-600 hover:bg-rose-50"}`}
                      >
                        {u.isBlocked ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
