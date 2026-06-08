export default function ChecklistGroup({ group }) {
  return (
    <article className="check-card">
      <h3>{group.group}</h3>
      <ul className="check-list">
        {group.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
