interface SelectProps {
  name: string;
  value: string;
  options: Array<string | number>;
  label?: string;
  error?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { Array<string> } options - Items to drop down list
 * @prop { string | undefined } label - Input label
 * @prop { string | undefined} error - Error message to display
 * @prop { () => void } onChange - Function for onChange input
 * @prop { boolean | undefined} disabled - If input should be disabled
 */
export default function Select({
  name,
  value,
  label,
  options,
  error,
  disabled = false,
  onChange,
}: SelectProps) {
  return (
    <div className="flex rounded-lg bg-white overflow-hidden">
      <select
        id={name}
        name={name}
        className="flex-grow text-black p-2"
        style={disabled ? { backgroundColor: "#ddd" } : {}}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{label}</option>
        {options &&
          options.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
      </select>
      {/*       <label htmlFor={name}>
        {label}
      </label> */}
      <small>{error}</small>
    </div>
  );
}
