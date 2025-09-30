interface InputProps {
  name: string;
  value: string | number | undefined;
  label?: string;
  type?: string;
  formulated?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { string | number| undefined } label - Input label
 * @prop { string | undefined } type - Input type
 * @prop { string | undefined} error - Error message to display
 * @prop { boolean | undefined} formulated - If input should be disabled
 * @prop { () => void } onChange - Function for onChange input
 * @prop { boolean | undefined} disabled - If input should be disabled
 */
export default function Input({
  name,
  value,
  label,
  type = "text",
  error = "",
  formulated = false,
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <div className="relative flex flex-col overflow-hidden">
      {label && (
        <label
          htmlFor={name}
          className="absolute top-1 left-2 text-xs text-gray-500 font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className="text-black p-2 pt-5 focus:outline-none rounded-lg border border-gray-200 bg-white"
        style={disabled ? { backgroundColor: "#ddd" } : {}}
        value={value}
        type={type}
        onChange={onChange}
        disabled={formulated || disabled}
      />
      <small>{error}</small>
    </div>
  );
}
