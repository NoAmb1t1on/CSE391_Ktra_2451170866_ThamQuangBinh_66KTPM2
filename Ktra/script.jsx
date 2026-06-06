import { useState, useEffect } from "react";

/* ─── helpers ───────────────────────────────────────────── */
const priorityClass = (p) =>
  ({ High: "priority-high", Medium: "priority-medium", Low: "priority-low" }[p] ?? "");

const statusClass = (s) =>
  ({ Done: "status-done", "In Progress": "status-progress", "To Do": "status-todo" }[s] ?? "status-todo");

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  const [tasks,       setTasks]       = useState([]);
  const [showModal,   setShowModal]   = useState(false);
  const [taskName,    setTaskName]    = useState("");
  const [priority,    setPriority]    = useState("High");
  const [error,       setError]       = useState("");
  const [editingId,   setEditingId]   = useState(null);

  /* Câu 3 – load từ data.json lần đầu render */
  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setTasks)
      .catch((err) => console.error("Lỗi khi tải data.json:", err));
  }, []);

  /* ── open modal ── */
  const openAdd = () => {
    setEditingId(null);
    setTaskName("");
    setPriority("High");
    setError("");
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingId(task.id);
    setTaskName(task.taskName);
    setPriority(task.priority);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  /* Câu 2: validate & submit */
  const handleSubmit = () => {
    const trimmed = taskName.trim();
    if (!trimmed) {
      setError("Task name cannot be empty.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Task name must not exceed 100 characters.");
      return;
    }
    setError("");

    closeModal();
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  /* ─── render ─────────────────────────────────────────── */
  return (
    <>
      <style>{css}</style>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">

            {/* Task List */}
            <div className="card task-card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Task List</h5>
                <button className="btn-add-top" onClick={openAdd}>+ Add Task</button>
              </div>

              <div>
                {tasks.length === 0 && (
                  <p className="text-center text-muted py-4" style={{ fontSize: 13 }}>
                    No tasks yet.
                  </p>
                )}
                {tasks.map((t) => (
                  <div key={t.id} className="task-row d-flex align-items-center gap-2">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="col-label">Task</div>
                      <div className="task-name">{t.taskName}</div>
                    </div>
                    <div style={{ width: 90, flexShrink: 0 }}>
                      <div className="col-label">Priority</div>
                      <span className={priorityClass(t.priority)}>{t.priority}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`status-badge ${statusClass(t.status)}`}>{t.status}</span>
                      <button className="icon-btn icon-btn-edit" title="Edit"    onClick={() => openEdit(t)}>✏️</button>
                      <button className="icon-btn icon-btn-del"  title="Delete"  onClick={() => deleteTask(t.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && closeModal()}>
          <div className="modal-box">
            <div className="modal-hd">
              <span className="modal-title">{editingId ? "Edit Task" : "Add Task"}</span>
              <button className="btn-close-modal" onClick={closeModal}>×</button>
            </div>
            <div className="modal-bd">
              {/* Task input */}
              <div className="mb-3">
                <label className="field-label">Task</label>
                <input
                  type="text"
                  className={`form-control form-control-sm${error ? " is-invalid" : ""}`}
                  placeholder="Type your task here..."
                  maxLength={100}
                  value={taskName}
                  onChange={(e) => { setTaskName(e.target.value); if (error) setError(""); }}
                />
                <div className="d-flex justify-content-between mt-1">
                  {error
                    ? <small className="text-danger">{error}</small>
                    : <span />}
                  <span className="char-hint">{taskName.length}/100</span>
                </div>
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label className="field-label d-block">Priority</label>
                <div className="priority-group">
                  {["High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`priority-pill priority-pill-${p.toLowerCase()}${priority === p ? " active" : ""}`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-end">
                <button className="btn-submit" onClick={handleSubmit}>
                  {editingId ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── CSS-in-JS ─────────────────────────────────────────── */
const css = `
body { background-color: #f0f2f5; }

.task-card { border: none !important; border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,.08) !important; }
.task-card .card-header { background:#fff; border-bottom:1px solid #eee; border-radius:14px 14px 0 0 !important; padding:.9rem 1.25rem; }

.task-row { padding:.8rem 1.25rem; border-bottom:1px solid #f2f2f2; }
.task-row:last-child { border-bottom:none; }
.col-label { font-size:11px; color:#aaa; margin-bottom:2px; }
.task-name  { font-size:14px; font-weight:600; color:#222; }

.priority-high   { color:#dc3545; font-weight:700; font-size:13px; }
.priority-medium { color:#fd7e14; font-weight:700; font-size:13px; }
.priority-low    { color:#28a745; font-weight:700; font-size:13px; }

.status-badge { display:inline-block; font-size:11px; padding:3px 11px; border-radius:20px; border:1.5px solid; white-space:nowrap; }
.status-todo     { border-color:#aaa;    color:#555;    background:#f7f7f7; }
.status-done     { border-color:#28a745; color:#28a745; background:#eafff0; }
.status-progress { border-color:#6c757d; color:#6c757d; background:#f0f0f0; }

.icon-btn { border:none; background:none; padding:4px 7px; border-radius:6px; cursor:pointer; font-size:15px; }
.icon-btn-edit:hover { background:#f0f0f0; }
.icon-btn-del:hover  { background:#ffeaea; }

.btn-add-top { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; border:none; border-radius:8px; padding:7px 15px; font-size:13px; font-weight:600; cursor:pointer; }
.btn-add-top:hover { opacity:.9; }

/* modal */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1050; }
.modal-box { background:#fff; border-radius:14px; width:440px; max-width:95vw; }
.modal-hd { display:flex; justify-content:space-between; align-items:center; padding:.9rem 1.25rem; border-bottom:1px solid #eee; }
.modal-title { font-size:15px; font-weight:700; }
.btn-close-modal { background:none; border:none; font-size:22px; cursor:pointer; color:#888; line-height:1; }
.btn-close-modal:hover { color:#222; }
.modal-bd { padding:1.25rem; }
.field-label { font-size:13px; font-weight:600; margin-bottom:5px; display:block; }
.char-hint { font-size:11px; color:#aaa; }

.priority-group { display:flex; gap:8px; }
.priority-pill { border-radius:20px; font-size:13px; padding:5px 18px; cursor:pointer; border:1.5px solid; background:none; }
.priority-pill-high   { color:#dc3545; border-color:#dc3545; }
.priority-pill-medium { color:#fd7e14; border-color:#fd7e14; }
.priority-pill-low    { color:#28a745; border-color:#28a745; }
.priority-pill-high.active   { background:#dc3545; color:#fff; }
.priority-pill-medium.active { background:#fd7e14; color:#fff; }
.priority-pill-low.active    { background:#28a745; color:#fff; }

.btn-submit { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; border:none; border-radius:8px; padding:7px 22px; font-size:14px; font-weight:600; cursor:pointer; }
.btn-submit:hover { opacity:.9; }
`;