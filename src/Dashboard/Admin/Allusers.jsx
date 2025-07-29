import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaUserShield, FaUserTimes, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");

  const {
    data: users = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", searchEmail],
    queryFn: async () => {
      if (searchEmail) {
        // Search endpoint with regex matching email
        const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
        return res.data;
      }
      // Fetch all users endpoint
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });

  const { mutateAsync: changeRole } = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action = currentRole === "admin" ? "Remove Admin" : "Make Admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await changeRole({ id, role: newRole });
      Swal.fire("Success", `${action} successful`, "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not update user role", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">All Users</h2>

      <div className="flex gap-3 items-center mb-6">
        <FaSearch />
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {isFetching && <p>Loading users...</p>}

      {!isFetching && users.length === 0 && (
        <p className="text-gray-500">No matching users found.</p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>{new Date(u.last_log_in).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleToggleRole(u._id, u.role || "user")}
                      className={`btn btn-xs ${
                        u.role === "admin" ? "btn-error" : "btn-primary"
                      } flex items-center gap-1`}
                    >
                      {u.role === "admin" ? (
                        <>
                          <FaUserTimes />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <FaUserShield />
                          Make Admin
                        </>
                      )}
                    </button>
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

export default AllUsers;
