import { useState } from 'react';

export default function CopyBox({ title, text, type = 'code' }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className={`copy-box ${type === 'prompt' ? 'prompt-box' : ''}`}>
      <div className="copy-box__head">
        <strong>{title}</strong>
        <button onClick={copyText}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}
