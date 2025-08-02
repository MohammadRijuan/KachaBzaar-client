import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUserShield, FaUserTimes, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchEmail, setSearchEmail] = useState("");
  const debouncedSearchEmail = useDebounce(searchEmail, 500);

  const {
    data: users = [],
    isFetching,
  } = useQuery({
    queryKey: ["allUsers", debouncedSearchEmail],
    queryFn: async () => {
      if (debouncedSearchEmail) {
        const res = await axiosSecure.get(`/users/search?email=${debouncedSearchEmail}`);
        return res.data;
      } else {
        const res = await axiosSecure.get("/users");
        return res.data;
      }
    },
    keepPreviousData: true,
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),

    // Optimistic update
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["allUsers", debouncedSearchEmail] });

      const previousUsers = queryClient.getQueryData({ queryKey: ["allUsers", debouncedSearchEmail] });

      queryClient.setQueryData({ queryKey: ["allUsers", debouncedSearchEmail] }, (old = []) =>
        old.map((user) => (user._id === id ? { ...user, role } : user))
      );

      return { previousUsers };
    },

    onError: (error, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData({ queryKey: ["allUsers", debouncedSearchEmail] }, context.previousUsers);
      }
      Swal.fire("Error", "Could not update user role", "error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers", debouncedSearchEmail] });
    },

    onSuccess: (_, variables) => {
      const action = variables.role === "admin" ? "Make Admin" : "Remove Admin";
      Swal.fire("Success", `${action} successful`, "success");
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

    changeRoleMutation.mutate({ id, role: newRole });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">All Users</h2>

      <div className="flex gap-3 items-center mb-6 max-w-md">
        <FaSearch />
        <input
          type="text"
          className="input input-bordered w-full"
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
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                  <td>{u.last_log_in ? new Date(u.last_log_in).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      onClick={() => handleToggleRole(u._id, u.role || "user")}
                      className={`btn btn-xs ${
                        u.role === "admin" ? "btn-error" : "btn-primary"
                      } flex items-center gap-1`}
                      disabled={changeRoleMutation.isLoading}
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
