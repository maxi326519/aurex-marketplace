interface Props {
  type: "primary" | "secondary";
  variant?: "solid" | "outline";
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  submit?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  type,
  variant = "solid",
  children,
  className,
  style,
  submit,
  disabled = false,
  onClick,
}: Props) {
  const baseStyles = "flex justify-center gap-4 px-4 py-2 rounded-lg border";

  const solidStyles =
    type === "primary"
      ? "bg-primary text-white border-primary"
      : "bg-secondary text-primary border-secondary";

  const outlineStyles =
    type === "primary"
      ? "bg-transparent text-primary border-primary"
      : "bg-transparent text-secondary border-secondary";

  return (
    <button
      type={submit ? "submit" : "button"}
      className={`${baseStyles} ${
        variant === "outline" ? outlineStyles : solidStyles
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
