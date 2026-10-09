import { useCallback, useEffect, useState } from 'react';
import SnippetForm from '../components/SnippetForm';

function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshSnippets = useCallback(async () => {
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/snippets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load snippets.');
      }

      setSnippets(data);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load snippets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSnippets();
  }, [refreshSnippets]);

  async function handleDelete(snippetId) {
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete snippet.');
      }

      setSnippets((currentSnippets) => currentSnippets.filter((snippet) => snippet._id !== snippetId));
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete snippet.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Create and manage your code snippets.</p>
        </header>

        <section aria-label="Create a snippet">
          <SnippetForm refreshSnippets={refreshSnippets} />
        </section>

        <section aria-label="Your snippets">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">Your snippets</h2>

          {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
          {loading ? (
            <p className="text-slate-600">Loading snippets...</p>
          ) : snippets.length === 0 ? (
            <p className="text-slate-600">No snippets yet. Create one above to get started.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {snippets.map((snippet) => (
                <article key={snippet._id} className="flex min-w-0 flex-col rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/50">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-900">{snippet.title}</h3>
                      <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {snippet.language}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(snippet._id)}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{snippet.code}</code>
                  </pre>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
