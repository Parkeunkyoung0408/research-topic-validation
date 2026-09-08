type InfoPanelProps = { title: string; value: string };

export function InfoPanel({ title, value }: InfoPanelProps) {
  return (
    <section className="observability-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </section>
  );
}
