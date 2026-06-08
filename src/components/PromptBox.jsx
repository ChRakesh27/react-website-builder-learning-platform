import { useState } from 'react';

function PromptBox({ title = 'Copy AI Prompt', prompt }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="prompt-box">
      <div>
        <p className="eyebrow">AI Prompt</p>
        <h3>{title}</h3>
        <p>{prompt}</p>
      </div>
      <button type="button" className="secondary-button" onClick={copyPrompt}>
        {copied ? 'Copied' : 'Copy Prompt'}
      </button>
    </article>
  );
}

export default PromptBox;
