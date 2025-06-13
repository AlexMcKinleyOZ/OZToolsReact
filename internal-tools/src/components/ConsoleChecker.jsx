// src/components/ConsoleChecker.jsx
import React, { useState } from 'react';

const ConsoleChecker = () => {
  const [urls, setUrls] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url);
    if (!userId || !password || urlList.length === 0) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/check-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, urls: urlList })
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Console Checker</h2>
      <input
        type="text"
        placeholder="Enter ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      <textarea
        rows="5"
        cols="50"
        placeholder="Enter URLs, one per line"
        value={urls}
        onChange={e => setUrls(e.target.value)}
      /><br />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? 'Checking...' : 'Check'}
      </button>

      {results.length > 0 && results.map((result, index) => (
        <div key={index} style={{ marginTop: '1em', border: '1px solid gray', padding: '1em' }}>
          <h3>{result.url}</h3>
          {result.errors.length > 0 ? (
            <ul>
              {result.errors.map((err, i) => (
                <li key={i}><code>{err}</code></li>
              ))}
            </ul>
          ) : (
            <p>No console errors ✅</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsoleChecker;
