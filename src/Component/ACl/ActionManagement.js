
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/permission";

const ACTIONS = [
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const ActionManagement = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const getModules = async () => {
    try {
      const response = await fetch(`${API}/list`, { headers });
      const result = await response.json();

      if (result.success) {
        setModules(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getModules();
  }, []);

  const toggleAction = (moduleId, action, checked) => {
    setModules((prev) =>
      prev.map((module) =>
        module._id === moduleId
          ? {
              ...module,
              actions: {
                ...module.actions,
                [action]: checked,
              },
            }
          : module
      )
    );
  };

  const saveActions = async (module) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/update/${module._id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            moduleName: module.moduleName,
            displayName: module.displayName,
            actions: module.actions,
            status: module.status,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Actions updated successfully");
        getModules();
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Action Management</h3>
      <p>Enable or disable actions for each module.</p>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Module</th>
              {ACTIONS.map((action) => (
                <th key={action.key}>{action.label}</th>
              ))}
              <th>Save</th>
            </tr>
          </thead>

          <tbody>
            {modules.map((module) => (
              <tr key={module._id}>
                <td>{module.displayName}</td>

                {ACTIONS.map((action) => (
                  <td key={action.key}>
                    <input
                      type="checkbox"
                      checked={
                        module.actions?.[action.key] === true
                      }
                      onChange={(e) =>
                        toggleAction(
                          module._id,
                          action.key,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                ))}

                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                    onClick={() => saveActions(module)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}

            {modules.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionManagement;
