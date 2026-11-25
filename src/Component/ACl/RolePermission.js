
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const RolePermission = () => {
  const token = localStorage.getItem("token");

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Load roles
  const getRoles = async () => {
    try {
      const response = await fetch(`${API}/role/list`, {
        headers,
      });
      const result = await response.json();

      if (result.success) {
        setRoles(result.data || []);
      }
    } catch (error) {
      console.error("Role fetch error:", error);
    }
  };

  // Load role permissions
  const getPermissions = async (roleId) => {
    if (!roleId) {
      setPermissions([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/rolepermission/role/${roleId}`,
        { headers }
      );

      const result = await response.json();

      if (result.success) {
        setPermissions(result.data || []);
      } else {
        alert(result.message || "Permission fetch failed");
      }
    } catch (error) {
      console.error("Permission fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    getPermissions(roleId);
  };

  // Checkbox update
  const handlePermissionChange = (index, action, checked) => {
    setPermissions((previous) =>
      previous.map((item, i) =>
        i === index
          ? { ...item, [action]: checked }
          : item
      )
    );
  };

  // Save all permissions
  const savePermissions = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        roleId: selectedRole,
        permissions: permissions.map((item) => ({
          permissionId: item.permissionId,
          view: item.view,
          add: item.add,
          edit: item.edit,
          delete: item.delete,
        })),
      };

      const response = await fetch(
        `${API}/rolepermission/assign`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Permissions saved successfully");
        getPermissions(selectedRole);
      } else {
        alert(result.message || "Permission save failed");
      }
    } catch (error) {
      console.error("Save permission error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const actions = ["view", "add", "edit", "delete"];

  return (
    <div className="container mt-4">
      <h3>Role Permission Management</h3>

      <div className="mb-3">
        <label className="form-label">Select Role</label>

        <select
          className="form-select"
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value="">-- Select Role --</option>

          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Module</th>
                    {actions.map((action) => (
                      <th key={action}>
                        {action.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {permissions.map((item, index) => (
                    <tr key={item.permissionId}>
                      <td>{item.displayName}</td>

                      {actions.map((action) => (
                        <td key={action}>
                          <input
                            type="checkbox"
                            checked={item[action] === true}
                            onChange={(e) =>
                              handlePermissionChange(
                                index,
                                action,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={savePermissions}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Permissions"}
          </button>
        </>
      )}
    </div>
  );
};

export default RolePermission;
