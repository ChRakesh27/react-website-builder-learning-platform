import CodeBlock from './CodeBlock.jsx';

function GuideStep({ step, index }) {
  return (
    <article className="step-card">
      <div className="step-number">{index + 1}</div>
      <div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        {step.code && <CodeBlock label="Command" code={step.code} />}
      </div>
    </article>
  );
}

export default GuideStep;
