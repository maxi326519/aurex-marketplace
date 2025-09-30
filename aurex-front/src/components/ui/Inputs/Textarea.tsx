interface TextAreaInputData {
  name: string;
  value: string;
  label: string;
  error?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export default function TextAreaInput({
  name,
  value,
  label,
  error,
  disabled = false,
  onChange,
}: TextAreaInputData) {
  return (
    <div className={`form-floating ${name}`}>
      <textarea
        id={name}
        name={name}
        className={`form-control${error ? " is-invalid" : ""}${
          disabled ? " disabled bg-red" : ""
        }`}
        style={{
          height: "200px",
          ...(disabled ? { backgroundColor: "#ddd" } : {}),
        }}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
}
