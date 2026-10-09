import { useState } from 'react';

function SnippetForm({ refreshSnippets }) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, language, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save snippet. Please try again.');
      }

      setTitle('');
      setLanguage('');
      setCode('');
      refreshSnippets();
    } catch (requestError) {
      setError(requestError.message || 'Unable to save snippet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
      <div>
        <label htmlFor="snippet-title" className="mb-2 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="snippet-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          placeholder="e.g. Array helper"
        />
      </div>

      <div>
        <label htmlFor="snippet-language" className="mb-2 block text-sm font-medium text-slate-700">
          Language
        </label>
        <select
          id="snippet-language"
          name="language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        >
          <option value="" disabled>Select a language</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="HTML">HTML</option>
        </select>
      </div>

      <div>
        <label htmlFor="snippet-code" className="mb-2 block text-sm font-medium text-slate-700">
          Code
        </label>
        <textarea
          id="snippet-code"
          name="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
          rows={8}
          className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          placeholder="Write or paste your code here..."
        />
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Save snippet'}
      </button>
    </form>
  );
}

export default SnippetForm;
