import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to log in. Please try again.');
      }

      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Log in to your account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          >
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
