
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/permission";

const initialForm = {
  moduleName: "",
  displayName: "",
  actions: {
    view: true,
    add: true,
    edit: true,
    delete: true,
  },
};

const ModuleManagement = () => {
  const [form, setForm] = useState(initialForm);
  const [modules, setModules] = useState([]);
  const [editId, setEditId] = useState(null);
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
      } else {
        alert(result.message || "Unable to load modules");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionChange = (action, checked) => {
    setForm((prev) => ({
      ...prev,
      actions: {
        ...prev.actions,
        [action]: checked,
      },
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.moduleName.trim() || !form.displayName.trim()) {
      alert("Please enter module name and display name");
      return;
    }

    try {
      setLoading(true);

      const url = editId
        ? `${API}/update/${editId}`
        : `${API}/add`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        resetForm();
        getModules();
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      moduleName: item.moduleName || "",
      displayName: item.displayName || "",
      actions: {
        view: item.actions?.view === true,
        add: item.actions?.add === true,
        edit: item.actions?.edit === true,
        delete: item.actions?.delete === true,
      },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatus = async (item) => {
    try {
      const response = await fetch(`${API}/update/${item._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...item,
          status: !item.status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        getModules();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const actions = ["view", "add", "edit", "delete"];

  return (
    <div className="container mt-4">
      <h3>Module Management</h3>

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>{editId ? "Update Module" : "Add Module"}</h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Module Name</label>
            <input
              type="text"
              className="form-control"
              name="moduleName"
              placeholder="e.g. student"
              value={form.moduleName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-control"
              name="displayName"
              placeholder="e.g. Student Management"
              value={form.displayName}
              onChange={handleChange}
            />
          </div>
        </div>

        <h6>Available Actions</h6>

        <div className="d-flex flex-wrap gap-4 mb-3">
          {actions.map((action) => (
            <label key={action}>
              <input
                type="checkbox"
                className="me-2"
                checked={form.actions[action]}
                onChange={(e) =>
                  handleActionChange(action, e.target.checked)
                }
              />
              {action.toUpperCase()}
            </label>
          ))}
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Module"
              : "Add Module"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Module Name</th>
              <th>Display Name</th>
              <th>Actions</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {modules.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.moduleName}</td>
                <td>{item.displayName}</td>
                <td>
                  {actions
                    .filter((action) => item.actions?.[action])
                    .join(", ")}
                </td>
                <td>
                  <span
                    className={`badge ${
                      item.status ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleStatus(item)}
                  >
                    {item.status ? "Deactivate" : "Activate"}
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

export default ModuleManagement;
