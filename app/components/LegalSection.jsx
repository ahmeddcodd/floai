export default function LegalSection({ title, children, last = false }) {
  return (
    <section style={last ? undefined : { marginBottom: "32px" }}>
      <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
