import { useState, useEffect, FormEvent } from 'react';
import type { ContentItem, ContentType, Subject } from './types';
import {
  loadContent,
  saveContent,
  isAuthenticated,
  login,
  logout,
  changePassword,
} from './data';

// ── Shared badge component ─────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 text-blue-800',
  Physics: 'bg-purple-100 text-purple-800',
};
const TYPE_COLORS: Record<string, string> = {
  course: 'bg-green-100 text-green-800',
  code: 'bg-orange-100 text-orange-800',
};

function Badge({ label, variant }: { label: string; variant: 'subject' | 'type' }) {
  const cls =
    variant === 'subject'
      ? (SUBJECT_COLORS[label] ?? 'bg-gray-100 text-gray-800')
      : (TYPE_COLORS[label] ?? 'bg-gray-100 text-gray-800');
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
}

// ── Filter button ──────────────────────────────────────────────────────────

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

// ── Content card (expandable) ──────────────────────────────────────────────

function ContentCard({ item }: { item: ContentItem }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <button className="w-full text-left p-4" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
          <h3 className="text-base font-semibold">{item.title}</h3>
          <div className="flex gap-1">
            <Badge label={item.subject} variant="subject" />
            <Badge label={item.type} variant="type" />
          </div>
        </div>
        <p className="text-slate-600 text-sm">{item.description}</p>
        <p className="text-xs text-slate-400 mt-2">{expanded ? '▲ Collapse' : '▼ Show content'}</p>
      </button>
      {expanded && (
        <div className="border-t px-4 pb-4 pt-3">
          {item.type === 'code' ? (
            <pre className="bg-slate-900 text-slate-100 text-sm p-4 rounded overflow-x-auto whitespace-pre">
              <code>{item.content}</code>
            </pre>
          ) : (
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {item.content}
            </p>
          )}
          {item.language && (
            <p className="text-xs text-slate-400 mt-2">Language: {item.language}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Public view ────────────────────────────────────────────────────────────

function PublicView() {
  const [items] = useState<ContentItem[]>(loadContent);
  const [subjectFilter, setSubjectFilter] = useState<'All' | Subject>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | ContentType>('All');

  const filtered = items.filter((item) => {
    const matchSubject = subjectFilter === 'All' || item.subject === subjectFilter;
    const matchType = typeFilter === 'All' || item.type === typeFilter;
    return matchSubject && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">EduFree</h1>
            <p className="text-slate-500 text-sm">Math &amp; Physics resources for everyone</p>
          </div>
          <a href="#admin" className="text-xs text-slate-400 hover:text-slate-600">
            Admin
          </a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterBtn
            label="All Subjects"
            active={subjectFilter === 'All'}
            onClick={() => setSubjectFilter('All')}
          />
          <FilterBtn
            label="Math"
            active={subjectFilter === 'Math'}
            onClick={() => setSubjectFilter('Math')}
          />
          <FilterBtn
            label="Physics"
            active={subjectFilter === 'Physics'}
            onClick={() => setSubjectFilter('Physics')}
          />
          <span className="w-px bg-slate-200 self-stretch mx-1" />
          <FilterBtn
            label="All Types"
            active={typeFilter === 'All'}
            onClick={() => setTypeFilter('All')}
          />
          <FilterBtn
            label="Courses"
            active={typeFilter === 'course'}
            onClick={() => setTypeFilter('course')}
          />
          <FilterBtn
            label="Code"
            active={typeFilter === 'code'}
            onClick={() => setTypeFilter('code')}
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-16">
            No content matches the selected filters.
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <footer className="border-t mt-16 py-6 text-center text-xs text-slate-400 bg-white">
        EduFree — Free Math &amp; Physics resources
      </footer>
    </div>
  );
}

// ── Admin login ────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onLogin();
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your password to access the dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Admin dashboard ────────────────────────────────────────────────────────

const emptyForm = {
  type: 'course' as ContentType,
  title: '',
  subject: 'Math' as Subject,
  description: '',
  content: '',
  language: '',
};

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<ContentItem[]>(loadContent);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [showPassForm, setShowPassForm] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (item: ContentItem) => {
    setForm({
      type: item.type,
      title: item.title,
      subject: item.subject,
      description: item.description,
      content: item.content,
      language: item.language ?? '',
    });
    setEditing(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.content.trim()) return;

    let updated: ContentItem[];
    if (editing) {
      updated = items.map((it) =>
        it.id === editing.id
          ? {
              ...it,
              type: form.type,
              title: form.title.trim(),
              subject: form.subject,
              description: form.description.trim(),
              content: form.content.trim(),
              language: form.language.trim() || undefined,
            }
          : it,
      );
    } else {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        type: form.type,
        title: form.title.trim(),
        subject: form.subject,
        description: form.description.trim(),
        content: form.content.trim(),
        language: form.language.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      updated = [newItem, ...items];
    }
    setItems(updated);
    saveContent(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    if (editing?.id === id) resetForm();
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveContent(updated);
  };

  const handleChangePass = (e: FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassMsg('Password must be at least 4 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg('Passwords do not match.');
      return;
    }
    changePassword(newPass);
    setPassMsg('Password changed successfully.');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
              }}
              className="text-xs text-slate-500 hover:underline"
            >
              ← Back to site
            </a>
          </div>
          <button onClick={onLogout} className="text-sm text-slate-500 hover:text-red-600">
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: items.length },
            { label: 'Courses', value: items.filter((i) => i.type === 'course').length },
            { label: 'Code', value: items.filter((i) => i.type === 'code').length },
            { label: 'Math', value: items.filter((i) => i.subject === 'Math').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit form */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700"
          >
            + Add New Content
          </button>
        )}
        {showForm && (
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? 'Edit Content' : 'Add New Content'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}
                  className="flex-1 border rounded p-2 text-sm bg-white"
                >
                  <option value="course">Course</option>
                  <option value="code">Code Snippet</option>
                </select>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
                  className="flex-1 border rounded p-2 text-sm bg-white"
                >
                  <option value="Math">Math</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Short description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder={
                  form.type === 'code'
                    ? 'Paste your code here'
                    : 'Full course content / notes'
                }
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={8}
                className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                  form.type === 'code' ? 'font-mono' : ''
                }`}
              />
              {form.type === 'code' && (
                <input
                  type="text"
                  placeholder="Language (e.g. python, javascript)"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700"
                >
                  {editing ? 'Save Changes' : 'Add Content'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 border rounded py-2 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Content list */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Content ({items.length})</h2>
          {items.length === 0 ? (
            <p className="text-slate-500 text-sm">No content yet. Add some above.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg p-4 flex justify-between items-start gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex gap-1 mb-1 flex-wrap">
                      <Badge label={item.subject} variant="subject" />
                      <Badge label={item.type} variant="type" />
                    </div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs border rounded px-2 py-1 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs border rounded px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Change password */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-base font-semibold mb-1">Change Password</h2>
          <p className="text-xs text-slate-500 mb-3">
            Default password is <code className="font-mono">admin</code>. Change it here.
          </p>
          <button
            onClick={() => { setShowPassForm(!showPassForm); setPassMsg(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            {showPassForm ? 'Hide' : 'Change password'}
          </button>
          {showPassForm && (
            <form onSubmit={handleChangePass} className="space-y-3 mt-4">
              <input
                type="password"
                placeholder="New password (min 4 chars)"
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  setPassMsg('');
                }}
                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  setPassMsg('');
                }}
                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passMsg && (
                <p
                  className={`text-sm ${
                    passMsg.includes('success') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {passMsg}
                </p>
              )}
              <button
                type="submit"
                className="bg-slate-800 text-white rounded py-2 px-4 text-sm font-medium hover:bg-slate-900"
              >
                Update Password
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

// ── Root app ───────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<'public' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'public',
  );
  const [auth, setAuth] = useState<boolean>(isAuthenticated);

  useEffect(() => {
    const handleHash = () => {
      setPage(window.location.hash === '#admin' ? 'admin' : 'public');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (page === 'admin') {
    if (!auth) {
      return <AdminLogin onLogin={() => setAuth(true)} />;
    }
    return (
      <AdminDashboard
        onLogout={() => {
          logout();
          setAuth(false);
        }}
      />
    );
  }

  return <PublicView />;
}

