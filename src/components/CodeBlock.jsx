import { useState } from 'react';

function CodeBlock({ code, label = 'Code' }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="code-card">
      <div className="code-header">
        <span>{label}</span>
        <button type="button" onClick={copyCode}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default CodeBlock;
