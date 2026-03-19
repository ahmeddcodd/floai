export default function LegalSection({ title, children, last = false }) {
  return (
    <section className={last ? "legal-section" : "legal-section legal-section-spaced"}>
      <h2 className="section-title legal-heading">
        {title}
      </h2>
      {children}
    </section>
  );
}
