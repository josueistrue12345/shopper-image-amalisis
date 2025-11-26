interface IconProps {
  name: string;
  filled?: boolean;
  size?: number | string;
  className?: string;
}

export function Icon({ name, filled = false, size = 24, className = "" }: IconProps) {
  const iconClass = filled ? "msf-rounded" : "ms-rounded";
  return (
    <span
      className={`${iconClass} ${className}`}
      style={{ fontSize: typeof size === "number" ? `${size}px` : size }}
    >
      {name}
    </span>
  );
}
