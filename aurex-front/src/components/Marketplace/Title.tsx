interface Props {
  text: string;
  type?: "primary" | "secondary";
  className?: string;
}

export default function Title({
  text,
  type = "primary",
  className = "",
}: Props) {
  return (
    <div className={`relative m-4 ${className}`}>
      <div className={`w-36 h-2 mb-4 bg-secondary`} />
      <h2
        className={`text-5xl font-bold text-${
          type === "primary" ? "primary" : "white"
        }`}
      >
        {text}
      </h2>
    </div>
  );
}
