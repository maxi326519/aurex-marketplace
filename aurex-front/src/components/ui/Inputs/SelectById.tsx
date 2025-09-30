interface SelectProps {
  name: string;
  value: string;
  label: string;
  list: Array<{ id: string; label: string }>;
  error?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { string } label - Input label
 * @prop { Array<string> } list - Items to drop down list
 * @prop { string | undefined} error - Error message to display
 * @prop { () => void } onChange - Function for onChange input
 * @prop { boolean | undefined} disabled - If input should be disabled
 */
export default function SelectById({
  name,
  value,
  label,
  list,
  error,
  disabled = false,
  onChange,
}: SelectProps) {
  return (
    <div className={`form-floating ${name}`}>
      <select
        id={name}
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`}
        style={disabled ? { backgroundColor: "#ddd" } : {}}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Seleccionar</option>
        {list &&
          list.map((item, i) => (
            <option key={i} value={item.id}>
              {item.label}
            </option>
          ))}
      </select>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <small>{error}</small>
    </div>
  );
}
