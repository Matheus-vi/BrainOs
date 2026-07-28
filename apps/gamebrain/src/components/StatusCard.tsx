type StatusCardProps = {
  icon: string;
  title: string;
  status: string;
  color: string;
};

export default function StatusCard({
  icon,
  title,
  status,
  color,
}: StatusCardProps) {
  return (
    <div className="panel" style={{ marginBottom: "12px" }}>
      <h3>
        {icon} {title}
      </h3>

      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color }}>
          {status}
        </span>
      </p>
    </div>
  );
}