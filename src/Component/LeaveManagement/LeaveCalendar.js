
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./LeaveCalendar.css";

const API = "https://school-management-backend-ochre.vercel.app/api/leave";

const LeaveCalendar = () => {
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [filter, setFilter] = useState("All");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const getLeaves = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const isAdmin = user.role === "admin";

      const url = isAdmin
        ? `${API}/all?limit=1000`
        : `${API}/my-leaves`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      const list = Array.isArray(result)
        ? result
        : result.leaves || result.data || [];

      setLeaves(list);
    } catch (error) {
      console.error("Leave Calendar Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to fetch leave records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      return filter === "All" || leave.status === filter;
    });
  }, [leaves, filter]);

  const getDateKey = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  };

  const getLeavesForDate = (date) => {
    const dateKey = getDateKey(date);

    return filteredLeaves.filter((leave) => {
      if (!leave.fromDate || !leave.toDate) return false;

      const start = getDateKey(leave.fromDate);
      const end = getDateKey(leave.toDate);

      return dateKey >= start && dateKey <= end;
    });
  };

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const selectedLeaves = selectedDate
    ? getLeavesForDate(new Date(`${selectedDate}T12:00:00`))
    : [];

  const changeMonth = (direction) => {
    setCurrentMonth(
      new Date(year, month + direction, 1)
    );
    setSelectedDate("");
  };

  const getEmployeeName = (leave) => {
    const user = leave.userId;

    if (!user) return "Employee";

    if (typeof user === "string") return user;

    return (
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "Employee"
    );
  };

  const getLeaveType = (leave) => {
    if (!leave.leaveType) return "Leave";

    if (typeof leave.leaveType === "string") {
      return leave.leaveType;
    }

    return (
      leave.leaveType.leaveTypeName ||
      leave.leaveType.name ||
      "Leave"
    );
  };

  const today = getDateKey(new Date());

  return (
    <div className="leave-calendar-container">

      <div className="calendar-header">
        <div>
          <h2>Leave Calendar</h2>
          <p>View employee leave schedule</p>
        </div>

        <button
          className="calendar-refresh"
          onClick={getLeaves}
        >
          Refresh
        </button>
      </div>

      <div className="calendar-toolbar">

        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)}>
            &#10094;
          </button>

          <h3>{monthName}</h3>

          <button onClick={() => changeMonth(1)}>
            &#10095;
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Leaves</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="calendar-legend">
        <span><i className="approved-dot"></i> Approved</span>
        <span><i className="pending-dot"></i> Pending</span>
        <span><i className="rejected-dot"></i> Rejected</span>
        <span><i className="cancelled-dot"></i> Cancelled</span>
      </div>

      {loading ? (
        <p className="calendar-loading">Loading leaves...</p>
      ) : (
        <div className="calendar-grid">

          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div className="calendar-weekday" key={day}>
                {day}
              </div>
            )
          )}

          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  className="calendar-day empty"
                  key={`empty-${index}`}
                />
              );
            }

            const dateKey = getDateKey(date);
            const dayLeaves = getLeavesForDate(date);
            const isToday = dateKey === today;
            const isSelected = dateKey === selectedDate;

            return (
              <div
                key={dateKey}
                className={`calendar-day ${
                  isToday ? "today" : ""
                } ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedDate(dateKey)}
              >
                <div className="calendar-date">
                  {date.getDate()}
                </div>

                <div className="calendar-events">
                  {dayLeaves.slice(0, 3).map((leave) => (
                    <div
                      key={leave._id}
                      className={`calendar-event ${
                        (leave.status || "Pending").toLowerCase()
                      }`}
                      title={`${getEmployeeName(leave)} - ${getLeaveType(leave)}`}
                    >
                      {getEmployeeName(leave)}
                    </div>
                  ))}

                  {dayLeaves.length > 3 && (
                    <div className="more-events">
                      +{dayLeaves.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <div className="selected-date-details">
          <h3>
            Leave Details -{" "}
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </h3>

          {selectedLeaves.length === 0 ? (
            <p>No leave records on this date.</p>
          ) : (
            <div className="leave-details-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{getEmployeeName(leave)}</td>
                      <td>{getLeaveType(leave)}</td>
                      <td>
                        {new Date(leave.fromDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        {new Date(leave.toDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`leave-status ${
                            (leave.status || "Pending").toLowerCase()
                          }`}
                        >
                          {leave.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default LeaveCalendar;
