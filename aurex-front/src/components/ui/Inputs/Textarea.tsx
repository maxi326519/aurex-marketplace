interface TextAreaInputData {
  name: string;
  value: string;
  label?: string;
  formulated?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * @prop { string } name - Textarea name and id
 * @prop { string } value - Textarea value
 * @prop { string | undefined } label - Textarea label
 * @prop { string | undefined} error - Error message to display
 * @prop { boolean | undefined} formulated - If textarea should be disabled
 * @prop { () => void } onChange - Function for onChange textarea
 * @prop { boolean | undefined} disabled - If textarea should be disabled
 */
export default function TextAreaInput({
  name,
  value,
  label,
  error = "",
  formulated = false,
  disabled = false,
  onChange,
}: TextAreaInputData) {
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
      <textarea
        id={name}
        name={name}
        className={`text-black p-2 pt-5 focus:outline-none rounded-lg border border-gray-200 bg-white min-h-[200px] ${
          disabled ? "bg-gray-300" : ""
        }`}
        value={value}
        onChange={onChange}
        disabled={formulated || disabled}
      />
      <small>{error}</small>
    </div>
  );
}
