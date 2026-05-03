import DashboardLayout from "../../layout/DashboardLayout";
import { ArrowLeft, Save, Shield } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { scheduleService } from "../../services/ScheduleService";
import { toast } from "react-toastify";
import { njoroAreas } from "../../utils/njoroData";

function EditSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    scheduleType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    daysOfWeek: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await scheduleService.getScheduleById(id);
        if (res.success) {
          // Format dates for input type="date"
          const schedule = res.schedule;
          setFormData({
            ...schedule,
            startDate: schedule.startDate
              ? new Date(schedule.startDate).toISOString().split("T")[0]
              : "",
            endDate: schedule.endDate
              ? new Date(schedule.endDate).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to load schedule details.");
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) fetchSchedule();
  }, [id, isAdmin]);

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">
              Access Denied
            </h1>
            <p className="mb-6 text-slate-600">
              Only administrators can edit schedules
            </p>
            <button
              onClick={() => navigate("/schedules")}
              className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
            >
              Back to Schedules
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      // DATE VALIDATION
      if (formData.startDate < today) {
        setError("Start date cannot be in the past");
        setSubmitting(false);
        return;
      }

      if (formData.endDate < formData.startDate) {
        setError("End date cannot be before start date");
        setSubmitting(false);
        return;
      }

      // TIME VALIDATION
      if (formData.startTime >= formData.endTime) {
        setError("End time must be after start time");
        setSubmitting(false);
        return;
      }

      // DAY VALIDATION
      if (!formData.daysOfWeek || formData.daysOfWeek.length === 0) {
        setError("Please select at least one day of operation");
        setSubmitting(false);
        return;
      }

      const res = await scheduleService.updateSchedule(id, formData);
      if (res.success) {
        toast.success("Schedule updated successfully!");
        navigate("/admin/schedules");
      }
    } catch (err) {
      console.error("Error updating schedule:", err);
      setError(err.response?.data?.message || "Failed to update schedule");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <DashboardLayout isAdmin={true}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Schedule</h1>
        <p className="mb-8 text-slate-600">Update schedule details</p>

        {error && (
          <div className="p-4 mb-6 font-bold text-red-600 border border-red-100 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">
              Target Location / Zone
            </label>
            <select
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              required
            >
              <option value="">Select a zone...</option>
              {njoroAreas.map((zone) => (
                <option key={zone.id} value={zone.name}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">
              Schedule Type
            </label>
            <select
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              required
            >
              <option value="regular">Regular</option>
              <option value="rationing">Rationing</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                 min={today}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                 min={today}
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-3 text-sm font-semibold text-blue-950">
              Days of Operation
            </label>
            <div className="grid grid-cols-4 gap-2">
              {days.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                   checked={formData.daysOfWeek && formData.daysOfWeek.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  <span className="text-sm text-slate-700">
                    {day.slice(0, 3)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg disabled:opacity-50"
            >
              <Save size={20} />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default EditSchedule;
