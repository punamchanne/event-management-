export default function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      {subtitle && <p className="text-base-content/70">{subtitle}</p>}
    </div>
  );
}
